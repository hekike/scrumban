'use strict'

import { fromJS } from 'immutable'

import {
  BOARD_SET_ITEM_BY_ID,
  BOARD_CARD_MOVE,
  BOARD_COLUMN_MOVE
} from '../actions/boardActions'

import {
  CARD_SET_ORDER
} from '../actions/cardActions'

const defaultState = fromJS({
  items: {}
})

const defaultItem = fromJS({
  id: null,
  isFetched: false,
  isLoading: false
})

/**
 * @method oneSetById
 * @param {Object} state
 * @param {Object} action
 * @return {Object} newState
 */
function oneSetById (state, action) {
  const { id, item } = action

  if (!item) {
    return state
      .setIn(['items', id], defaultItem)
      .setIn(['items', id, 'id'], id)
  }

  if (item && item.isLoading) {
    return state.setIn(['items', id, 'isLoading'], true)
  }

  return state
    .mergeIn(['items', id], fromJS(item))
    .setIn(['items', id, 'isFetched'], true)
    .setIn(['items', id, 'isLoading'], false)
}

/**
 * @method onBoardCardMove
 * @param {Object} state
 * @param {Object} action
 * @return {Object} newState
 */
function onBoardCardMove (state, action) {
  const { id, dragIndex, hoverIndex } = action

  const dragColumnIdx = dragIndex.columnIdx
  const hoverColumnIdx = hoverIndex.columnIdx

  const dragCardIdx = dragIndex.cardIdx
  const hoverCardIdx = hoverIndex.cardIdx

  // dragged card
  let draggedCard = state.getIn(['items', id, 'columns', dragColumnIdx, 'cards', dragCardIdx])

  // remove from source column
  return state
    .updateIn(['items', id, 'columns', dragColumnIdx, 'cards'], cards =>
      cards.splice(dragCardIdx, 1)
    )

    // add to target column
    .updateIn(['items', id, 'columns', hoverColumnIdx, 'cards'], cards =>
    cards.splice(hoverCardIdx, 0, draggedCard)
  )
}

/**
 * @method onBoardColumnMove
 * @param {Object} state
 * @param {Object} action
 * @return {Object} newState
 */
function onBoardColumnMove (state, action) {
  const { id, dragIndex, hoverIndex } = action

  const dragColumnIdx = dragIndex.columnIdx
  const hoverColumnIdx = hoverIndex.columnIdx

  // dragged column
  let draggedColumn = state.getIn(['items', id, 'columns', dragColumnIdx])

  // remove from source column
  return state
    .updateIn(['items', id, 'columns'], columns =>
      columns.splice(dragColumnIdx, 1)
    )

    // add to target column
    .updateIn(['items', id, 'columns'], columns =>
      columns.splice(hoverColumnIdx, 0, draggedColumn)
    )
}

/**
 * @method onCardSetOrder
 * @param {Object} state
 * @param {Object} action
 * @return {Object} newState
 */
function onCardSetOrder (state, action) {
  return state
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case BOARD_SET_ITEM_BY_ID:
      return oneSetById(state, action)

    case BOARD_CARD_MOVE:
      return onBoardCardMove(state, action)

    case BOARD_COLUMN_MOVE:
      return onBoardColumnMove(state, action)

    case CARD_SET_ORDER:
      return onCardSetOrder(state, action)

    default:
      return state
  }
}
