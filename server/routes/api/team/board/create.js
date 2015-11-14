'use strict'

const _ = require('lodash')
const logger = require('winston')

const routesUtils = require('../../../../utils/routes')
const schema = require('./schema').create
const Board = require('../../../../models/board')

/**
* Create board
*/
module.exports = function *() {
  const body = yield routesUtils.joiValidate(this, schema)
  const teamId = this.params.teamId

  logger.info('create board', body.data.name)

  const data = _.merge({}, body.data, {
    teamId: teamId
  })

  // create board
  let board = new Board(data)
  board = yield board.saveAll({
    teamId: true
  })

  this.body = board
  this.status = 201
}
