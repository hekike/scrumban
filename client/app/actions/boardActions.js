'use strict'

import fetch from 'isomorphic-fetch'
import config from '../../../config/client'
import { checkFetchStatus, parseFetchJSON, handleError } from './fetchHelper'

export const BOARD_SET_ITEM_BY_ID = 'BOARD_SET_ITEM_BY_ID'
export const BOARD_CARD_MOVE = 'BOARD_CARD_MOVE'
export const BOARD_COLUMN_MOVE = 'BOARD_COLUMN_MOVE'

const TEAM_URL = config.api.url + '/team'
const BOARD_URL = 'board'

/**
 * @method setItemById
 * @param {String} id
 * @param {Object} item
 * @return {Object} action
 */
export function setItemById (id, item) {
  return {
    type: BOARD_SET_ITEM_BY_ID,
    id,
    item
  }
}

/**
 * @method boardCardMove
 * @param {String} id
 * @param {Object} dragIndex
 * @param {Object} hoverIndex
 * @return {Object} action
 */
export function boardCardMove (id, dragIndex, hoverIndex) {
  return {
    type: BOARD_CARD_MOVE,
    id,
    dragIndex,
    hoverIndex
  }
}

/**
 * @method boardColumnMove
 * @param {String} id
 * @param {Object} dragIndex
 * @param {Object} hoverIndex
 * @return {Object} action
 */
export function boardColumnMove (id, dragIndex, hoverIndex) {
  return {
    type: BOARD_COLUMN_MOVE,
    id,
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
    dispatch(setItemById(boardId, {
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
      .then(json => dispatch(setItemById(boardId, json)))
      .catch(err => handleError(dispatch, err))
  }
}
