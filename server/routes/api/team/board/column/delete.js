'use strict'

const Column = require('../../../../../models/column')
const thinky = require('../../../../../models/thinky')
const Errors = thinky.Errors

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
    yield column.delete()
  }

  this.status = 204
}
