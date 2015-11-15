'use strict'

import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { onClass as classMixin } from 'react-mixin'
import { connect } from 'react-redux'
import { pushState } from 'redux-router'
import actions from '../../actions'

/**
* @class Dashboard
*/
class Dashboard extends Component {

  /**
   * @method render
   * @return {JSX}
   */
  render () {
    return (
      <div className="row">
        <div className="col-md-12">
          <h1>{'Dashboard'}</h1>
          {'// TODO'}
        </div>
      </div>
    )
  }
}

classMixin(Dashboard, PureRenderMixin)

Dashboard.displayName = 'Dashboard'

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
    pushState: (state, path) => dispatch(pushState)
  }
}

Dashboard.propTypes = {
  pushState: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
