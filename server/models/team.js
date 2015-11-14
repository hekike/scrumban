'use strict'

const thinky = require('./thinky')
const User = require('./user')
const type = thinky.type
const r = thinky.r

const Team = thinky.createModel('Team', {
  id: type.string(),
  name: type.string(),
  createdAt: type.date().default(r.now())
})

Team.hasAndBelongsToMany(User, 'users', 'id', 'id')
User.hasAndBelongsToMany(Team, 'teams', 'id', 'id')

/**
* @method isMember
* @param {String} teamId
* @param {String} userId
* @returns {Promise}
*/
Team.isMember = function (teamId, userId) {
  return r.table('Team_User')
    .filter({
      Team_id: teamId,
      User_id: userId
    })
    .count()
    .run()
    .then(result => !!result)
}

module.exports = Team
