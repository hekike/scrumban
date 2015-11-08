'use strict'

const request = require('co-supertest')
const server = require('../../../server')
const User = require('../../../models/user')

describe('GET /api/status', function () {
  it('should return with ok', function * () {
    yield request(server.listen())
      .get('/api/status')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .end()
  })

  it('should return with error', function * () {
    this.sandbox.stub(User, 'count').returns({
      execute: () => {
        throw new Error('my error')
      }
    })

    yield request(server.listen())
      .get('/api/status')
      .expect(500)
      .expect('Content-Type', /application\/json/)
      .end()
  })
})
