'use strict'

const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const winston = require('winston')

const User = require('./models/user')

before(function * () {
  // RethinkDB table setups can take time :(
  // luckly its slow only at the first time
  this.timeout(10000)

  chai.use(sinonChai)

  winston.remove(winston.transports.Console)

  sinon.stub.returnsWithResolve = function (data) {
    return this.returns(Promise.resolve(data))
  }

  sinon.stub.returnsWithReject = function (error) {
    return this.returns(Promise.reject(error))
  }

  yield [User.ready()]
})

afterEach(function * () {
  this.sandbox.restore()
})

beforeEach(function * () {
  this.sandbox = sinon.sandbox.create()
})
