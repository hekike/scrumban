'use strict'

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pushState } from 'redux-router'
import { Map as ImmutableMap } from 'immutable'
import { onClass as classMixin } from 'react-mixin'
import { Link } from 'react-router'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import Navbar from 'react-bootstrap/lib/Navbar'
import NavBrand from 'react-bootstrap/lib/NavBrand'
import Nav from 'react-bootstrap/lib/Nav'
import NavDropdown from 'react-bootstrap/lib/NavDropdown'
import NavItem from 'react-bootstrap/lib/NavItem'
import MenuItem from 'react-bootstrap/lib/MenuItem'

import actions from '../actions'

class App extends Component {
  constructor (props) {
    super(props)

    this.onLogoutClick = this.onLogoutClick.bind(this)
  }

  componentWillMount () {
    const { user, fetchMe } = this.props

    if (!user.get('isFetched') && !user.get('isLoading')) {
      fetchMe()
    }
  }

  onLogoutClick () {
    const { pushState, fetchLogout } = this.props

    fetchLogout()
    pushState(null, '/user/login')
  }

  renderAppError () {
    const { app } = this.props

    if (!app.get('error')) {
      return null
    }

    return (
      <p>{app.get('error')}</p>
    )
  }

  renderNavbar () {
    const { onLogoutClick } = this
    const { user } = this.props

    const loggedInNav = (
      <Nav>
        <li>
          <Link to="/boards">{'boards'}</Link>
        </li>
      </Nav>
    )

    return (
      <Navbar>
        <NavBrand><Link to="/">{'Scrumban'}</Link></NavBrand>
        {user.get('isLogged') ? loggedInNav : null}
        <Nav navbar right>
          {user.get('isLogged') ? (<NavDropdown title={user.get('email')} id="user-menu">
            <MenuItem onClick={onLogoutClick}>{'logout'}</MenuItem>
          </NavDropdown>)
            : <NavItem href="/user/login">{'login'}</NavItem>}
        </Nav>
      </Navbar>
    )
  }

  render () {
    const { children, user } = this.props

    if (!user.get('isFetched') && user.get('isLoading')) {
      return <p>{'loading...'}</p>
    }

    return (
      <div>
      {this.renderNavbar()}
        <div className="container">
          {this.renderAppError()}
          {children}
        </div>
      </div>
    )
  }
}

classMixin(App, PureRenderMixin)
App.displayName = 'App'

/**
 * @method mapStateToProps
 * @param {Object} state
 * @return {Object} props
 */
function mapStateToProps (state) {
  return {
    app: state.app,
    user: state.user
  }
}

/**
 * @method mapDispatchToProps
 * @param {Function} dispatch
 * @return {Object} props
 */
function mapDispatchToProps (dispatch) {
  const { fetchLogout, fetchMe } = actions.user

  return {
    fetchLogout: () => dispatch(fetchLogout()),
    fetchMe: () => dispatch(fetchMe()),
    pushState: (state, path) => dispatch(pushState(state, path))
  }
}

App.propTypes = {
  // Injected by React Router
  children: PropTypes.node,
  app: PropTypes.instanceOf(ImmutableMap).isRequired,
  user: PropTypes.instanceOf(ImmutableMap).isRequired,
  fetchLogout: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  fetchMe: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
