'use strict'

const request = require('co-supertest')

const server = require('../server')
const userFixtures = require('../fixtures/user')

describe('protect', function () {
  let user

  beforeEach(function *() {
    const result = yield userFixtures.createLoggedInUser()

    user = result.user
  })

  afterEach(function *() {
    yield userFixtures.destroyLoggedInUser(user)
  })

  it('should reject invalid token', function * () {
    const token = 'aaa.aaa.aaa'

    yield request(server.listen())
      .get('/api/user/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
      .end()
  })
})
