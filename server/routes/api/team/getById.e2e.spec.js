'use strict'

const request = require('co-supertest')
const expect = require('chai').expect

const server = require('../../../server')
const userFixtures = require('../../../fixtures/user')
const teamFixtures = require('../../../fixtures/team')

describe('GET /api/team/:teamId', function () {
  let user
  let token
  let team

  beforeEach(function *() {
    const result = yield userFixtures.createLoggedInUser()

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

  it('should get team by id', function * () {
    const resp = yield request(server.listen())
      .get(`/api/team/${team.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .end()

    expect(resp.body).to.be.eql({
      id: team.id,
      name: team.name,
      createdAt: team.createdAt.toISOString()
    })
  })

  it('should handle if team not found', function * () {
    yield request(server.listen())
      .get(`/api/team/aaa`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .expect('Content-Type', /application\/json/)
      .end()
  })
})
