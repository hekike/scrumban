'use strict'

import React from 'react'
import { Route } from 'react-router'

import App from './containers/App'
import Dashboard from './containers/dashboard/Dashboard'
import UserLoginPage from './containers/user/Login'
import Board from './containers/team/board/Board'

import requireAuth from './containers/auth/requireAuth'

export default (
  <Route component={App}>
    <Route path="/" component={requireAuth(Dashboard)} />
    <Route path="/user/login" component={UserLoginPage} />
    <Route path="/team/:teamId/board/:boardId" component={Board} />
    <Route path="*" component={requireAuth(Dashboard)} />
  </Route>
)
