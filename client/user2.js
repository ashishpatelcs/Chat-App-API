const socket = io('http://localhost:3000')
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Ijl6Y3N0bVAtWiIsImlhdCI6MTUzOTUxMzc2NjY3OSwiZXhwIjoxNTM5NjAwMTY2LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7Im1vYmlsZU51bWJlciI6MCwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwibGFzdE5hbWUiOiJQYXRlbCIsImZpcnN0TmFtZSI6IkFzaGlzaCIsInVzZXJJZCI6IlJ3WWxLUjF2cCJ9fQ.n4W8EHxN0RrJ9bxAFRrxZ8NyL2SDNZOM3usrgFKKImY'
const userId = 'RwYlKR1vp'

let chatMsg = {
    createdOn: Date.now(),
    receiverId: '',
    receiverName: 'ABC Guy',
    senderId: userId,
    senderName: 'Ashish Patel'
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
}

chatSocket()