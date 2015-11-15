'use strict'

import { fromJS } from 'immutable'

import {
  USER_LOGIN
} from '../actions/userActions'

const defaultState = fromJS({
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  isLogged: false,
  isFetched: false
})

/**
 * @method onLogin
 * @param {Object} state
 * @param {Object} action
 * @return {Object} newState
 */
function onLogin (state, action) {
  const { user } = action

  const immutableUser = fromJS(user)
  let nextState = state.merge(immutableUser)

  nextState = nextState.setIn(['isLogged'], true)
  nextState = nextState.setIn(['isFetched'], true)

  return nextState
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case USER_LOGIN:
      return onLogin(state, action)

    default:
      return state
  }
}
