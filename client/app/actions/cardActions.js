'use strict'

import fetch from 'isomorphic-fetch'
import config from '../../../config/client'
import { checkFetchStatus, handleError } from './fetchHelper'

export const CARD_SET_ORDER = 'CARD_SET_ORDER'

const TEAM_URL = config.api.url + '/team'
const BOARD_URL = 'board'
const CARD_URL = 'card'

/**
 * @method setOrder
 * @param {Object} order
 * @return {Object} action
 */
function setOrder (order) {
  return {
    type: CARD_SET_ORDER,
    order
  }
}

/**
 * @method sendCardOrder
 * @param {String} teamId
 * @param {String} boardId
 * @return {Promise}
 */
export function sendCardOrder (teamId, boardId, cardId, order) {
  return (dispatch) => {
    dispatch(setOrder({
      isLoading: true
    }))

    const url = `${TEAM_URL}/${teamId}/${BOARD_URL}/${boardId}/${CARD_URL}/${cardId}/order`

    return fetch(url, {
      method: 'put',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          columnId: order.targetColumnId,
          orderIndex: order.targetCard
        }
      })
    })
      .then(checkFetchStatus)
      .then(() => dispatch(setOrder()))
      .catch(err => handleError(dispatch, err))
  }
}
