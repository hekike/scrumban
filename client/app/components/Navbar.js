'use strict'

import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Map as ImmutableMap } from 'immutable'
import { onClass as classMixin } from 'react-mixin'
import { Link } from 'react-router'

import Navbar from 'react-bootstrap/lib/Navbar'
import NavBrand from 'react-bootstrap/lib/NavBrand'
import Nav from 'react-bootstrap/lib/Nav'
import NavDropdown from 'react-bootstrap/lib/NavDropdown'
import NavItem from 'react-bootstrap/lib/NavItem'
import MenuItem from 'react-bootstrap/lib/MenuItem'

/**
* @class NavbarComponent
*/
class NavbarComponent extends Component {
  constructor (props) {
    super(props)

    this.onLogoutClick = this.onLogoutClick.bind(this)
  }

  /**
  * @method onLogoutClick
  * @param {Event} ev
  */
  onLogoutClick (ev) {
    const { pushState, fetchLogout } = this.props

    fetchLogout()
    pushState(null, '/user/login')
  }

  /**
   * @method render
   * @return {JSX}
   */
  render () {
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
}

classMixin(NavbarComponent, PureRenderMixin)

NavbarComponent.displayName = 'Navbar'

NavbarComponent.propTypes = {
  user: PropTypes.instanceOf(ImmutableMap).isRequired,
  fetchLogout: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired
}

export default NavbarComponent
