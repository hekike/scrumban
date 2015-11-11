'use strict'

const request = require('co-supertest')
const expect = require('chai').expect

const server = require('../../../server')
const Team = require('../../../models/team')
const userFixtures = require('../../../fixtures/user')

describe('POST /api/team', function () {
  let user
  let token

  beforeEach(function *() {
    const result = yield userFixtures.createLoggedInUser()

    user = result.user
    token = result.token
  })

  afterEach(function *() {
    yield userFixtures.destroyLoggedInUser(user)
  })

  it('should create new team', function * () {
    const resp = yield request(server.listen())
      .post('/api/team')
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: {
          name: 'My Team'
        }
      })
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .end()

    // expet
    const team = yield Team
      .get(resp.body.id)
      .getJoin({
        users: true
      })
      .run()

    expect(team.users[0].id).to.be.equal(user.id)
    expect(team.users[0].lastName).to.be.equal(user.lastName)

    expect(resp.body).to.be.eql({
      id: team.id,
      name: 'My Team',
      createdAt: team.createdAt.toISOString(),
      users: [user.id]
    })

    yield team.deleteAll()
  })

  it('should reject invalid payload', function * () {
    yield request(server.listen())
      .post('/api/team')
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: {}
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .end()
  })
})
