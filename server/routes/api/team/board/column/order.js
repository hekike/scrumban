'use strict'

const logger = require('winston')
const Column = require('../../../../../models/column')
const thinky = require('../../../../../models/thinky')
const routesUtils = require('../../../../../utils/routes')
const schema = require('./schema').order
const Errors = thinky.Errors
const r = thinky.r

/**
* Column order
*/
module.exports = function *() {
  const body = yield routesUtils.joiValidate(this, schema)
  const columnId = this.params.columnId
  const teamId = this.params.teamId
  const boardId = this.params.boardId
  let column

  logger.info(`order column ${columnId} from team {$teamId} and board ${boardId}`)
  logger.info(`order column ${columnId} to`, body.data)

  // get related column
  try {
    column = yield Column
      .get(columnId)
      .pluck('id', 'teamId', 'boardId', 'orderIndex')
      .run()
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

  // update order
  const updateSpecific = Column
    .get(columnId)
    .update({
      orderIndex: body.data.orderIndex
    })

  let updateOthers

  // moved forward
  if (column.orderIndex < body.data.orderIndex) {
    updateOthers = Column
      .filter(
        r.row('boardId').eq(column.boardId)
        .and(r.row('id').ne(columnId))
        .and(r.row('orderIndex').ge(column.orderIndex))
        .and(r.row('orderIndex').le(body.data.orderIndex))
      )
      .update({
        orderIndex: r.row('orderIndex').sub(1)
      })

  // moved back
  } else {
    updateOthers = Column
      .filter(
        r.row('boardId').eq(column.boardId)
        .and(r.row('id').ne(columnId))
        .and(r.row('orderIndex').ge(body.data.orderIndex))
        .and(r.row('orderIndex').le(column.orderIndex))
      )
      .update({
        orderIndex: r.row('orderIndex').add(1)
      })
  }

  yield [
    updateSpecific.execute(),
    updateOthers.execute()
  ]

  this.status = 204
}
