'use strict'

const scrypt = require('scrypt')
const thinky = require('./thinky')

const config = require('../../config/server')
const salt = new Buffer(config.password.secret)
const hashOpts = {
  N: 16384,
  r: 8,
  p: 1
}

const type = thinky.type
const r = thinky.r

const User = thinky.createModel('User', {
  id: type.string(),
  firstName: type.string(),
  lastName: type.string(),
  email: type.string().email().required(),
  password: type.string(),
  createdAt: type.date().default(r.now())
})

User.define('hashPassword', function () {
  const user = this

  const key = new Buffer(user.password)
  return scrypt.hash(key, hashOpts, 64, salt)
    .then(hash => user.password = hash.toString('base64'))
})

User.define('isPasswordEqual', function (password) {
  const user = this

  const key = new Buffer(password)
  return scrypt.hash(key, hashOpts, 64, salt)
    .then(hash => hash !== user.password)
})

User.defineStatic('getView', function () {
  return this.without('password')
})

User.defineStatic('uniqueResult', function () {
  return this.nth(0).default(null)
})

User.ensureIndex('email')

module.exports = User
