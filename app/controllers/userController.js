const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const token = require('../libs/tokenLib')
const passwordLib = require('../libs/generatePasswordLib')

/* Models */
const UserModel = mongoose.model('User')


// start user signup function 

let signUpFunction = (req, res) => {
    // validate user input function
    let validateUserInput = () => {
        return new Promise( (resolve, reject) => {
            if(req.body.email) {
                if(!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, 'Email is Invalid', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, 'Password is missing', 500)
                    reject(apiResponse)
                } else {
                    resolve(req)
                }
            } else {
                logger.error('email or password field missing', 'signUpFunction : validateUserInput', 10)
                let apiResponse = response.generate(true, 'email or password field missing', 500, null)
                reject(apiResponse)
            }
        })
    }

    // create user function
    let createUser = () => {
        return new Promise( (resolve, reject) => {
            UserModel.findOne({ email: req.body.email })
            .then(user => {
                if(check.isEmpty(user)) {
                    let newuser = new UserModel({
                        userId: shortid.generate,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName || '',
                        email: req.body.email.toLowerCase(),
                        mobileNumber: req.body.mobileNumber,
                        password: passwordLib.hashpassword(req.body.password),
                        apiKey: req.body.apiKey || req.params.apiKey || req.query.apiKey,
                        createOn: time.now()
                    })
                    newuser.save( (err, user) => {
                        if(err) {
                            logger.error(err.message, 'signUpFunction: createUser', 10)
                            let apiResponse = response.generate(true, 'Failed to create user', 500, null)
                            reject(apiResponse)
                        } else {
                            let newuserObj = newuser.toObject()
                            resolve(newuserObj)
                        }
                    })
                } else {
                    logger.error('cannot create user. already present', 'signUpFunction: createUser', 5)
                    let apiResponse = response.generate(true, 'User already present with this email', 403, null)
                    reject(apiResponse)
                }
            })
            .catch(err => {
                logger.error(err, 'SignUpFunction: createUser', 10)
                let apiResponse = response.generate(true, 'Failed to create user', 500, null)
                reject(apiResponse)
            })
        })
    }

    // handle the request and response
    validateUserInput(req, res)
    .then(createUser)
    .then( resolve => {
        delete resolve.password
        let apiResponse = response.generate(false, 'Use Created!', 200, resolve)
        res.send(apiResponse)
    })
    .catch( err => {
        console.log(err)
        res.send(err)
    })
}// end user signup function 

// start of login function 
let loginFunction = (req, res) => {
    // find user function
    let findUser = () => {
        console.log('find user')
        return new Promise( (resove, reject) => {
            if(req.body.email) {
                UserModel.findOne({ email: req.body.email })
                .then(user => {
                    if(check.isEmpty(user)) {
                        logger.error('No user found', 'loginFunction : findUser', 5)
                        let apiResponse = response.generate(true, 'Use does not exist', 500, null)
                        reject(apiResponse)
                    } else {
                        logger.info('user found', 'loginFunction: findUser', 1)
                        resolve(user)
                    }
                })
                .catch(err => {
                    logger.error('failed to retrieve user data', 'loginFunction : findUser', 10)
                    let apiResponse = response.generate(true, 'Failed to find user', 500, null)
                    reject(apiResponse)
                })
            }
        })
    }

    // validate password function
    let validatePassword = (user) => {
        return new Promise( (resolve, reject) => {
            passwordLib.comparePassword(req.body.password, user.password, (err, isMatch) => {
                if(err) {
                    logger.error('login failed due to some error', 'loginfunction: validatePassword', 5)
                    let apiResponse = response.generate(true, 'login failed. some error occured.', 500, 10)
                    reject(apiResponse)
                } else if (isMatch) {
                    let userObj = user.toObject
                    delete userObj.password
                    delete userObj.__v
                    delete userObj._id
                    delete userObj.createdOn
                    delete userObj.modifiedOn
                    resolve(user)
                } else {
                    logger.error('login failed due to invalid password', 'loginfunction: validatePassword', 5)
                    let apiResponse = response.generate(true, 'login failed. wrong password.', 403, 10)
                    reject(apiResponse)
                }
            })
        })
    }

    // generate token function
    let generateToken = (user) => {
        return new Promise( (resolve, reject) => {
            token.generateToken(user, (err, tokenDetails) => {
                if(err) {
                    logger.error('Failed to generate token', 'loginFunction: generateToken', 10)
                    let apiResponse = response.generate(true, 'Error occured', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = user.userId
                    tokenDetails.userDetails = user
                    resolve(tokenDetails)
                }
            })
        })
    }

    // login user
    findUser(req, res)
    .then(validatePassword)
    .then(generateToken)
    .then( resolve => {
        let apiResponse = response.generate(false, 'Login successful', 200, resolve)
        res.status(200)
        res.send(apiResponse)
    })
    .catch( err => {
        console.log(err)
        res.status(err.status)
        res.send(err)
    })
}


// end of the login function 


let logout = (req, res) => {
  
} // end of the logout function.


module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    logout: logout

}// end exports