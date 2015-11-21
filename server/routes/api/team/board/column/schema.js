'use strict'

const joi = require('joi')

const create = joi.object({
  data: joi.object({
    name: joi.string().required()
  }).required()
})

const order = joi.object({
  data: joi.object({
    source: joi.number().required(),
    target: joi.number().required()
  }).required()
})

module.exports = {
  create,
  order
}
