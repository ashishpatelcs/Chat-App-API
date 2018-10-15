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

let getUsersChat = (req, res) => {

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