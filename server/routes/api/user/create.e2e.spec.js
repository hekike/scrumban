'use strict'

const request = require('co-supertest')
const expect = require('chai').expect

const server = require('../../../server')
const User = require('../../../models/user')
const thinky = require('../../../models/thinky')
const r = thinky.r

describe('POST /api/user', function () {
  after(function *() {
    yield r.table(User.getTableName())
      .filter({
        email: 'test@test.com'
      })
      .delete()
  })

  it('should create new user', function * () {
    const resp = yield request(server.listen())
      .post('/api/user')
      .send({
        data: {
          email: 'test@test.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'secret'
        }
      })
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .end()

    // expet
    const user = yield User.get(resp.body.id).run()

    expect(resp.body).to.be.eql({
      id: user.id,
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: user.createdAt.toISOString()
    })

    yield user.delete()
  })

  it('should reject invalid payload', function * () {
    yield request(server.listen())
      .post('/api/user')
      .send({
        data: {
          email: 'bad email',
          firstName: 'John',
          lastName: 'Doe',
          password: 'secret'
        }
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .end()
  })
})
