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

describe('PUT /api/team/:teamId/board/:boardId/card/:cardId/order', function () {
  let user
  let token
  let team
  let board

  beforeEach(function *() {
    const result = yield userFixtures.createLoggedInUser()

    user = result.user
    token = result.token

    team = yield teamFixtures.create([user.id])
    board = yield boardFixtures.create(team.id)
  })

  afterEach(function *() {
    yield [
      userFixtures.destroyLoggedInUser(user),
      teamFixtures.destroy(team),
      boardFixtures.destroy(board)
    ]
  })

  describe('in the same column', () => {
    let column
    let card1
    let card2
    let card3

    beforeEach(function *() {
      column = yield columnFixtures.create(team.id, board.id)

      let cards = yield [
        yield cardFixtures.create(team.id, board.id, column.id, {
          orderIndex: 0
        }),
        yield cardFixtures.create(team.id, board.id, column.id, {
          orderIndex: 1
        }),
        yield cardFixtures.create(team.id, board.id, column.id, {
          orderIndex: 2
        })
      ]
      card1 = cards[0]
      card2 = cards[1]
      card3 = cards[2]
    })

    afterEach(function *() {
      yield [
        columnFixtures.destroy(column),
        cardFixtures.destroy(card1),
        cardFixtures.destroy(card2),
        cardFixtures.destroy(card3)
      ]
    })

    it('should move card to right', function * () {
      yield request(server.listen())
        .put(`/api/team/${team.id}/board/${board.id}/card/${card1.id}/order`)
        .send({
          data: {
            columnId: column.id,
            orderIndex: 2
          }
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .end()

      const cardExps = yield [
        Card.get(card1.id).run(),
        Card.get(card2.id).run(),
        Card.get(card3.id).run()
      ]

      expect(cardExps[0].orderIndex).to.be.eql(2)
      expect(cardExps[1].orderIndex).to.be.eql(0)
      expect(cardExps[2].orderIndex).to.be.eql(1)
    })

    it('should move card to left', function * () {
      yield request(server.listen())
        .put(`/api/team/${team.id}/board/${board.id}/card/${card3.id}/order`)
        .send({
          data: {
            columnId: column.id,
            orderIndex: 0
          }
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .end()

      const cardExps = yield [
        Card.get(card1.id).run(),
        Card.get(card2.id).run(),
        Card.get(card3.id).run()
      ]

      expect(cardExps[0].orderIndex).to.be.eql(1)
      expect(cardExps[1].orderIndex).to.be.eql(2)
      expect(cardExps[2].orderIndex).to.be.eql(0)
    })
  })

  it('should handle if card not found', function * () {
    yield request(server.listen())
      .put(`/api/team/${team.id}/board/${board.id}/card/aaa/order`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: {
          columnId: 'aaa',
          orderIndex: 0
        }
      })
      .expect(404)
      .expect('Content-Type', /application\/json/)
      .end()
  })
})
