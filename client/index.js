const socket = io('http://localhost:3000')
const authToken = ''
const userId = ''

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