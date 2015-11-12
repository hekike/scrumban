'use strict'

const Team = require('../models/team')

function * create (userIds) {
  const name = Math.random().toString(36).substring(7)

  let team = new Team({
    name: name
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
