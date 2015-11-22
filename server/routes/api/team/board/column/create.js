'use strict'

const _ = require('lodash')
const logger = require('winston')

const routesUtils = require('../../../../../utils/routes')
const schema = require('./schema').create
const Board = require('../../../../../models/board')
const Column = require('../../../../../models/column')
const thinky = require('../../../../../models/thinky')
const Errors = thinky.Errors

/**
* Create board column
*/
module.exports = function *() {
  const body = yield routesUtils.joiValidate(this, schema)
  const teamId = this.params.teamId
  const boardId = this.params.boardId
  let board

  logger.info(`create column ${body.data.name} for board ${boardId}`)

  try {
    board = yield Board.get(boardId).run()
  } catch (err) {
    if (err instanceof Errors.DocumentNotFound) {
      this.throw(404, 'board not found')
    }

    throw err
  }

  // auth
  if (board.teamId !== teamId) {
    this.throw(401, 'unauthorized board access')
  }

  const boardColumnCount = yield Column
    .filter({
      boardId: boardId
    })
    .count()
    .execute()

  const data = _.merge({}, body.data, {
    teamId: teamId,
    boardId: boardId,
    orderIndex: boardColumnCount
  })

  // create column
  let column = new Column(data)
  column = yield column.saveAll({
    boardId: true
  })

  this.body = column
  this.status = 201
}
