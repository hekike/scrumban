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
  const isIncludeCards = include.indexOf('cards') > -1
  let board

  // query
  let query = Board
    .get(routeBoardId)

  // include teams
  if (isIncludeColumns || isIncludeCards) {
    query = query.getJoin({
      columns: true
    })
  }

  // include cards
  if (isIncludeCards) {
    query = query.getJoin({
      cards: true
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

  if (isIncludeColumns || isIncludeCards) {
    board.columns = _.sortBy(board.columns, 'orderIndex')
  }

  if (isIncludeCards) {
    board.columns = board.columns.map(column => {
      column.cards = _.filter(board.cards, {
        columnId: column.id
      })
      column.cards = _.sortBy(column.cards, 'orderIndex')
      return column
    })

    board.cards = undefined
  }

  this.body = board
}
