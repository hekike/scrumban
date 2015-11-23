'use strict'

import fetch from 'isomorphic-fetch'
import config from '../../../config/client'
import { checkFetchStatus, handleError, parseFetchJSON } from './fetchHelper'

export const CARD_SET_ORDER = 'CARD_SET_ORDER'
export const CARD_CREATE = 'CARD_CREATE'

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
 * @method createCard
 * @param {Object} order
 * @return {Object} action
 */
function createCard (card) {
  return {
    type: CARD_CREATE,
    card
  }
}

/**
 * @method sendCardOrder
 * @param {String} teamId
 * @param {String} boardId
 * @param {String} cardId
 * @param {Object} order
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

/**
 * @method sendCardCreate
 * @param {String} teamId
 * @param {String} boardId
 * @param {Object} data
 * @return {Promise}
 */
export function sendCardCreate (teamId, boardId, data) {
  return (dispatch) => {
    dispatch(createCard({
      isLoading: true
    }))

    const url = `${TEAM_URL}/${teamId}/${BOARD_URL}/${boardId}/${CARD_URL}`

    return fetch(url, {
      method: 'post',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: data
      })
    })
      .then(checkFetchStatus)
      .then(parseFetchJSON)
      .then(json => dispatch(createCard(json)))
      .catch(err => handleError(dispatch, err))
  }
}
