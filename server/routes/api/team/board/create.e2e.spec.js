'use strict'

const request = require('co-supertest')
const expect = require('chai').expect

const server = require('../../../../server')
const Board = require('../../../../models/board')
const userFixtures = require('../../../../fixtures/user')
const teamFixtures = require('../../../../fixtures/team')

describe('POST /api/team/:teamId/board', function () {
  let user
  let token
  let team

  beforeEach(function *() {
    let result = yield userFixtures.createLoggedInUser()

    user = result.user
    token = result.token

    team = yield teamFixtures.create([user.id])
  })

  afterEach(function *() {
    yield [
      userFixtures.destroyLoggedInUser(user),
      teamFixtures.destroy(team)
    ]
  })

  it('should create a board', function * () {
    const resp = yield request(server.listen())
      .post(`/api/team/${team.id}/board`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: {
          name: 'My Board'
        }
      })
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .end()

    // expect
    const board = yield Board
      .get(resp.body.id)
      .run()

    expect(resp.body).to.be.eql({
      id: board.id,
      name: 'My Board',
      createdAt: board.createdAt.toISOString(),
      teamId: team.id
    })

    yield board.delete()
  })

  it('should reject unauthorized team access', function * () {
    yield request(server.listen())
      .post(`/api/team/unauthorizedTeamId/board`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: {
          name: 'My Board'
        }
      })
      .expect(404) // 404 instead of 401, we don't want to users to guess
      .expect('Content-Type', /application\/json/)
      .end()
  })

  it('should reject invalid body', function * () {
    yield request(server.listen())
      .post(`/api/team/${team.id}/board`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: {}
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .end()
  })
})
