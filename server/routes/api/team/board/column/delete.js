'use strict'

const logger = require('winston')
const Column = require('../../../../../models/column')
const thinky = require('../../../../../models/thinky')
const Errors = thinky.Errors
const r = thinky.r

/**
* Column remove
*/
module.exports = function *() {
  const columnId = this.params.columnId
  const teamId = this.params.teamId
  const boardId = this.params.boardId
  const isSoftRemove = !!this.query.archive
  let column

  logger.info(`remove column ${columnId} from team {$teamId} and board ${boardId}`)

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

  if (isSoftRemove) {
    column.isRemoved = true
    yield column.save()
  } else {
    // update orderIndex for remaining items
    let updateOrderIndex = Column
      .filter(
        r.row('boardId').eq(column.boardId)
        .and(r.row('orderIndex').gt(column.orderIndex))
      )
      .update({
        orderIndex: r.row('orderIndex').sub(1)
      })

    yield [
      column.purge(),
      updateOrderIndex.execute()
    ]
  }

  this.status = 204
}
