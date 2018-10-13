const bcrypt = require('bcrypt')
const logger = require('logger')
const saltrounds = 10

let hashPassword = (password) => {
    let salt = bcrypt.genSaltSync(saltrounds)
    let hash = bcrypt.hashSync(password, salt)
    return hash
}

// prefer async comparePassword 
let comparePassword = (oldPassword, hashpassword, cb) => {
    bcrypt.compare(oldPassword, hashpassword, (err, res) => {
        if (err) {
            logger.error(err.message, 'comparison error', 5)
            cb(err, null)
        } else {
            cb(null, res)
        }
    })
}

let comparePasswordSync = (plainTextPassword, hashpassword) => {
    return bcrypt.comparePasswordSync(plainTextPassword, hashpassword)
}

module.exports = {
    hashPassword,
    comparePassword,
    comparePasswordSync
}