
const auth = require('./../middlewares/auth')
const chatController = require('./../controllers/chatController')
const appconfig = require('./../../config/appConfig')

const BASEURL = appconfig.apiVersion+'/chat'

module.exports.setRouter = (app) => {

    let BASEURL = `${appConfig.apiVersion}/chat`;
  
    /**
     * @apiGroup chat
     * @apiVersion  1.0.0
     * @api {get} /api/v1/chat/get/for/user to get paginated chats of user.
     * 
     * @apiParam {string} senderId userId of logged in user. (query params) (required)
     * @apiParam {string} receiverId userId receiving user. (query params) (required)
     * @apiParam {number} skip skip value for pagination. (query params) (optional)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
          "error": false,
          "message": "All Chats Listed",
          "status": 200,
          "data": [
            {
              "chatId": "IELO6EVjx",
              "modifiedOn": "2018-03-05T15:36:31.026Z",
              "createdOn": "2018-03-05T15:36:31.025Z",
              "message": "hello .. .. sourav",
              "receiverId": "-E9zxTYA8",
              "receiverName": "Rishabh Sengar",
              "senderId": "-cA7DiYj5",
              "senderName": "sourav das"
            },
            {
              "chatId": "ZcaxtEXPT",
              "modifiedOn": "2018-03-05T15:36:39.548Z",
              "createdOn": "2018-03-05T15:36:39.547Z",
              "message": "hello rishabh .. .. .. ",
              "receiverId": "-cA7DiYj5",
              "receiverName": "sourav das",
              "senderId": "-E9zxTYA8",
              "senderName": "Rishabh Sengar"
            },
            .........................
          ]
  
        }
   */
  
    // params: senderId, receiverId, skip.
    app.get(`${BASEURL}/get/for/user`, auth.isAuthorized, chatController.getUsersChat);
  
    // params: chatRoom, skip.
    app.get(`${BASEURL}/get/for/group`, auth.isAuthorized, chatController.getGroupChat);
  
    
    // params: chatIdCsv.
    app.post(`${BASEURL}/mark/as/seen`, auth.isAuthorized, chatController.markChatAsSeen);
  
    /**
     * @apiGroup chat
     * @apiVersion  1.0.0
     * @api {get} /api/v1/chat/count/unseen to get count of unseen messages.
     * 
     * @apiParam {string} userId userId of logged in user. (query params) (required)
     * @apiParam {string} senderId userId sending user. (query params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
          "error": false,
          "message": "unseen chat count found.",
          "status": 200,
          "data": 5
  
        }
   */
    // params: userId, senderId.
    app.get(`${BASEURL}/count/unseen`, auth.isAuthorized, chatController.countUnseenChat);
  
    /**
     * @apiGroup chat
     * @apiVersion  1.0.0
     * @api {get} /api/v1/chat/find/unseen to get paginated unseen chats of user.
     * 
     * @apiParam {string} userId userId of logged in user. (query params) (required)
     * @apiParam {string} senderId userId sending user. (query params) (required)
     * @apiParam {number} skip skip value for pagination. (query params) (optional)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
          "error": false,
          "message": "chat found and listed.",
          "status": 200,
          "data": [
            {
              "chatId": "IELO6EVjx",
              "modifiedOn": "2018-03-05T15:36:31.026Z",
              "createdOn": "2018-03-05T15:36:31.025Z",
              "message": "hello .. .. sourav",
              "receiverId": "-E9zxTYA8",
              "receiverName": "Rishabh Sengar",
              "seen": false,
              "senderId": "-cA7DiYj5",
              "senderName": "sourav das"
            },
            {
              "chatId": "ZcaxtEXPT",
              "modifiedOn": "2018-03-05T15:36:39.548Z",
              "createdOn": "2018-03-05T15:36:39.547Z",
              "message": "hello rishabh .. .. .. ",
              "receiverId": "-cA7DiYj5",
              "receiverName": "sourav das",
              "seen": false,
              "senderId": "-E9zxTYA8",
              "senderName": "Rishabh Sengar"
            },
            .........................
          ]
  
        }
   */
    // params: userId, senderId, skip.
    app.get(`${BASEURL}/find/unseen`, auth.isAuthorized, chatController.findUnseenChat);
  
    /**
     * @apiGroup chat
     * @apiVersion  1.0.0
     * @api {get} /api/v1/chat/unseen/user/list to get user list of unseen chats.
     * 
     * @apiParam {string} userId userId of logged in user. (query params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
          "error": false,
          "message": "All Chats Listed",
          "status": 200,
          "data": [
            {
              "chatId": "IELO6EVjx",
              "modifiedOn": "2018-03-05T15:36:31.026Z",
              "createdOn": "2018-03-05T15:36:31.025Z",
              "message": "hello .. .. sourav",
              "receiverId": "-E9zxTYA8",
              "receiverName": "Rishabh Sengar",
              "senderId": "-cA7DiYj5",
              "senderName": "sourav das"
            },
            {
              "chatId": "ZcaxtEXPT",
              "modifiedOn": "2018-03-05T15:36:39.548Z",
              "createdOn": "2018-03-05T15:36:39.547Z",
              "message": "hello rishabh .. .. .. ",
              "receiverId": "-cA7DiYj5",
              "receiverName": "sourav das",
              "senderId": "-E9zxTYA8",
              "senderName": "Rishabh Sengar"
            },
            .........................
          ]
  
        }
   */
    // params: userId.
    app.get(`${BASEURL}/unseen/user/list`, auth.isAuthorized, chatController.findUserListOfUnseenChat);
  
  }