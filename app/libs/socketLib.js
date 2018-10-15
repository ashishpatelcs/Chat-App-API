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
                    let key = currentUser.userId, value = fullName

                    let setUserOnline = redisLib.setOnlineUser('onlineUsers', key, value, (err, result) => {
                        if (err) logger.error(err, 'socketLib: setuserOnline', 10)
                        else {
                            redisLib.getAllUsers('onlineUsers', (err, result) => {
                                if (err) logger.error(err, 'socketLib: setuserOnline', 10)
                                else {
                                    console.log(`${fullName} is online`)
                                    // setting chat room
                                    socket.room = 'MyChat'
                                    socket.join(socket.room)
                                    socket.to(socket.room).broadcast.emit('online-user-list', result)
                                }
                            })
                        }
                    })

                    // socket.emit(currentUser.userId, 'You are online')
                    // user = { userId: currentUser.userId, fullName }
                    // allOnlineUsers.push(user)
                }
            })
        })

        socket.on('disconnect', () => {
            if (socket.userId) {
                redisLib.deleteUser('onlineUsers', socket.userId)
                redisLib.getAllUsers('onlineUsers', (err, result) => {
                    if (err) logger.error(err, 'socketLib: disconnect', 10)
                    else {
                        socket.leave(socket.room)
                        socket.to(socket.room).broadcast.emit('online-user-list', result)
                    }
                })
            }

            // let removeIndex = allOnlineUsers.map(user => user.userId).indexOf(socket.userId)
            // allOnlineUsers.splice(removeIndex, 1)
            // console.log(allOnlineUsers);
        })

        socket.on('chat-msg', (data) => {
            data.chatId = shortid.generate()
            // emit event to save chat data with 2s delay to avoid affecting chat
            setTimeout(function () {
                eventEmitter.emit('save-chat', data)
            }, 2000)
            myIO.emit(data.receiverId, data)
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