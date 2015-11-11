'use strict'

const Team = require('../models/team')

function * create (userIds) {
  let team = new Team({
    name: 'My Team'
  })
  team.users = userIds
  team = yield team.saveAll({
    users: true
  })

  return team
}

function * destroy (team) {
  yield team.purge()
}

module.exports.create = create
module.exports.destroy = destroy
