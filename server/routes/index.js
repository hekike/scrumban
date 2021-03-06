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
router.public.get('/api/user/logout', protect, require('./api/user/logout'))
router.secured.get('/api/user/:userId', protect, require('./api/user/getById'))

router.secured.post('/api/team', protect, require('./api/team/create'))
router.secured.get('/api/team', protect, require('./api/team/get'))
router.secured.get('/api/team/:teamId', protect, require('./api/team/getById'))

router.secured.post('/api/team/:teamId/board', protect, require('./api/team/board/create'))
router.secured.get('/api/team/:teamId/board/:boardId', protect, require('./api/team/board/getById'))

// column
router.secured.post('/api/team/:teamId/board/:boardId/column', protect,
  require('./api/team/board/column/create'))

router.secured.delete('/api/team/:teamId/board/:boardId/column/:columnId', protect,
  require('./api/team/board/column/delete'))

router.secured.put('/api/team/:teamId/board/:boardId/column/:columnId/order', protect,
  require('./api/team/board/column/order'))

// card
router.secured.post('/api/team/:teamId/board/:boardId/card', protect,
  require('./api/team/board/card/create'))

router.secured.put('/api/team/:teamId/board/:boardId/card/:cardId/order', protect,
  require('./api/team/board/card/order'))

router.secured.delete('/api/team/:teamId/board/:boardId/card/:cardId', protect,
  require('./api/team/board/card/delete'))


module.exports = router
