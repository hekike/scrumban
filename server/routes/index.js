const Router = require('koa-router')
const jwt = require('koa-jwt')

const config = require('../../config/server')
const router = {
  public: new Router(),
  secured: new Router()
}

const jwtMiddleware = jwt({
  secret: config.jwt.secret,
  key: 'customer',
  cookie: 'sid'
})

/**
 * Public endpoints
 */
router.public.get('/api/status', require('./api/status/get'))
router.public.post('/api/user', require('./api/user/create'))

/**
 * Secured endpoints
 */
// router.secured.post('/api/user', jwtMiddleware, require('./api/user/create'))

module.exports = router
