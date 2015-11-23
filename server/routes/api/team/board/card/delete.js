'use strict'

const logger = require('winston')
const Card = require('../../../../../models/card')
const thinky = require('../../../../../models/thinky')
const Errors = thinky.Errors
const r = thinky.r

/**
* Card remove
*/
module.exports = function * () {
  const cardId = this.params.cardId
  const teamId = this.params.teamId
  const boardId = this.params.boardId
  const isSoftRemove = !!this.query.archive
  let card

  logger.info(`remove card ${cardId} from team {$teamId} and board ${boardId}`)

  // get related card
  try {
    card = yield Card
      .get(cardId)
      .pluck('id', 'teamId', 'boardId', 'columnId', 'orderIndex')
      .run()
  } catch (err) {
    if (err instanceof Errors.DocumentNotFound) {
      this.throw(404, 'card, board or team not found')
    }

    throw err
  }

  // auth
  if (card.teamId !== teamId || card.boardId !== boardId) {
    this.throw(401, 'unauthorized card access')
  }

  if (isSoftRemove) {
    card.isRemoved = true
    yield card.save()
  } else {
    // update orderIndex for remaining items
    let updateOrderIndex = Card
      .filter(
        r.row('boardId').eq(card.boardId)
        .and(r.row('orderIndex').gt(card.orderIndex))
      )
      .update({
        orderIndex: r.row('orderIndex').sub(1)
      })

    yield [
      card.delete(),
      updateOrderIndex.execute()
    ]
  }

  this.status = 204
}
