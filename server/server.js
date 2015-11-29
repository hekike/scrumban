'use strict'

const http = require('http')
const path = require('path')

const koa = require('koa')
const serve = require('koa-static')
const sendfile = require('koa-sendfile')
const bodyParser = require('koa-bodyparser')
const helmet = require('koa-helmet')
const logger = require('winston')

const config = require('../config/server')
const serverUtils = require('./utils/server')
const routes = require('./routes')
const mqttBroker = require('./models/broker')

const NINETY_DAYS_IN_MS = 90 * 24 * 60 * 60 * 1000
const PATH_ASSETS = path.join(__dirname, '../dist')
const PATH_CLIENT = path.join(__dirname, '../client')
const indexFile = path.join(config.isTest ? PATH_CLIENT : PATH_ASSETS, 'index.html')

const app = koa()
const serveMW = serve(PATH_ASSETS, config.static)
const serveMqttMW = serve(path.dirname(require.resolve('mosca')) + '/public')

// config app and middlewares
app.keys = config.appKeys

app.use(bodyParser())
app.use(serverUtils.favicon)
app.use(serverUtils.errorHandler)

app.use(serverUtils.conditionalMw(/^\/[images|css|scripts]/, serveMW))
app.use(serverUtils.conditionalMw(/mqtt.js$/, serveMqttMW))

// routers
app.use(routes.public.middleware())
app.use(routes.secured.middleware())

// views
app.use(function * (next) {
  if (this.accepts('html', 'text/*', 'text/html')) {
    yield* sendfile.call(this, indexFile)
  }
})

app.use(helmet.csp({
  defaultSrc: ['\'self\'', 'herokuapp.com'],
  scriptSrc: ['\'self\'', '\'unsafe-inline\''],
  styleSrc: ['\'self\'', '\'unsafe-inline\''],
  fontSrc: ['\'self\''],
  imgSrc: ['\'self\'', 'data:']
}))

app.use(helmet.xssFilter())
app.use(helmet.nosniff())
app.use(helmet.hsts({
  maxAge: NINETY_DAYS_IN_MS
}))

// kick off server
if (!module.parent) {
  let server = http.createServer(app.callback())
  mqttBroker.attachHttpServer(server)

  server.listen(config.port, function (err) {
    if (err) {
      return logger.error(err)
    }

    logger.info('app is listening on ' + config.port)
  })
}

module.exports = app
