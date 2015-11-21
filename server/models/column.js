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
  isRemoved: type.boolean().default(false),
  orderIndex: type.number()
})

Column.belongsTo(Board, 'board', 'boardId', 'id')
Board.hasMany(Column, 'columns', 'id', 'boardId')

Column.ensureIndex('orderIndex')

module.exports = Column
