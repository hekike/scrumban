'use strict'

import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Map as ImmutableMap } from 'immutable'
import { onClass as classMixin } from 'react-mixin'

/**
* @class AppError
*/
class AppError extends Component {

  /**
   * @method render
   * @return {JSX}
   */
  render () {
    const { app } = this.props

    if (!app.get('error')) {
      return null
    }

    return (
      <p>{app.get('error')}</p>
    )
  }
}

classMixin(AppError, PureRenderMixin)

AppError.displayName = 'AppError'

AppError.propTypes = {
  app: PropTypes.instanceOf(ImmutableMap).isRequired
}

export default AppError
