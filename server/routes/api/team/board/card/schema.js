'use strict'

const joi = require('joi')

const create = joi.object({
  data: joi.object({
    clientId: joi.string(),
    name: joi.string().required(),
    columnId: joi.string().required()
  }).required()
})

const order = joi.object({
  data: joi.object({
    clientId: joi.string(),
    orderIndex: joi.number().required(),
    columnId: joi.string().required()
  }).required()
})

module.exports = {
  create,
  order
}
