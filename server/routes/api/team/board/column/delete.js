'use strict'

const Column = require('../../../../../models/column')
const thinky = require('../../../../../models/thinky')
const Errors = thinky.Errors
const r = thinky.r

/**
* Column remove
*/
module.exports = function *() {
  const routeColumnId = this.params.columnId
  const isSoftRemove = !!this.query.archive
  let column

  // query
  let query = Column
    .get(routeColumnId)

  try {
    column = yield query.run()
  } catch (err) {
    if (err instanceof Errors.DocumentNotFound) {
      this.throw(404, 'board not found')
    }

    throw err
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
      column.delete(),
      updateOrderIndex.execute()
    ]
  }

  this.status = 204
}
