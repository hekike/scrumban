'use strict'

const request = require('co-supertest')
const expect = require('chai').expect

const server = require('../../../server')
const userFixtures = require('../../../fixtures/user')

describe('GET /api/user/:userId', function () {
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

  it('should get me', function * () {
    const resp = yield request(server.listen())
      .get('/api/user/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .end()

    expect(resp.body).to.be.eql({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt.toISOString()
    })
  })

  it('should reject requests with non "me" user id', function * () {
    yield request(server.listen())
      .get('/api/user/1')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
      .end()
  })
})
