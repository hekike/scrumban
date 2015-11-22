'use strict'

const _ = require('lodash')
const logger = require('winston')

const routesUtils = require('../../../../../utils/routes')
const schema = require('./schema').create
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
  let column

  logger.info(`create card ${body.data.name} for team {$teamId} and board ${boardId}`)

  // get related column
  try {
    column = yield Column.get(body.data.columnId).pluck('id', 'teamId', 'boardId').run()
  } catch (err) {
    if (err instanceof Errors.DocumentNotFound) {
      this.throw(404, 'column, board or team not found')
    }

    throw err
  }

  // auth
  if (column.teamId !== teamId || column.boardId !== boardId) {
    this.throw(401, 'unauthorized column access')
  }

  // create card
  const orderIndex = yield Card
    .filter({
      teamId: teamId,
      boardId: boardId,
      columnId: body.data.columnId
    })
    .count()
    .execute()

  const data = _.merge({}, body.data, {
    teamId: teamId,
    boardId: boardId,
    orderIndex: orderIndex
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
