const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const request = require('request')
const Auth = require('../models/Auth')

const logger = require('../libs/loggerLib')
const response = require('../libs/responseLib')
const token = require('../libs/tokenLib')
const check = require('../libs/checkLib')

let isAuthorized = (req, res, next) => {
    let authToken = req.query.authToken || req.params.authToken || req.body.authToken || req.header('authToken')
    if (authToken) {
        Auth.findOne({ authToken }, (err, newAuthToken) => {
            if (err) {
                logger.error(err, 'Authorization Middleware', 10)
                let apiResponse = response.generate(true, 'You are not authorized', 500, null)
                res.send(apiResponse)
            } else if(check.isEmpty(newAuthToken)) {
                logger.error('no authorizaiton key present', 'Authorization Middleware', 5)
                let apiResponse = response.generate(true, 'No authorization key present or expired', 404, null)
                res.send(apiResponse)
            } else {
                token.verifyToken(newAuthToken.authToken, newAuthToken.tokenSecret, (err, decoded) => {
                    if(err) {
                        logger.error(err, 'Authorization Middleware: verifyToken', 10)
                        let apiResponse = response.generate(true, 'Authorizaiton token verification failed', 500, null)
                        res.send(apiResponse)
                    } else {
                        req.user = { userId: decoded.data.userId }
                        next()
                    }
                })
            }
        })
    } else {
        logger.error('authToken is missing', 'Authorization Middleware', 10)
        let apiResponse = response.generate(true, 'authToken is missing', 500, null)
        res.send(apiResponse)
    }
}