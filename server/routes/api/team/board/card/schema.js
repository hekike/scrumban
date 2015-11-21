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
    orderIndex: joi.number().required()
  }).required()
})

module.exports = {
  create,
  order
}
