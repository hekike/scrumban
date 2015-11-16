'use strict'

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pushState } from 'redux-router'
import { Map as ImmutableMap } from 'immutable'
import { onClass as classMixin } from 'react-mixin'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import Navbar from '../components/Navbar'
import AppError from '../components/AppError'
import Loader from '../components/Loader'

import actions from '../actions'

class App extends Component {

  /**
   * @method componentWillMount
   */
  componentWillMount () {
    const { user, fetchMe } = this.props

    if (!user.get('isFetched') && !user.get('isLoading')) {
      fetchMe()
    }
  }

  /**
   * @method render
   * @return {JSX}
   */
  render () {
    const { children, user, app, fetchLogout, pushState } = this.props

    if (!user.get('isFetched') && user.get('isLoading')) {
      return <Loader />
    }

    return (
      <div>
        <Navbar user={user} fetchLogout={fetchLogout} pushState={pushState} />
        <div className="container">
          <AppError app={app} />
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
