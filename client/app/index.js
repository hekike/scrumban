'use strict'

import '../style/index.less'
import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ReduxRouter } from 'redux-router'

import configureStore from './store/configureStore'

const store = configureStore()

render(
  <Provider store={store}>
    <ReduxRouter />
  </Provider>,
  document.getElementById('root')
)
