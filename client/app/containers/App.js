'use strict'

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Map as ImmutableMap } from 'immutable'

import Navbar from 'react-bootstrap/lib/Navbar'
import NavBrand from 'react-bootstrap/lib/NavBrand'
import Nav from 'react-bootstrap/lib/Nav'
import NavDropdown from 'react-bootstrap/lib/NavDropdown'
import NavItem from 'react-bootstrap/lib/NavItem'
import MenuItem from 'react-bootstrap/lib/MenuItem'

class App extends Component {
  constructor (props) {
    super(props)
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
    const { user } = this.props

    const loggedInNav = (
      <Nav>
        <NavItem href="/boards">{'boards'}</NavItem>
      </Nav>
    )

    return (
      <Navbar>
        <NavBrand><a href="#">{'Scrumban'}</a></NavBrand>
        {user.get('isLogged') ? loggedInNav : null}
        <Nav navbar right>
          {user.get('isLogged') ? (<NavDropdown title={user.get('email')} id="user-menu">
            <MenuItem>{'logout'}</MenuItem>
          </NavDropdown>)
            : <NavItem href="/user/login">{'login'}</NavItem>}
        </Nav>
      </Navbar>
    )
  }

  render () {
    const { children } = this.props

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

App.displayName = 'App'

App.propTypes = {
  // Injected by React Router
  children: PropTypes.node,
  app: PropTypes.instanceOf(ImmutableMap).isRequired,
  user: PropTypes.instanceOf(ImmutableMap).isRequired
}

function mapStateToProps (state) {
  return {
    app: state.app,
    user: state.user
  }
}

export default connect(mapStateToProps)(App)
