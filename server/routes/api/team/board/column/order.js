'use strict'

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
  const routeColumnId = this.params.columnId
  let column

  // query
  let query = Column
    .get(routeColumnId)

  try {
    column = yield query.run()
  } catch (err) {
    if (err instanceof Errors.DocumentNotFound) {
      this.throw(404, 'column not found')
    }

    throw err
  }

  const updateSpecific = Column
    .get(routeColumnId)
    .update({
      orderIndex: body.data.target
    })

  let updateOthers

  // moved forward
  if (body.data.source < body.data.target) {
    updateOthers = Column
      .filter(
        r.row('boardId').eq(column.boardId)
        .and(r.row('id').ne(routeColumnId))
        .and(r.row('orderIndex').ge(body.data.source))
        .and(r.row('orderIndex').le(body.data.target))
      )
      .update({
        orderIndex: r.row('orderIndex').sub(1)
      })

  // moved back
  } else {
    updateOthers = Column
      .filter(
        r.row('boardId').eq(column.boardId)
        .and(r.row('id').ne(routeColumnId))
        .and(r.row('orderIndex').ge(body.data.target))
        .and(r.row('orderIndex').le(body.data.source))
      )
      .update({
        orderIndex: r.row('orderIndex').add(1)
      })
  }

  yield updateSpecific.execute()
  yield updateOthers.execute()

  this.status = 204
}
