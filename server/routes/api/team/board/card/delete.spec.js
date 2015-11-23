'use strict'

const request = require('co-supertest')
const expect = require('chai').expect

const server = require('../../../../../server')
const Card = require('../../../../../models/card')
const thinky = require('../../../../../models/thinky')
const Errors = thinky.Errors

const userFixtures = require('../../../../../fixtures/user')
const teamFixtures = require('../../../../../fixtures/team')
const boardFixtures = require('../../../../../fixtures/board')
const columnFixtures = require('../../../../../fixtures/column')
const cardFixtures = require('../../../../../fixtures/card')

describe('DELETE /api/team/:teamId/board/:boardId/card/:cardId', function () {
  let user
  let token
  let team
  let board
  let column
  let card1
  let card2

  beforeEach(function *() {
    const result = yield userFixtures.createLoggedInUser()

    user = result.user
    token = result.token

    team = yield teamFixtures.create([user.id])
    board = yield boardFixtures.create(team.id)
    column = yield columnFixtures.create(board.id, team.id)

    let cards = yield [
      yield cardFixtures.create(team.id, board.id, column.id, {
        orderIndex: 0
      }),
      yield cardFixtures.create(team.id, board.id, column.id, {
        orderIndex: 1
      })
    ]
    card1 = cards[0]
    card2 = cards[1]
  })

  afterEach(function *() {
    yield [
      userFixtures.destroyLoggedInUser(user),
      teamFixtures.destroy(team),
      boardFixtures.destroy(board),
      columnFixtures.destroy(column),
      cardFixtures.destroy(card1),
      cardFixtures.destroy(card2)
    ]
  })

  it('should hard remove by id and update order indexes', function * () {
    yield request(server.listen())
      .delete(`/api/team/${team.id}/board/${board.id}/card/${card1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
      .end()

    const card = yield Card.get(card2.id).run()
    expect(card.orderIndex).to.be.eql(0)

    try {
      yield Card.get(card1.id).run()
    } catch (err) {
      expect(err).to.be.an.instanceof(Errors.DocumentNotFound)
      return
    }

    throw new Error('document find')
  })

  it('should soft remove by id', function * () {
    yield request(server.listen())
      .delete(`/api/team/${team.id}/board/${board.id}/card/${card1.id}?archive=true`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
      .end()

    const expectCard = yield Card.get(card1.id).run()

    expect(expectCard).to.be.not.null
    expect(expectCard.isRemoved).to.be.true
  })

  it('should handle if card not found', function * () {
    yield request(server.listen())
      .delete(`/api/team/${team.id}/board/${board.id}/card/aaa`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .expect('Content-Type', /application\/json/)
      .end()
  })
})
