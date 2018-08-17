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

const sendUserMessage = (message, robot, roomID) => {
  robot.messageRoom(roomID, message)
}

module.exports = {
  newUserCheckAndCreate,
  getAuthToken,
  addUserToGroup,
  getPrivateRooms,
  sendUserMessage,
  downloadInvoice
}
