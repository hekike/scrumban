'use strict'

const thinky = require('./thinky')
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

User.ensureIndex('email')

module.exports = User
