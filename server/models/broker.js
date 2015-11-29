const mosca = require('mosca')
const amqp = require('amqp')
const logger = require('winston')

const moscaSetting = {
  port: 1884,
  backend: {
    type: 'amqp',
    json: false,
    amqp: amqp,
    exchange: 'amq.topic'
  }
}

const authenticate = function (client, username, password, callback) {
  if (username === 'test' && password.toString() === 'test') {
    callback(null, true)
  } else {
    callback(null, false)
  }
}

const authorizePublish = function (client, topic, payload, callback) {
  callback(null, true)
}

const authorizeSubscribe = function (client, topic, callback) {
  callback(null, true)
}

const server = new mosca.Server(moscaSetting)

server.on('ready', setup)

function setup () {
  server.authenticate = authenticate
  server.authorizePublish = authorizePublish
  server.authorizeSubscribe = authorizeSubscribe

  logger.info('Mosca server is up and running.')
}

server.on('error', function (err) {
  logger.info(err)
})

server.on('clientConnected', function (client) {
  logger.info('Client Connected \t:= ', client.id)
})

server.on('published', function (packet, client) {
  logger.info('Published :=', packet)
})

server.on('subscribed', function (topic, client) {
  logger.info('Subscribed :=', topic, client.id)
})

server.on('unsubscribed', function (topic, client) {
  logger.info('unsubscribed := ', topic)
})

server.on('clientDisconnecting', function (client) {
  logger.info('clientDisconnecting := ', client.id)
})

server.on('clientDisconnected', function (client) {
  logger.info('Client Disconnected     := ', client.id)
})

module.exports = server
