'use strict'

import React, { Component } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { onClass as classMixin } from 'react-mixin'

/**
* @class Loader
*/
class Loader extends Component {

  /**
   * @method render
   * @return {JSX}
   */
  render () {
    return (<div className="sk-double-bounce">
      <div className="sk-child sk-double-bounce1"></div>
      <div className="sk-child sk-double-bounce2"></div>
    </div>)
  }
}

classMixin(Loader, PureRenderMixin)

Loader.displayName = 'Loader'

export default Loader
