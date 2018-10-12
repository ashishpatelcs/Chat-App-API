const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')

/* Models */
const UserModel = mongoose.model('User')


// start user signup function 

let signUpFunction = (req, res) => {
    let validateUserInput = () => {
        return new Promise( (resolve, reject) => {
            if(req.body.email) {
                if(!validInput.Email(req.body.email)) {
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
}// end user signup function 

// start of login function 
let loginFunction = (req, res) => {
    
}


// end of the login function 


let logout = (req, res) => {
  
} // end of the logout function.


module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    logout: logout

}// end exports