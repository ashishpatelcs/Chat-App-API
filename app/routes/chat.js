
const auth = require('./../middlewares/auth')
const chatController = require('./../controllers/chatController')
const appconfig = require('./../../config/appConfig')

const BASEURL = appconfig.apiVersion+'/chat'

module.exports.setRounder = app => {

    app.get(`${BASEURL}/get/for/user`, auth.isAuthorized, ()=>{})

    app.get(`${BASEURL}/get/for/group`, auth.isAuthorized, ()=>{})

    app.get(`${BASEURL}/mark/as/seen`, auth.isAuthorized, ()=>{})

}