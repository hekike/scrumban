'use strict'

import fetch from 'isomorphic-fetch'
import config from '../../../config/client'
import { checkFetchStatus, parseFetchJSON, handleError } from './fetchHelper'

export const COLUMN_SET_ORDER = 'COLUMN_SET_ORDER'

const TEAM_URL = config.api.url + '/team'
const BOARD_URL = 'board'
const COLUMN_URL = 'column'

/**
 * @method setOrder
 * @param {Object} board
 * @return {Object} action
 */
function setOrder (order) {
  return {
    type: COLUMN_SET_ORDER,
    order
  }
}

/**
 * @method sendColumnOrder
 * @param {String} teamId
 * @param {String} boardId
 * @return {Promise}
 */
export function sendColumnOrder (teamId, boardId, columnId, order) {
  return (dispatch) => {
    dispatch(setOrder({
      isLoading: true
    }))

    const url = `${TEAM_URL}/${teamId}/${BOARD_URL}/${boardId}/${COLUMN_URL}/${columnId}/order`

    return fetch(url, {
      method: 'put',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          source: order.source,
          target: order.target
        }
      })
    })
      .then(checkFetchStatus)
      .then(parseFetchJSON)
      .then(json => dispatch(setOrder(json)))
      .catch(err => handleError(dispatch, err))
  }
}
