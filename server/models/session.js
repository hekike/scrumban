const Thorken = require('thorken')
const config = require('../../config/server')

const session = new Thorken({
  jwtSecret: config.jwt.secret
})

module.exports = session
