'use strict'

const request = require('co-supertest')
const expect = require('chai').expect

const server = require('../../../../../server')
const Column = require('../../../../../models/column')
const userFixtures = require('../../../../../fixtures/user')
const teamFixtures = require('../../../../../fixtures/team')
const boardFixtures = require('../../../../../fixtures/board')

describe('POST /api/team/:teamId/board/column', function () {
  let user
  let token
  let team
  let board

  beforeEach(function *() {
    let result = yield userFixtures.createLoggedInUser()

    user = result.user
    token = result.token

    team = yield teamFixtures.create([user.id])
    board = yield boardFixtures.create(team.id)
  })

  afterEach(function *() {
    yield [
      userFixtures.destroyLoggedInUser(user),
      teamFixtures.destroy(team),
      boardFixtures.destroy(board)
    ]
  })

  it('should create a board', function * () {
    const resp = yield request(server.listen())
      .post(`/api/team/${team.id}/board/${board.id}/column`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: {
          name: 'My Column'
        }
      })
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .end()

    // expect
    const column = yield Column
      .get(resp.body.id)
      .run()

    expect(resp.body).to.be.eql({
      id: column.id,
      name: 'My Column',
      createdAt: column.createdAt.toISOString(),
      boardId: board.id,
      isRemoved: false
    })

    yield column.delete()
  })

  it('should reject invalid body', function * () {
    yield request(server.listen())
      .post(`/api/team/${team.id}/board/${board.id}/column`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: {}
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .end()
  })
})
