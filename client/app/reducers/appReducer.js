'use strict'

import { fromJS } from 'immutable'
import uuid from 'uuid'

import {
  APP_ERROR,
  APP_ERROR_CLEAR
} from '../actions/appActions'

const defaultState = fromJS({
  error: null,
  clientId: uuid.v4() // used by mqtt
})

/**
 * @method onAppError
 * @param {Object} state
 * @param {Object} action
 * @return {Object} newState
 */
function onAppError (state, action) {
  const { errorType } = action
  const error = fromJS({
    type: errorType
  })

  return state.setIn(['error'], error)
}

/**
 * @method onAppErrorClear
 * @param {Object} state
 * @param {Object} action
 * @return {Object} newState
 */
function onAppErrorClear (state) {
  return state.setIn(['error'], null)
}

export default function (state = defaultState, action) {
  switch (action.type) {

    case APP_ERROR:
      return onAppError(state, action)

    case APP_ERROR_CLEAR:
      return onAppErrorClear(state, action)

    default:
      return state
  }
}
