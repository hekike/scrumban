'use strict'

const expect = require('chai').expect
const joi = require('joi')

const routesUtils = require('./routes')

describe('routes utils', function () {
  const schema = joi.object({
    password: joi.string().required(),
    email: joi.string().email().required()
  })

  it('should validate payload', function *() {
    const ctx = {
      request: {
        body: {
          password: 'secret',
          email: 'test@test.com'
        }
      }
    }

    const body = yield routesUtils.joiValidate(ctx, schema)

    expect(body).to.be.eql({
      password: 'secret',
      email: 'test@test.com'
    })
  })

  it('should reject invalid payload', function *() {
    const ctx = {
      request: {
        body: {
          password: 'secret',
          email: 'test'
        }
      },
      throw: this.sandbox.spy()
    }

    yield routesUtils.joiValidate(ctx, schema)

    expect(ctx.throw).to.be.calledWith(400, 'Validation Error', {
      reason: '"email" must be a valid email'
    })
  })
})
