'use strict'

const request = require('co-supertest')
const expect = require('chai').expect

const server = require('../../../server')
const userFixtures = require('../../../fixtures/user')
const teamFixtures = require('../../../fixtures/team')

describe('GET /api/team', function () {
  let user
  let token
  let team1
  let team2

  beforeEach(function *() {
    let result = yield userFixtures.createLoggedInUser()

    user = result.user
    token = result.token

    result = yield {
      team1: teamFixtures.create([user.id]),
      team2: teamFixtures.create(['asdasd'])
    }

    team1 = result.team1
    team2 = result.team2
  })

  afterEach(function *() {
    yield [
      userFixtures.destroyLoggedInUser(user),
      teamFixtures.destroy(team1),
      teamFixtures.destroy(team2)
    ]
  })

  it('should get user\'s teams', function * () {
    const resp = yield request(server.listen())
      .get('/api/team')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .end()

    expect(resp.body).to.be.eql([{
      id: team1.id,
      name: team1.name,
      createdAt: team1.createdAt.toISOString()
    }])
  })
})
