'use strict'

const thinky = require('./thinky')
const Board = require('./board')
const type = thinky.type
const r = thinky.r

const Column = thinky.createModel('Column', {
  id: type.string(),
  boardId: type.string(),
  name: type.string(),
  createdAt: type.date().default(r.now()),
  isRemoved: type.boolean().default(false)
})

Column.belongsTo(Board, 'board', 'boardId', 'id')
Board.hasMany(Column, 'columns', 'id', 'boardId')

module.exports = Column
