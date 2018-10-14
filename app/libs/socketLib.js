const socketio = require('socket.io')
const mongoose = require('mongoose')
const shortid = require('shortid')
const events = require('events')

const logger = require('../libs/loggerLib')
const response = require('../libs/responseLib')
const check = require('../libs/checkLib')
const token = require('../libs/tokenLib')

const eventEmitter = new events.EventEmitter()

let setServer = (server) => {
    let allOnlineUsers = []
    let io = socketio.listen(server)
    let myIO = io.of('')
}

module.exports = {
    setServer
}