'use strict'

const User = require('../../../models/user')

/**
* Check for status
*/
module.exports = function *() {
  try {
    yield User.count().execute()
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
