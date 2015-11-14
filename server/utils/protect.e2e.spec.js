'use strict'

const request = require('co-supertest')

const server = require('../server')
const userFixtures = require('../fixtures/user')

describe('protect middleware', function () {
  let user

  beforeEach(function *() {
    const result = yield userFixtures.createLoggedInUser()

    user = result.user
  })

  afterEach(function *() {
    yield userFixtures.destroyLoggedInUser(user)
  })

  describe('token access check', () => {
    it('should reject invalid token', function * () {
      const token = 'aaa.aaa.aaa'

      yield request(server.listen())
        .get('/api/user/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
        .expect('Content-Type', /application\/json/)
        .end()
    })

    it('should reject missing token', function * () {
      yield request(server.listen())
        .get('/api/user/me')
        .expect(401)
        .expect('Content-Type', /application\/json/)
        .end()
    })
  })

  describe('team access', () => {
    // TODO: move test case from team create
    it('should accept valid team access')
    it('should reject invalid team access')
  })
})
