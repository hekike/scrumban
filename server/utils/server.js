'use strict'

const HTTPStatus = require('http-status')

/**
 * @method favicon
 * @param {Generator} next
 */
function * favicon (next) {
  if (this.path.match(/^\/favicon.ico$/)) {
    this.status = 200
  } else {
    yield next
  }
}

/**
 * @method conditionalMw
 * @param {RegExp} regxp
 * @param {Function} middleware
 */
function conditionalMw (regxp, middleware) {
  return function * (next) {
    if (this.path.match(regxp)) {
      yield middleware.call(this, next)
    } else {
      yield next
    }
  }
}

/**
 * @method errorHandler
 * @param {Generator} next
 */
function * errorHandler (next) {
  try {
    yield next
  } catch (err) {
    let statusCode = err.status || 500

    // format this.throw(statusCode, errorMsg) to response
    let body = {
      error: HTTPStatus[statusCode],
      message: err.code ? 'Error happened' : err.message,
      statusCode: statusCode
    }

    // joi error
    if (err.reason) {
      body.reason = err.reason
    }

    if (statusCode > 499) {
      console.log(err)
    }

    this.status = body.statusCode
    this.body = body

    // since we handled this manually we'll
    // want to delegate to the regular app
    // level error handling as well so that
    // centralized still functions correctly.
    this.app.emit('error', err, this)
  }
}

module.exports.conditionalMw = conditionalMw
module.exports.errorHandler = errorHandler
module.exports.favicon = favicon
