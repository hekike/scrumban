'use strict'

import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Map as ImmutableMap, fromJS } from 'immutable'
import { onClass as classMixin } from 'react-mixin'

import Card from './Card'

/**
* @class Column
*/
class Column extends Component {

  constructor (props) {
    super(props)
    this.state = {
      cards: fromJS([])
    }
  }

  componentWillMount () {
    const { column } = this.props

    this.setState({
      cards: column.get('cards')
    })
  }

  componentWillReceiveProps (nextProps) {
    const { column } = nextProps

    this.setState({
      cards: column.get('cards')
    })
  }

  /**
   * @method render
   * @return {JSX}
   */
  render () {
    const { column, moveCard, columnIdx } = this.props
    const { cards } = this.state

    return (
      <div className="column">
        <h3>{column.get('name')}</h3>
        <div className="cards">
          {cards.map((card, cardIdx) =>
            <Card key={card.get('id')}
                columnIdx={columnIdx}
                cardIdx={cardIdx}
                id={card.get('id')}
                card={card}
                moveCard={moveCard} />
          )}
        </div>
      </div>
    )
  }
}

classMixin(Column, PureRenderMixin)

Column.displayName = 'Column'

Column.propTypes = {
  column: PropTypes.instanceOf(ImmutableMap).isRequired,
  columnIdx: PropTypes.number.isRequired,
  moveCard: PropTypes.func.isRequired
}

export default Column
