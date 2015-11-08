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
router.public.post('/api/user/login', require('./api/user/login'))

/**
 * Secured endpoints
 */
// router.secured.post('/api/user', jwtMiddleware, require('./api/user/create'))

module.exports = router
