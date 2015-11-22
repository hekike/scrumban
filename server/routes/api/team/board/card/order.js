'use strict'

const logger = require('winston')
const Card = require('../../../../../models/card')
const thinky = require('../../../../../models/thinky')
const routesUtils = require('../../../../../utils/routes')
const schema = require('./schema').order
const Errors = thinky.Errors
const r = thinky.r

/**
* Card order
*/
module.exports = function *() {
  const body = yield routesUtils.joiValidate(this, schema)
  const cardId = this.params.cardId
  const teamId = this.params.teamId
  const boardId = this.params.boardId
  let card

  logger.info(`order card ${cardId} from team {$teamId} and board ${boardId}`)
  logger.info(`order card ${cardId} to`, body.data)

  // get related column
  try {
    card = yield Card
      .get(cardId)
      .pluck('id', 'teamId', 'boardId', 'columnId', 'orderIndex')
      .run()
  } catch (err) {
    if (err instanceof Errors.DocumentNotFound) {
      this.throw(404, 'column, board or team not found')
    }

    throw err
  }

  // auth
  if (card.teamId !== teamId || card.boardId !== boardId) {
    this.throw(401, 'unauthorized card access')
  }

  /* ******** order in the same column ******** */
  if (card.columnId === body.data.columnId) {
    // update order
    const updateSpecific = Card
      .get(cardId)
      .update({
        orderIndex: body.data.orderIndex
      })

    let updateOthers

    // moved forward
    if (card.orderIndex < body.data.orderIndex) {
      updateOthers = Card
        .filter(
          r.row('boardId').eq(card.boardId)
          .and(r.row('columnId').eq(card.columnId))
          .and(r.row('id').ne(cardId))
          .and(r.row('orderIndex').ge(card.orderIndex))
          .and(r.row('orderIndex').le(body.data.orderIndex))
        )
        .update({
          orderIndex: r.row('orderIndex').sub(1)
        })

    // moved back
    } else {
      updateOthers = Card
        .filter(
          r.row('boardId').eq(card.boardId)
          .and(r.row('columnId').eq(card.columnId))
          .and(r.row('id').ne(cardId))
          .and(r.row('orderIndex').ge(body.data.orderIndex))
          .and(r.row('orderIndex').le(card.orderIndex))
        )
        .update({
          orderIndex: r.row('orderIndex').add(1)
        })
    }

    yield [
      updateSpecific.execute(),
      updateOthers.execute()
    ]

  /* ******** move to different column ******** */
  } else {
    const updateSpecific = Card
      .get(cardId)
      .update({
        columnId: body.data.columnId,
        orderIndex: body.data.orderIndex
      })

    const updateInOldColumn = Card
      .filter(
        r.row('boardId').eq(card.boardId)
        .and(r.row('columnId').eq(card.columnId))
        .and(r.row('id').ne(cardId))
        .and(r.row('orderIndex').ge(card.orderIndex))
      )
      .update({
        orderIndex: r.row('orderIndex').sub(1)
      })

    const updateInNewColumn = Card
      .filter(
        r.row('boardId').eq(card.boardId)
        .and(r.row('columnId').eq(body.data.columnId))
        .and(r.row('id').ne(cardId))
        .and(r.row('orderIndex').ge(body.data.orderIndex))
      )
      .update({
        orderIndex: r.row('orderIndex').sub(1)
      })

    yield [updateSpecific, updateInOldColumn, updateInNewColumn]
  }

  this.status = 204
}
