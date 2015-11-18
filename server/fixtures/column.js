'use strict'

const Column = require('../models/column')

function * create (boardId) {
  const name = Math.random().toString(36).substring(7)

  let column = new Column({
    name: name,
    boardId: boardId
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
