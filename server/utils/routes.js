'use strict'

const thunkify = require('thunkify')
const joi = require('joi')
const validate = thunkify(joi.validate)
const logger = require('winston')

/**
 * @method joiValidate
 * @param {Object} ctx
 * @param {Error} err
 */
function * joiValidate (ctx, schema) {
  let body

  try {
    body = yield validate(ctx.request.body, schema)
  } catch (err) {
    const reason = err.details[0].message

    logger.warn('joi validate, invalid data', reason)

    ctx.throw(400, 'Validation Error', {
      reason: reason
    })
  }

  return body
}

module.exports = {
  joiValidate
}
