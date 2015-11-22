'use strict'

const _ = require('lodash')
const Card = require('../models/card')

function * create (teamId, boardId, columnId, params) {
  params = _.defaults(params || {}, {
    name: Math.random().toString(36).substring(7),
    orderIndex: 0
  })

  let card = new Card({
    name: params.name,
    teamId: teamId,
    boardId: boardId,
    columnId: columnId,
    orderIndex: params.orderIndex
  })
  card = yield card.saveAll({
    teamId: true,
    boardId: true,
    columnId: true
  })

  return card
}

function * destroy (card) {
  yield card.purge()
}

module.exports.create = create
module.exports.destroy = destroy
