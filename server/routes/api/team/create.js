'use strict'

const logger = require('winston')

const routesUtils = require('../../../utils/routes')
const schema = require('./schema').create
const Team = require('../../../models/team')

/**
* Create user
*/
module.exports = function *() {
  const body = yield routesUtils.joiValidate(this, schema)
  const userId = this.state.user.id

  logger.info('create team', body.data.name)

  // create team
  let team = new Team(body.data)
  team.users = [userId]
  team = yield team.saveAll({
    users: true
  })

  // TODO: store user - team connection in Redis

  this.body = team
  this.status = 201
}
