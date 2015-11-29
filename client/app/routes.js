'use strict'

import React from 'react'
import { Route } from 'react-router'

import App from './containers/App'
import Dashboard from './containers/dashboard/Dashboard'
import UserLoginPage from './containers/user/Login'
import Board from './containers/team/board/Board'

import boardData from './containers/team/board/boardData'
import requireAuth from './containers/auth/requireAuth'

export default (
  <Route component={App}>
    <Route path="/" component={requireAuth(Dashboard)} />
    <Route path="/user/login" component={UserLoginPage} />
    <Route path="/team/:teamId/board/:boardId" component={requireAuth(boardData(Board))} />
    <Route path="*" component={requireAuth(Dashboard)} />
  </Route>
)
