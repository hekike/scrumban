'use strict'

const Board = require('../../../../models/board')
const thinky = require('../../../../models/thinky')
const Errors = thinky.Errors

/**
* Board by id
*/
module.exports = function *() {
  const routeBoardId = this.params.boardId
  let board

  // query
  let query = Board
    .get(routeBoardId)

  try {
    board = yield query.run()
  } catch (err) {
    if (err instanceof Errors.DocumentNotFound) {
      this.throw(404, 'board not found')
    }

    throw err
  }

  this.body = board
}
