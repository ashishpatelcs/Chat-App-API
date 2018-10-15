const socketio = require('socket.io')
const mongoose = require('mongoose')
const shortid = require('shortid')
const events = require('events')

const logger = require('./loggerLib')
const redisLib = require('./redisLib')
const check = require('./checkLib')
const token = require('./tokenLib')

const chatModel = require('./../models/Chat')

const eventEmitter = new events.EventEmitter()

let setServer = (server) => {
    // let allOnlineUsers = []
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

        socket.on('chat-msg', (data) => {
            data.chatId = shortid.generate()
            // emit event to save chat data with 2s delay to avoid affecting chat
            setTimeout(function () {
                eventEmitter.emit('save-chat', data)
            }, 2000)
            myIO.emit(msg.receiverId, data)
        })

        socket.on('typing', name => {
            socket.to(socket.room).broadcast.emit('typing' , name)
        })
    })
}

// database operations events
eventEmitter.on('save-chat', data => {
    let newChat = new chatModel({
        chatId: data.chatId,
        senderName: data.senderName,
        senderId: data.senderId,
        receiverName: data.receiverName,
        receiverId: data.receiverId,
        message: data.message,
        chatRoom: data.chatRoom || '',
        createdOn: data.createdOn
    })

    newChat.save((err, result) => {
        if (err) {
            logger.error(err, 'socketLib: save-chat', 10)
        } else if (check.isEmpty(result)) {
            logger.error('Chat not saved!', 'socketLib: Save-chat', 5)
        } else {
            logger.info('Chat saved!', 'socketLib: save-chat', 1)
        }
    })
})

module.exports = {
    setServer
}