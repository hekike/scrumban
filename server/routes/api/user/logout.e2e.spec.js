'use strict'

const request = require('co-supertest')
const expect = require('chai').expect

const server = require('../../../server')
const Session = require('../../../models/session')
const userFixtures = require('../../../fixtures/user')

describe('GET /api/user/logout', () => {
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

  it('should logout user', function * () {
    const resp = yield request(server.listen())
      .get('/api/user/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
      .end()

    // extract token from cookie set
    const setCookie = resp.headers['set-cookie'][0]

    try {
      yield Session.get(token)
    } catch (err) {
      expect(err.message).to.be.equal('unknown token')
    }

    expect(setCookie).to.contain('expires=Thu, 01 Jan 1970 00:00:00 GMT')
  })
})
