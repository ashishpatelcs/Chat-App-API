const mongoose = require('mongoose')
const shortid = require('shortid')

const time = require('./../libs/timeLib')
const check = require('./../libs/checkLib')
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib')
const passwordLib = require('./../libs/generatePasswordLib')
const validateInput = require('./../libs/paramsValidationLib')

const chatModel = require('./../models/Chat')
const userModel = require('./../models/User')
const authModel = require('./../models/Auth')

const MSGLIMIT = 10

let getUsersChat = (req, res) => {
    let receiver = req.query.receiverId
    let sender = req.query.senderId
    let skip = parseInt(req.query.skip)

    chatModel.find( { $or: [{ receiverId: receiver, senderId: sender }, { receiverId: sender, senderId: receiver } ] }).skip(skip).limit(MSGLIMIT)
    .then(chatMessages => {
        if (check.isEmpty(chatMessages)) {
            let apiResponse = response.generate(false, 'No new messages found!', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'new messages found!', 200, chatMessages)
            res.send(apiResponse)
        }
    })
    .catch(err => {
        logger.error(err, 'chatController: getUsersChat', 10)
        let apiResponse = response.generate(true, 'Some error occured!', 500, null)
        res.send(apiResponse)
    })
}

let getGroupChat = (req, res) => {

}

let markChatAsSeen = (req, res) => {

}

let countUnseenChat = (req, res) => {

}

let findUnseenChat = (req, res) => {

}

let findUserListOfUnseenChat = (req, res) => {

}

module.exports = {
    getUsersChat,
    getGroupChat,
    markChatAsSeen,
    countUnseenChat,
    findUnseenChat,
    findUserListOfUnseenChat
}