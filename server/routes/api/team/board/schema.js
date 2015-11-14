'use strict'

const joi = require('joi')

const create = joi.object({
  data: joi.object({
    name: joi.string().required()
  })
})

module.exports = {
  create
}
