const Router = require('koa-router')
const protect = require('../utils/protect')

const router = {
  public: new Router(),
  secured: new Router()
}

/**
 * Public endpoints
 */
router.public.get('/api/status', require('./api/status/get'))
router.public.post('/api/user', require('./api/user/create'))
router.public.post('/api/user/login', require('./api/user/login'))

/**
 * Secured endpoints
 */
router.secured.get('/api/user/:userId', protect, require('./api/user/getById'))
router.secured.post('/api/team', protect, require('./api/team/create'))
router.secured.get('/api/team', protect, require('./api/team/get'))

module.exports = router
