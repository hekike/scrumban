'use strict'

import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { onClass as classMixin } from 'react-mixin'
import { connect } from 'react-redux'
import { pushState } from 'redux-router'

export default function requireAuthentication (ComponentToWrap) {
  /**
   * @class RequrieAuth
   */
  class RequrieAuth extends Component {
    constructor () {
      super()
      this.checkAuth = this.checkAuth.bind(this)
    }

    componentWillMount () {
      this.checkAuth()
    }

    componentWillReceiveProps () {
      this.checkAuth()
    }

    checkAuth () {
      const { isAuthenticated, isLoading, pushState, router } = this.props

      if (!isAuthenticated && !isLoading) {
        pushState({
          nextPathname: router.location.pathname
        }, `/user/login`)
      }
    }

    render () {
      const { isAuthenticated } = this.props

      return (
        <div>
          {isAuthenticated ? <ComponentToWrap {...this.props} /> : null}
        </div>
      )
    }
  }

  classMixin(RequrieAuth, PureRenderMixin)

  RequrieAuth.displayName = 'RequrieAuth'

  /**
   * @method mapStateToProps
   * @param {Object} state
   * @return {Object} props
   */
  function mapStateToProps (state) {
    return {
      isAuthenticated: state.user.get('isLogged'),
      isLoading: state.user.get('isLoading'),
      router: state.router
    }
  }

  /**
   * @method mapDispatchToProps
   * @param {Function} dispatch
   * @return {Object} props
   */
  function mapDispatchToProps (dispatch) {
    return {
      pushState: (state, path) => dispatch(pushState(state, path))
    }
  }

  RequrieAuth.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    pushState: PropTypes.func.isRequired,
    router: PropTypes.shape({
      location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
      })
    })
  }

  return connect(mapStateToProps, mapDispatchToProps)(RequrieAuth)
}
