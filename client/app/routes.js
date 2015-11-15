'use strict'

import React from 'react'
import { Route } from 'react-router'

import App from './containers/App'
import UserLoginPage from './containers/user/Login'

export default (
  <Route component={App}>
    <Route path="/user/login" component={UserLoginPage} />
    <Route path="*" component={UserLoginPage} />
  </Route>
)
