'use strict'

const expect = require('chai').expect
const server = require('./server')

describe('Utils server', function () {
  describe('favicon', function () {
    it('should handle favicon', function *() {
      const ctx = {
        path: '/favicon.ico'
      }

      yield server.favicon.call(ctx)

      expect(ctx).property('status', 200)
    })
  })

  describe('error handler', function () {
    it('should catch and upstream error', function *() {
      const emitSpy = this.sandbox.spy()
      const err = new Error('my error')

      const ctx = {
        body: null,
        status: null,
        app: {
          emit: emitSpy
        }
      }

      yield server.errorHandler.call(ctx, function *() {
        throw err
      })

      expect(ctx).property('status', 500)
      expect(ctx.body).to.be.eql({ error: 'my error', statusCode: 500 })
      expect(emitSpy).to.be.calledWith('error', err, ctx)
    })
  })

  describe('conditional middleware', function () {
    it('should call middleware', function *() {
      const mw = this.sandbox.spy(function *() {})
      const next = this.sandbox.spy(function *() {})
      const conditional = server.conditionalMw(/foo/, mw)

      const ctx = {
        path: 'foo'
      }

      yield conditional.call(ctx, next)

      expect(mw).to.called
      expect(next).to.not.called
    })

    it('should avoid middleware', function *() {
      const mw = this.sandbox.spy(function *() {})
      const next = function *() {}
      const conditional = server.conditionalMw(/foo/, mw)

      const ctx = {
        path: 'bar'
      }

      yield conditional.call(ctx, next)

      expect(mw).to.not.called
    })
  })
})
