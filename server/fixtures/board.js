'use strict'

const Board = require('../models/board')

function * create (teamId) {
  const name = Math.random().toString(36).substring(7)

  let board = new Board({
    name: name,
    teamId: teamId
  })
  board = yield board.saveAll({
    teamId: true
  })

  return board
}

function * destroy (board) {
  yield board.purge()
}

module.exports.create = create
module.exports.destroy = destroy
