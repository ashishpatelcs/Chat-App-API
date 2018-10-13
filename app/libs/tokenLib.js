const jwt = require('jsonwebtoken')
const shortid = require('shortid')

const secretkey = 'someverylongrandomstringthatnobodycanguess'

let generateToken = (data, cb) => {
    try {
        let currenttime = Date.now()
        let claims = {
            jwtid: shortid.generate(),
            iat: currenttime,
            exp: Math.floor(currenttime / 1000) + (60 * 60 * 24),
            sub: 'authToken',
            iss: 'edChat',
            data
        }
        let tokenDetails = {
            token: jwt.sign(claims, secretkey),
            tokenSecret: secretkey
        }
        cb(null, tokenDetails)
    }
    catch(err) {
        console.log(err)
        cb(err, null)
    }
}

let verifyToken = (token, secret, cb) => {
    jwt.verify(token, secret, (err, decoded) => {
        if(err) {
            console.log('error occured while verifying token')
            console.log(err)
            cb(err, null)
        } else {
            console.log('user verified')
            console.log(decoded)
            cb(null, decoded)
        }
    })
}

module.exports = {
    generateToken,
    verifyToken
}
