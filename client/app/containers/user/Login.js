'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

class Login extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>
        <h1>{'Login'}</h1>

        {'// TODO: user login'}
      </div>
    )
  }
}

Login.displayName = 'UserLogin'

export default connect()(Login)
