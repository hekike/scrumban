'use strict'

const _ = require('lodash')
const logger = require('winston')

const routesUtils = require('../../../../../utils/routes')
const schema = require('./schema').create
const Board = require('../../../../../models/board')
const Card = require('../../../../../models/card')
const Column = require('../../../../../models/column')
const thinky = require('../../../../../models/thinky')
const Errors = thinky.Errors

/**
* Create board card
*/
module.exports = function *() {
  const body = yield routesUtils.joiValidate(this, schema)
  const teamId = this.params.teamId
  const boardId = this.params.boardId
  let result

  logger.info(`create card ${body.data.name} for board ${boardId}`)

  try {
    result = yield {
      board: Board.get(boardId).run(),
      column: Column.get(body.data.columnId).run()
    }
  } catch (err) {
    if (err instanceof Errors.DocumentNotFound) {
      this.throw(404, 'board or team not found')
    }

    throw err
  }

  // auth
  if (result.board.teamId !== teamId) {
    this.throw(401, 'unauthorized board access')
  }

  if (result.column.boardId !== boardId) {
    this.throw(401, 'unauthorized column access')
  }

  // create card
  const columnCardCount = yield Card
    .filter({
      columnId: body.data.columnId
    })
    .count()
    .execute()

  const data = _.merge({}, body.data, {
    boardId: boardId,
    orderIndex: columnCardCount
  })

  // create card
  let card = new Card(data)
  card = yield card.saveAll({
    boardId: true,
    cardId: true
  })

  this.body = card
  this.status = 201
}
