'use strict'

const request = require('co-supertest')
const expect = require('chai').expect

const server = require('../../../../../server')
const Column = require('../../../../../models/column')

const userFixtures = require('../../../../../fixtures/user')
const teamFixtures = require('../../../../../fixtures/team')
const boardFixtures = require('../../../../../fixtures/board')
const columnFixtures = require('../../../../../fixtures/column')

describe('PUT /api/team/:teamId/board/:boardId/column/:columnId/order', function () {
  let user
  let token
  let team
  let board
  let column1
  let column2
  let column3

  beforeEach(function *() {
    const result = yield userFixtures.createLoggedInUser()

    user = result.user
    token = result.token

    team = yield teamFixtures.create([user.id])
    board = yield boardFixtures.create(team.id)
    let columns = yield [
      columnFixtures.create(team.id, board.id, {
        orderIndex: 0
      }),
      columnFixtures.create(team.id, board.id, {
        orderIndex: 1
      }),
      columnFixtures.create(team.id, board.id, {
        orderIndex: 2
      })
    ]
    column1 = columns[0]
    column2 = columns[1]
    column3 = columns[2]
  })

  afterEach(function *() {
    yield [
      userFixtures.destroyLoggedInUser(user),
      teamFixtures.destroy(team),
      boardFixtures.destroy(board),
      columnFixtures.destroy(column1),
      columnFixtures.destroy(column2),
      columnFixtures.destroy(column3)
    ]
  })

  it('should move column to right', function * () {
    yield request(server.listen())
      .put(`/api/team/${team.id}/board/${board.id}/column/${column1.id}/order`)
      .send({
        data: {
          orderIndex: 2
        }
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
      .end()

    const columnExps = yield [
      Column.get(column1.id).run(),
      Column.get(column2.id).run(),
      Column.get(column3.id).run()
    ]

    expect(columnExps[0].orderIndex).to.be.eql(2)
    expect(columnExps[1].orderIndex).to.be.eql(0)
    expect(columnExps[2].orderIndex).to.be.eql(1)
  })

  it('should move column to left', function * () {
    yield request(server.listen())
      .put(`/api/team/${team.id}/board/${board.id}/column/${column3.id}/order`)
      .send({
        data: {
          orderIndex: 0
        }
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
      .end()

    const columnExps = yield [
      Column.get(column1.id).run(),
      Column.get(column2.id).run(),
      Column.get(column3.id).run()
    ]

    expect(columnExps[0].orderIndex).to.be.eql(1)
    expect(columnExps[1].orderIndex).to.be.eql(2)
    expect(columnExps[2].orderIndex).to.be.eql(0)
  })

  it('should handle if column not found', function * () {
    yield request(server.listen())
      .put(`/api/team/${team.id}/board/${board.id}/column/aaa/order`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: {
          orderIndex: 0
        }
      })
      .expect(404)
      .expect('Content-Type', /application\/json/)
      .end()
  })
})
