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
  console.log('token:', token);
  console.log('userId:', botId);
  const options = {
    method: 'GET',
    url: `${process.env.ROCKETCHAT_URL}/api/v1/groups.listAll`,
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

const sendUserMessage = (message, robot, userName) => {
  robot.adapter.chatdriver.getDirectMessageRoomId(userName).then(response => {
    robot.adapter.chatdriver.sendMessageByRoomId(message, response.rid)
  })
}

module.exports = {
  newUserCheckAndCreate,
  getAuthToken,
  getPrivateRooms,
  sendUserMessage,
  downloadInvoice
}
