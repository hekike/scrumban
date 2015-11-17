'use strict'

import fetch from 'isomorphic-fetch'
import config from '../../../config/client'
import { checkFetchStatus, parseFetchJSON, handleError } from './fetchHelper'

export const BOARD_SET_BOARD_BY_ID = 'BOARD_SET_BOARD_BY_ID'

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

    return fetch(`${TEAM_URL}/${teamId}/${BOARD_URL}/${boardId}`, {
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
