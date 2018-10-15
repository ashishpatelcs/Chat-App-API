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

module.exports = {
    getAllUsers
}