'use strict'

import { fromJS } from 'immutable'

import {
  USER_LOGIN,
  USER_LOGOUT,
  USER_SET_ME
} from '../actions/userActions'

const defaultState = fromJS({
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  isLogged: false,
  isFetched: false,
  isLoading: false
})

/**
 * @method onSetMe
 * @param {Object} state
 * @param {Object} action
 * @return {Object} newState
 */
function onSetMe (state, action) {
  const { user } = action

  if (!user) {
    return defaultState
  }

  if (user && user.isLoading) {
    return state.setIn(['isLoading'], true)
  }

  const immutableUser = fromJS(user)
  let nextState = state.merge(immutableUser)

  nextState = nextState.setIn(['isLogged'], true)
  nextState = nextState.setIn(['isFetched'], true)
  nextState = nextState.setIn(['isLoading'], false)

  return nextState
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case USER_LOGIN:
      return onSetMe(state, action)

    case USER_SET_ME:
      return onSetMe(state, action)

    case USER_LOGOUT: {
      return defaultState
    }

    default:
      return state
  }
}
