const socket = io('http://localhost:3000/chat')
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Ii1wLVlvNDhKRCIsImlhdCI6MTUzOTU2NjgxMzc2NCwiZXhwIjoxNTM5NjUzMjEzLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7Im1vYmlsZU51bWJlciI6MCwiZW1haWwiOiJkZW1vQHNpbmdoLmNvbSIsImxhc3ROYW1lIjoiU2luZ2giLCJmaXJzdE5hbWUiOiJEZW1vIiwidXNlcklkIjoiS0RXakdlRXg0In19._qR3pwapNRrk0_6cMXkBG8HufS-x9_NVUWucqQj1MHM'
const userId = 'KDWjGeEx4'

let chatMsg = {
    createdOn: Date.now(),
    receiverId: 'RwYlKR1vp',
    receiverName: 'Ashish Patel',
    senderId: userId,
    senderName: 'Demo Singh',
    msg: ''
}

let chatSocket = () => {
    socket.on('verifyUser', (data) => {
        console.log('verifying user')
        socket.emit('set-user', authToken)
    })

    socket.on(userId, data => {
        console.log('You received a message')
        console.log(data);
    })

    socket.on('online-users-list', allOnlineUsers => {
        console.log('online users list updated!');
        console.log(allOnlineUsers)
    })

    let button = document.getElementById('send')
    button.onclick = () => {
        let msgbody = document.getElementById('msg').value
        console.log('msg: ' + msgbody);
        chatMsg.msg = msgbody
        socket.emit('chat-msg', chatMsg)
    }
}

chatSocket()