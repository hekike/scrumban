'use strict'

const _ = require('lodash')
const Board = require('../../../../models/board')
const thinky = require('../../../../models/thinky')
const Errors = thinky.Errors

/**
* Board by id
*/
module.exports = function *() {
  const routeBoardId = this.params.boardId
  const include = _.isString(this.query.include) ? this.query.include.split(',') : []
  const isIncludeColumns = include.indexOf('columns') > -1
  let board

  // query
  let query = Board
    .get(routeBoardId)

  // include teams
  if (isIncludeColumns) {
    query = query.getJoin({
      columns: true
    })
  }

  try {
    board = yield query.run()
  } catch (err) {
    if (err instanceof Errors.DocumentNotFound) {
      this.throw(404, 'board not found')
    }

    throw err
  }

  // TODO: mock cards
  if (isIncludeColumns) {
    board.columns = _.sortBy(board.columns, 'orderIndex')

    board.columns = board.columns.map(column => {
      column.cards = []
      return column
    })
  }

  this.body = board
}
