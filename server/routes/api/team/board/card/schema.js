'use strict'

const joi = require('joi')

const create = joi.object({
  data: joi.object({
    name: joi.string().required(),
    columnId: joi.string().required()
  }).required()
})

const order = joi.object({
  data: joi.object({
    orderIndex: joi.number().required(),
    columnId: joi.string().required(),
    clientId: joi.string()
  }).required()
})

module.exports = {
  create,
  order
}
