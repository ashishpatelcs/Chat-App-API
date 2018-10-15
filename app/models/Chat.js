const mongoose = require('mongoose')
const Schema = mongoose.Schema

let chatSchema = new Schema({
    chatId: { type: String, unique: true, required: true },
    createdOn: { type: Date, default: Date.now() },
    modifiedOn: { type: Date, default: Date.now() },
    receiverId: { type: String, default: '' },
    receiverName: { type: String, default: '' },
    senderId: { type: String, default: '' },
    senderName: { type: String, default: '' },
    message: { type: String, default: '' },
    seen: { type: Boolean, default: false },
    chatRoom: { type: String, default: '' }
})

module.exports = mongoose.model('Chat', chatSchema)