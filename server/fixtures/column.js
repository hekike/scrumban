'use strict'

const _ = require('lodash')
const Column = require('../models/column')

function * create (boardId, params) {
  params = _.defaults(params || {}, {
    name: Math.random().toString(36).substring(7),
    orderIndex: 0
  })

  let column = new Column({
    name: params.name,
    boardId: boardId,
    orderIndex: params.orderIndex
  })
  column = yield column.saveAll({
    teamId: true
  })

  return column
}

function * destroy (column) {
  yield column.purge()
}

module.exports.create = create
module.exports.destroy = destroy
