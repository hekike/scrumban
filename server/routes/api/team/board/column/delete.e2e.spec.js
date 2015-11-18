'use strict'

const request = require('co-supertest')
const expect = require('chai').expect

const server = require('../../../../../server')
const Column = require('../../../../../models/column')
const thinky = require('../../../../../models/thinky')
const Errors = thinky.Errors

const userFixtures = require('../../../../../fixtures/user')
const teamFixtures = require('../../../../../fixtures/team')
const boardFixtures = require('../../../../../fixtures/board')
const columnFixtures = require('../../../../../fixtures/column')

describe('DELETE /api/team/:teamId/board/:boardId/column/:columnId', function () {
  let user
  let token
  let team
  let board
  let column

  beforeEach(function *() {
    const result = yield userFixtures.createLoggedInUser()

    user = result.user
    token = result.token

    team = yield teamFixtures.create([user.id])
    board = yield boardFixtures.create(team.id)
    column = yield columnFixtures.create(board.id)
  })

  afterEach(function *() {
    yield [
      userFixtures.destroyLoggedInUser(user),
      teamFixtures.destroy(team),
      boardFixtures.destroy(board),
      columnFixtures.destroy(column)
    ]
  })

  it('should hard remove by id', function * () {
    yield request(server.listen())
      .delete(`/api/team/${team.id}/board/${board.id}/column/${column.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
      .end()

    try {
      yield Column.get(column.id).run()
    } catch (err) {
      expect(err).to.be.an.instanceof(Errors.DocumentNotFound)
      return
    }

    throw new Error('documnt find')
  })

  it('should soft remove by id', function * () {
    yield request(server.listen())
      .delete(`/api/team/${team.id}/board/${board.id}/column/${column.id}?archive=true`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
      .end()

    const expectColumn = yield Column.get(column.id).run()

    expect(expectColumn).to.be.not.null
    expect(expectColumn.isRemoved).to.be.true
  })

  it('should handle if board not found', function * () {
    yield request(server.listen())
      .delete(`/api/team/${team.id}/board/${board.id}/column/aaa`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .expect('Content-Type', /application\/json/)
      .end()
  })
})
