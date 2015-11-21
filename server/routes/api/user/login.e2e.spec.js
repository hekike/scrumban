'use strict'

const request = require('co-supertest')
const expect = require('chai').expect

const server = require('../../../server')
const User = require('../../../models/user')
const Session = require('../../../models/session')
const thinky = require('../../../models/thinky')
const r = thinky.r

describe('POST /api/user/login', function () {
  let user

  before(function *() {
    yield r.table(User.getTableName())
      .filter({
        email: 'test@test.com'
      })
      .delete()
  })

  beforeEach(function *() {
    user = new User({
      email: 'test@test.com',
      password: 'secret',
      firstName: 'John',
      lastName: 'Doe'
    })
    yield user.hashPassword()
    user = yield user.save()
  })

  afterEach(function *() {
    yield user.delete()
  })

  it('should login user', function * () {
    const resp = yield request(server.listen())
      .post('/api/user/login')
      .send({
        data: {
          email: user.email,
          password: 'secret'
        }
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .end()

    // extract token from cookie set
    const setCookie = resp.headers['set-cookie'][0]
    const tokenEndPost = setCookie.indexOf(';')
    const token = setCookie.slice(4, tokenEndPost)

    const session = yield Session.get(token)

    expect(session.uid).to.be.equal(resp.body.id)

    expect(resp.body).to.be.eql({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt.toISOString()
    })

    yield Session.destroy(token)
  })

  it('should reject invalid email', function * () {
    yield request(server.listen())
      .post('/api/user/login')
      .send({
        data: {
          email: 'invalid@test.com',
          password: 'secret'
        }
      })
      .expect(401)
      .expect('Content-Type', /application\/json/)
      .end()
  })

  it('should reject invalid password', function * () {
    yield request(server.listen())
      .post('/api/user/login')
      .send({
        data: {
          email: user.email,
          password: 'invalid password'
        }
      })
      .expect(401)
      .expect('Content-Type', /application\/json/)
      .end()
  })

  it('should reject invalid payload', function * () {
    yield request(server.listen())
      .post('/api/user/login')
      .send({
        data: {
          email: 'bad email',
          password: 'secret'
        }
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .end()
  })
})
