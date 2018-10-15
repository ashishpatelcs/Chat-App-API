const redis = require('redis')
const check = require('./checkLib')

let client = redis.createClient()

client.on('connect', () => console.log('redis connection open!'))

let getAllUsers = (hash, callback) => {
    client.HGETALL(hash, (err, result) => {
        if (err) callback(err, null)
        else if (check.isEmpty(result)) callback(null, {})
        else callback(null, result)
    })
}

let setOnlineUser = (hash, key, value, callback) => {
    client.HMSET(hash, [key, value], (err, result) => {
        if (err) callback(err, null)
        else callback(null, result)
    })
}

let deleteUser = (hash, key) => {
    client.HDEL(hash, key)
    return true
}

module.exports = {
    getAllUsers,
    setOnlineUser,
    deleteUser
}