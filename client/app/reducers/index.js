'use strict'

import { combineReducers } from 'redux'
import { routerStateReducer } from 'redux-router'

import app from './appReducer'
import user from './userReducer'

export default combineReducers({
  router: routerStateReducer,
  app,
  user
})
