'use strict'

const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const winston = require('winston')

before(function * () {
  chai.use(sinonChai)

  winston.remove(winston.transports.Console)

  sinon.stub.returnsWithResolve = function (data) {
    return this.returns(Promise.resolve(data))
  }

  sinon.stub.returnsWithReject = function (error) {
    return this.returns(Promise.reject(error))
  }
})

afterEach(function * () {
  this.sandbox.restore()
})

beforeEach(function * () {
  this.sandbox = sinon.sandbox.create()
})
