'use strict'

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Map as ImmutableMap } from 'immutable'

import Navbar from 'react-bootstrap/lib/Navbar'
import NavBrand from 'react-bootstrap/lib/NavBrand'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'

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
    return (
      <Navbar>
        <NavBrand><a href="#">{'Scrumban'}</a></NavBrand>
        <Nav>
          <NavItem eventKey={1} href="/boards">{'boards'}</NavItem>
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
  app: PropTypes.instanceOf(ImmutableMap).isRequired
}

function mapStateToProps (state) {
  return {
    app: state.app
  }
}

export default connect(mapStateToProps)(App)
