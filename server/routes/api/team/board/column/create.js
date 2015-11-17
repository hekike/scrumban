'use strict'

const _ = require('lodash')
const logger = require('winston')

const routesUtils = require('../../../../../utils/routes')
const schema = require('./schema').create
const Column = require('../../../../../models/column')

/**
* Create board column
*/
module.exports = function *() {
  const body = yield routesUtils.joiValidate(this, schema)
  const boardId = this.params.boardId

  logger.info(`create column ${body.data.name} for board ${boardId}`)

  const data = _.merge({}, body.data, {
    boardId: boardId
  })

  // create column
  let column = new Column(data)
  column = yield column.saveAll({
    teamId: true
  })

  this.body = column
  this.status = 201
}
