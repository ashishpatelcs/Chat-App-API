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

    myIO.on('connection', socket => {
        socket.emit('verifyUser')

        socket.on('set-user', authToken => {
            token.verifyToken(authToken, (err, user) => {
                if (err) {
                    socket.emit('auth-error', { status: 404, error: 'Please provide '})
                }
            })
        })
    })
}

module.exports = {
    setServer
}