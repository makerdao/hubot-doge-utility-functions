const rp = require('request-promise')
const request = require('request')
const fs = require('fs')
const Duplex = require('stream').Duplex;

const newUserCheckAndCreate = (robot, userId) => {
  if (robot.brain.get(userId))
    return

  return createUser(robot, userId)
}

const createUser = (robot, userId) => robot.brain.set(userId, {})

const getAuthToken = () => {
  const options = {
    method: 'POST',
    uri: `${process.env.ROCKETCHAT_URL}/api/v1/login`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    body: {
      username: process.env.ROCKETCHAT_USER,
      password: process.env.ROCKETCHAT_PASSWORD
    },
    json: true,
  }
  return rp(options)
}

const getPrivateRooms = (data) => {
  const {authToken: token, userId: botId } = data
  const options = {
    method: 'GET',
    url: `${process.env.ROCKETCHAT_URL}/api/v1/groups.list`,
    headers:{
      'X-Auth-Token': token,
      'X-User-Id': botId,
    },
    json: true
  }
  return rp(options)
}


const downloadInvoice = (downloadUrl, data) => {
  const {authToken: token, userId: botId } = data
  const options = {
    method: 'GET',
    url: downloadUrl,
    headers:{
        Cookie: `rc_uid=${botId}; rc_token=${token};`
    },
    encoding: null
  }
  return new Promise( (resolve, reject) => {
    request(options, function (error, response, body) {
      error ? reject(`\`@doge\` is having trouble downloading the expense you uploaded:${error}`) : ''

      let stream = new Duplex();
      stream.push(body); // buffer gets converted to stream for upload
      stream.push(null);

      resolve(stream)
    })
  })
}

/**
 * @function addUserToGroup
 * User (in this case bot) MUST be in the channel that they invite user's to
 * @param {Object} data The authorization client credentials.
 * @param {Object} msg hubot's msg object
 * @param {String} groupId hubot's msg object
 */
const addUserToGroup = (data, msg, groupId) => {
  const {authToken: token, userId: botId } = data
  const options = {
    method: 'POST',
    url: `${process.env.ROCKETCHAT_URL}/api/v1/groups.invite`,
    headers:{
      'X-Auth-Token': token,
      'X-User-Id': botId,
    },
    body: {
      roomId: groupId,
      userId: msg.message.user.id
    },
    json: true
  }
  return rp(options)
}

const makeBotModeratorInGroup = (data, groupId) => {
  const {authToken: token, userId: botId } = data
  const options = {
    method: 'POST',
    url: `${process.env.ROCKETCHAT_URL}/api/v1/channels.addModerator`,
    headers:{
      'X-Auth-Token': token,
      'X-User-Id': botId,
    },
    body: {
      roomId: groupId,
      userId: botId
    },
    json: true
  }
  return rp(options)
}

const getUserInfo = (data, userName) => {
  const {authToken: token, userId: botId } = data
  const options = {
    method: 'GET',
    url: `${process.env.ROCKETCHAT_URL}/api/v1/users.info?username=${userName}`,
    headers:{
      'X-Auth-Token': token,
      'X-User-Id': botId,
    },
    json: true
  }
  return rp(options)
}

const removeUserFromGroup = (data, userId, groupId) => {
  const {authToken: token, userId: botId } = data
  const options = {
    method: 'POST',
    url: `${process.env.ROCKETCHAT_URL}/api/v1/groups.kick`,
    headers:{
      'X-Auth-Token': token,
      'X-User-Id': botId,
    },
    body: {
      roomId: groupId,
      userId: userId
    },
    json: true
  }
  return rp(options)
}

// R.Chat adapter functions
const getRoomIdByName = async (robot, roomName) => await robot.adapter.getRoomId(roomName)
const sendRoomMessage = (robot, msg) => async (roomId) => await robot.adapter.send({user: {roomID: false}, room: roomId}, msg )
const sendDirectMessage = (robot, msg) => async (userName) => await robot.adapter.sendDirect({user: { name: userName}}, msg )

/* customMessage takes message obj {msg: "Security Alert", rid: rid,
       attachments: [
         { title: "Maker employees who are not 2FA compliant:",
           text: "@iant \n @george "
          },
         { title: "Maker employees who are not email compliant:",
           text: "@iant \n @george "
          }
        ]
      }
*/
const customMessage = async (robot, msgObj) => await robot.adapter.customMessage(msgObj)

module.exports = {
  newUserCheckAndCreate,
  getAuthToken,
  addUserToGroup,
  makeBotModeratorInGroup,
  removeUserFromGroup,
  getPrivateRooms,
  downloadInvoice,
  getRoomIdByName,
  sendRoomMessage,
  sendDirectMessage,
  customMessage,
  getUserInfo
}
