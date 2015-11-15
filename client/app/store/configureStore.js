'use strict'

import { createStore, applyMiddleware, compose } from 'redux'
import { reduxReactRouter } from 'redux-router'
import createHistory from 'history/lib/createBrowserHistory'
import thunk from 'redux-thunk'

import routes from '../routes'
import rootReducer from '../reducers'

const finalCreateStore = compose(
  applyMiddleware(thunk),
  reduxReactRouter({
    routes,
    createHistory
  })
)(createStore)

export default function configureStore () {
  return finalCreateStore(rootReducer)
}
