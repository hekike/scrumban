'use strict'

const request = require('co-supertest')
const expect = require('chai').expect

const server = require('../../../server')
const userFixtures = require('../../../fixtures/user')
const teamFixtures = require('../../../fixtures/team')
const boardFixtures = require('../../../fixtures/board')

describe('GET /api/team', function () {
  let user
  let token
  let team1
  let team2
  let team3

  beforeEach(function *() {
    let result = yield userFixtures.createLoggedInUser()

    user = result.user
    token = result.token

    result = yield {
      team1: teamFixtures.create([user.id]),
      team2: teamFixtures.create(['asdasd']),
      team3: teamFixtures.create([user.id])
    }

    team1 = result.team1
    team2 = result.team2
    team3 = result.team3
  })

  afterEach(function *() {
    yield [
      userFixtures.destroyLoggedInUser(user),
      teamFixtures.destroy(team1),
      teamFixtures.destroy(team2),
      teamFixtures.destroy(team3)
    ]
  })

  it('should get user\'s teams', function * () {
    const resp = yield request(server.listen())
      .get('/api/team')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .end()

    expect(resp.body.length).to.be.eql(2)

    expect(resp.body).to.deep.include.members([
      {
        id: team1.id,
        name: team1.name
      },
      {
        id: team3.id,
        name: team3.name
      }
    ])
  })

  describe('with boards', () => {
    let board1
    let board2

    beforeEach(function * () {
      const result = yield [
        boardFixtures.create(team1.id),
        boardFixtures.create(team1.id)
      ]

      board1 = result[0]
      board2 = result[1]
    })

    afterEach(function * () {
      yield [
        boardFixtures.destroy(board1),
        boardFixtures.destroy(board2)
      ]
    })

    it('should get user\'s teams and include boards', function * () {
      const resp = yield request(server.listen())
        .get('/api/team?include=boards')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .end()

      expect(resp.body.length).to.be.eql(2)

      expect(resp.body).to.be.containSubset([
        {
          id: team1.id,
          name: team1.name,
          boards: [
            {
              id: board1.id,
              name: board1.name
            },
            {
              id: board2.id,
              name: board2.name
            }
          ]
        },
        {
          id: team3.id,
          name: team3.name,
          boards: []
        }
      ])
    })
  })
})
