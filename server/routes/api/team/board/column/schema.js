'use strict'

const joi = require('joi')

const create = joi.object({
  data: joi.object({
    clientId: joi.string(),
    name: joi.string().required()
  }).required()
})

const order = joi.object({
  data: joi.object({
    clientId: joi.string(),
    orderIndex: joi.number().required()
  }).required()
})

module.exports = {
  create,
  order
}
