'use strict'

const request = require('co-supertest')

const server = require('../server')
const userFixtures = require('../fixtures/user')
const teamFixtures = require('../fixtures/team')

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

    it('should accept valid team access', function * () {
      yield request(server.listen())
        .get(`/api/team/${team.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .end()
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
  })
})
