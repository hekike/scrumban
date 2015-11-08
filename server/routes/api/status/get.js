'use strict'

const thinky = require('../../../models/thinky')
const Errors = thinky.Errors
const User = require('../../../models/user')

/**
* Check for status
*/
module.exports = function *() {
  try {
    yield User
      .get('fake-id')
      .run()
      .catch(Errors.DocumentNotFound, () => null)
  } catch (err) {
    this.status = 500
    this.body = {
      status: 'error'
    }
    return
  }

  this.body = {
    status: 'ok'
  }
}
