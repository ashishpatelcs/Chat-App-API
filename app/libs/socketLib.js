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
    let myIO = io.of('/chat')

    myIO.on('connection', socket => {
        socket.emit('verifyUser')

        socket.on('set-user', authToken => {
            token.verifyTokenWithoutSecret(authToken, (err, user) => {
                if (err) {
                    socket.emit('auth-error', { status: 500, error: 'Please provide correct authToken!' })
                } else {
                    let currentUser = user.data
                    socket.userId = currentUser.userId
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    console.log(`${fullName} is online`)
                    // socket.emit(currentUser.userId, 'You are online')

                    user = { userId: currentUser.userId, fullName }
                    allOnlineUsers.push(user)

                    // setting chat room
                    socket.room = 'MyChat'
                    socket.join(socket.room)
                    socket.to(socket.room).broadcast.emit('online-users-list', allOnlineUsers)
                }
            })
        })

        socket.on('disconnect', () => {
            console.log('user is disconnected');
            console.log(socket.userId);

            let removeIndex = allOnlineUsers.map(user => user.userId).indexOf(socket.userId)
            allOnlineUsers.splice(removeIndex, 1)
            console.log(allOnlineUsers);

            socket.to(socket.room).broadcast.emit('online-users-list', allOnlineUsers)
            socket.leave(socket.room)
        })

        socket.on('chat-msg', (msg) => {
            myIO.emit(msg.receiverId, msg)
        })
    })
}

module.exports = {
    setServer
}