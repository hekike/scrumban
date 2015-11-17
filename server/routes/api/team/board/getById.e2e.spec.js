'use strict'

const request = require('co-supertest')
const expect = require('chai').expect

const server = require('../../../../server')
const userFixtures = require('../../../../fixtures/user')
const teamFixtures = require('../../../../fixtures/team')
const boardFixtures = require('../../../../fixtures/board')

describe('GET /api/team/:teamId/board/:boardId', function () {
  let user
  let token
  let team
  let board

  beforeEach(function *() {
    const result = yield userFixtures.createLoggedInUser()

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

  it('should get board by id', function * () {
    const resp = yield request(server.listen())
      .get(`/api/team/${team.id}/board/${board.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .end()

    expect(resp.body).to.be.eql({
      id: board.id,
      teamId: team.id,
      name: board.name,
      createdAt: board.createdAt.toISOString()
    })
  })

  it('should handle if board not found', function * () {
    yield request(server.listen())
      .get(`/api/team/${team.id}/board/aaaa`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .expect('Content-Type', /application\/json/)
      .end()
  })
})
