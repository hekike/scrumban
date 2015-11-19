'use strict'

import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { List } from 'immutable'
import { onClass as classMixin } from 'react-mixin'

/**
* @class Column
*/
class Column extends Component {

  /**
   * @method render
   * @return {JSX}
   */
  render () {
    return (
      <div className="column">
        <h3>{'Column'}</h3>
        <div className="cards">
          <div className="card">{'Swap me around'}</div>
          <div className="card">{'Swap her around'}</div>
          <div className="card">{'Swap him around'}</div>
          <div className="card">{'Swap them around'}</div>
          <div className="card">{'Swap us around'}</div>
          <div className="card">{'Swap things around'}</div>
          <div className="card">{'Swap everything around'}</div>
        </div>
      </div>
    )
  }
}

classMixin(Column, PureRenderMixin)

Column.displayName = 'Column'

Column.propTypes = {
  cards: PropTypes.instanceOf(List).isRequired
}

export default Column
