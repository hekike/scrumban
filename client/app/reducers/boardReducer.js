'use strict'

import { fromJS } from 'immutable'

import {
  BOARD_SET_BOARD_BY_ID,
  BOARD_CARD_MOVE,
  BOARD_COLUMN_MOVE
} from '../actions/boardActions'

const defaultState = fromJS({
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
  const { board } = action

  if (!board) {
    return defaultState
  }

  if (board && board.isLoading) {
    return state.setIn(['isLoading'], true)
  }

  const immutableBoard = fromJS(board)
  let nextState = state.merge(immutableBoard)

  nextState = nextState.setIn(['isFetched'], true)
  nextState = nextState.setIn(['isLoading'], false)

  return nextState
}

/**
 * @method onBoardCardMove
 * @param {Object} state
 * @param {Object} action
 * @return {Object} newState
 */
function onBoardCardMove (state, action) {
  const { dragIndex, hoverIndex } = action

  const dragColumnIdx = dragIndex.columnIdx
  const hoverColumnIdx = hoverIndex.columnIdx

  const dragCardIdx = dragIndex.cardIdx
  const hoverCardIdx = hoverIndex.cardIdx

  // dragged card
  let draggedCard = state.getIn(['columns', dragColumnIdx, 'cards', dragCardIdx])

  // remove from source column
  let newState = state.updateIn(['columns', dragColumnIdx, 'cards'], cards =>
    cards.splice(dragCardIdx, 1)
  )

  // add to target column
  newState = newState.updateIn(['columns', hoverColumnIdx, 'cards'], cards =>
    cards.splice(hoverCardIdx, 0, draggedCard)
  )

  return newState
}

/**
 * @method onBoardColumnMove
 * @param {Object} state
 * @param {Object} action
 * @return {Object} newState
 */
function onBoardColumnMove (state, action) {
  const { dragIndex, hoverIndex } = action

  const dragColumnIdx = dragIndex.columnIdx
  const hoverColumnIdx = hoverIndex.columnIdx

  // dragged column
  let draggedColumn = state.getIn(['columns', dragColumnIdx])

  // remove from source column
  let newState = state.updateIn(['columns'], columns =>
    columns.splice(dragColumnIdx, 1)
  )

  // add to target column
  newState = newState.updateIn(['columns'], columns =>
    columns.splice(hoverColumnIdx, 0, draggedColumn)
  )

  return newState
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case BOARD_SET_BOARD_BY_ID:
      return oneSetById(state, action)

    case BOARD_CARD_MOVE:
      return onBoardCardMove(state, action)

    case BOARD_COLUMN_MOVE:
      return onBoardColumnMove(state, action)

    default:
      return state
  }
}
