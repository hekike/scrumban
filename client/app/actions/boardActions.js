'use strict'

import fetch from 'isomorphic-fetch'
import config from '../../../config/client'
import { checkFetchStatus, parseFetchJSON, handleError } from './fetchHelper'

export const BOARD_SET_BOARD_BY_ID = 'BOARD_SET_BOARD_BY_ID'
export const BOARD_CARD_MOVE = 'BOARD_CARD_MOVE'
export const BOARD_COLUMN_MOVE = 'BOARD_COLUMN_MOVE'

const TEAM_URL = config.api.url + '/team'
const BOARD_URL = 'board'

/**
 * @method setBoard
 * @param {Object} board
 * @return {Object} action
 */
function setBoard (board) {
  return {
    type: BOARD_SET_BOARD_BY_ID,
    board
  }
}

/**
 * @method boardCardMove
 * @param {Object} dragIndex
 * @param {Object} hoverIndex
 * @return {Object} action
 */
export function boardCardMove (dragIndex, hoverIndex) {
  return {
    type: BOARD_CARD_MOVE,
    dragIndex,
    hoverIndex
  }
}

/**
 * @method boardColumnMove
 * @param {Object} dragIndex
 * @param {Object} hoverIndex
 * @return {Object} action
 */
export function boardColumnMove (dragIndex, hoverIndex) {
  return {
    type: BOARD_COLUMN_MOVE,
    dragIndex,
    hoverIndex
  }
}

/**
 * @method fetchBoardById
 * @param {String} teamId
 * @param {String} boardId
 * @return {Promise}
 */
export function fetchBoardById (teamId, boardId) {
  return (dispatch) => {
    dispatch(setBoard({
      isLoading: true
    }))

    return fetch(`${TEAM_URL}/${teamId}/${BOARD_URL}/${boardId}?include=columns,cards`, {
      method: 'get',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(checkFetchStatus)
      .then(parseFetchJSON)
      .then(json => dispatch(setBoard(json)))
      .catch(err => handleError(dispatch, err))
  }
}
