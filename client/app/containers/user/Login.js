'use strict'

import React, { Component, PropTypes } from 'react'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { onClass as classMixin } from 'react-mixin'
import { connect } from 'react-redux'
import { pushState } from 'redux-router'
import { Map as ImmutableMap } from 'immutable'
import actions from '../../actions'

/**
* @class UserLogin
*/
class UserLogin extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: null,
      password: null,
      isError: false,
      isLoading: false
    }

    this.linkState = this.linkState.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  /**
   * @method componentWillMount
   */
  componentWillMount () {
    const { user, pushState } = this.props

    if (user.isLogged) {
      pushState(null, '/')
    }
  }

  /**
   * @method onSubmit
   * @param {Event} ev
   * @return {Promise}
   */
  onSubmit (ev) {
    ev.preventDefault()
    const { sendLogin, pushState } = this.props
    const { email, password } = this.state

    this.setState({
      invalidLogin: false,
      isLoading: true
    })

    return sendLogin({
      email: email,
      password: password
    })
      .then(() => {
        this.setState({
          isLoading: false
        })

        pushState(null, '/')
      })
      .catch(err => {
        this.setState({
          invalidLogin: true,
          isLoading: false
        })

        throw err
      })
  }

  /**
   * @method render
   * @return {JSX}
   */
  render () {
    const { isError } = this.state
    const { linkState, onSubmit } = this

    const errorMessage = (<div className="alert alert-danger registerView" role="alert">
      <strong>{'Error'}</strong> {'Please check your email and password.'}
    </div>)

    return (
      <div className="row">
        <div className="col-md-12">
          <h1>{'Login'}</h1>

          {isError ? errorMessage : null}

          <form className="col-md-12" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="email">{'Email address'}</label>
              <input type="email" valueLink={linkState('email')} tabIndex={1}
                  className="form-control" id="email" placeholder="Enter email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">{'Password'}</label>
              <input type="password" valueLink={linkState('password')} tabIndex={2}
                  className="form-control" id="password"
                  placeholder="Password" />
            </div>
            <button type="submit" className="btn btn-default">{'Login'}</button>
          </form>
        </div>
      </div>
    )
  }
}

classMixin(UserLogin, PureRenderMixin)
classMixin(UserLogin, LinkedStateMixin)

UserLogin.displayName = 'UserLogin'

/**
 * @method mapStateToProps
 * @param {Object} state
 * @return {Object} props
 */
function mapStateToProps (state) {
  return {
    user: state.user
  }
}

/**
 * @method mapDispatchToProps
 * @param {Function} dispatch
 * @return {Object} props
 */
function mapDispatchToProps (dispatch) {
  const { sendLogin } = actions.user

  return {
    sendLogin: (user) => dispatch(sendLogin(user)),
    pushState: (state, path) => dispatch(pushState(state, path))
  }
}

UserLogin.propTypes = {
  user: PropTypes.instanceOf(ImmutableMap),
  sendLogin: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(UserLogin)
