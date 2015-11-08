'use strict'

const joi = require('joi')

const create = joi.object({
  data: joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    password: joi.string().required(),
    email: joi.string().email().required()
  })
})

module.exports = {
  create
}
