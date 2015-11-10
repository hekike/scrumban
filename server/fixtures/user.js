'use strict'

const User = require('../models/user')
const Session = require('../models/session')
const config = require('../../config/server')

function * createLoggedInUser () {
  let user = new User({
    email: 'test@test.com',
    password: 'secret',
    firstName: 'John',
    lastName: 'Doe'
  })
  yield user.hashPassword()
  user = yield user.save()

  const token = yield Session.create({
    uid: user.id,
    ttl: config.jwt.ttl
  })

  return {
    user,
    token
  }
}

function * destroyLoggedInUser (user) {
  yield [Session.destroyUser(user.id), user.delete()]
}

module.exports.createLoggedInUser = createLoggedInUser
module.exports.destroyLoggedInUser = destroyLoggedInUser
