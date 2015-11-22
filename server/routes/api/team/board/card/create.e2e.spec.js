'use strict'

const request = require('co-supertest')
const expect = require('chai').expect

const server = require('../../../../../server')
const Card = require('../../../../../models/card')
const userFixtures = require('../../../../../fixtures/user')
const teamFixtures = require('../../../../../fixtures/team')
const boardFixtures = require('../../../../../fixtures/board')
const columnFixtures = require('../../../../../fixtures/column')
const cardFixtures = require('../../../../../fixtures/card')

describe('POST /api/team/:teamId/board/card', function () {
  let user
  let token
  let team
  let board
  let column

  beforeEach(function *() {
    let result = yield userFixtures.createLoggedInUser()

    user = result.user
    token = result.token

    team = yield teamFixtures.create([user.id])
    board = yield boardFixtures.create(team.id)
    column = yield columnFixtures.create(team.id, board.id)
  })

  afterEach(function *() {
    yield [
      userFixtures.destroyLoggedInUser(user),
      teamFixtures.destroy(team),
      boardFixtures.destroy(board),
      columnFixtures.destroy(column)
    ]
  })

  it('should create a card', function * () {
    const resp = yield request(server.listen())
      .post(`/api/team/${team.id}/board/${board.id}/card`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: {
          columnId: column.id,
          name: 'My Card'
        }
      })
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .end()

    // expect
    const card = yield Card
      .get(resp.body.id)
      .run()

    expect(resp.body).to.be.eql({
      id: card.id,
      name: 'My Card',
      createdAt: card.createdAt.toISOString(),
      teamId: team.id,
      boardId: board.id,
      columnId: column.id,
      isRemoved: false,
      orderIndex: 0
    })

    yield card.delete()
  })

  describe('with increasing index', () => {
    let cardExisting

    beforeEach(function *() {
      cardExisting = yield cardFixtures.create(team.id, board.id, column.id)
    })

    afterEach(function *() {
      yield [
        cardFixtures.destroy(cardExisting)
      ]
    })

    it('should create a card', function * () {
      const resp = yield request(server.listen())
        .post(`/api/team/${team.id}/board/${board.id}/card`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          data: {
            columnId: column.id,
            name: 'My Card'
          }
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)
        .end()

      // expect
      const card = yield Card
        .get(resp.body.id)
        .run()

      expect(resp.body.orderIndex).to.be.eql(1)

      yield card.delete()
    })
  })

  it('should reject invalid body', function * () {
    yield request(server.listen())
      .post(`/api/team/${team.id}/board/${board.id}/card`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: {}
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .end()
  })

  describe('board, column auth', () => {
    let user2
    let team2
    let board2

    beforeEach(function *() {
      let result = yield userFixtures.createLoggedInUser()
      user2 = result.user

      team2 = yield teamFixtures.create([user2.id])
      board2 = yield boardFixtures.create(team2.id)
    })

    afterEach(function *() {
      yield [
        userFixtures.destroyLoggedInUser(user2),
        teamFixtures.destroy(team2),
        boardFixtures.destroy(board2)
      ]
    })

    it('should reject if board access is unauthorized', function * () {
      yield request(server.listen())
        .post(`/api/team/${team.id}/board/${board2.id}/card`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          data: {
            columnId: column.id,
            name: 'My Column'
          }
        })
        .expect(401)
        .expect('Content-Type', /application\/json/)
        .end()
    })
  })
})
