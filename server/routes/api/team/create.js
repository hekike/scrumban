'use strict'

const logger = require('winston')

const routesUtils = require('../../../utils/routes')
const schema = require('./schema').create
const Team = require('../../../models/team')
const User = require('../../../models/user')

/**
* Create user
*/
module.exports = function *() {
  const body = yield routesUtils.joiValidate(this, schema)
  const userId = this.state.user.id

  logger.info('create team', body.data.name)

  const user = yield User
    .get(userId)
    .getView()
    .run()

  // create team
  let team = new Team(body.data)
  team.users = [user]
  team = yield team.saveAll()

  // TODO: store user - team connection in Redis

  this.body = team
  this.status = 201
}
