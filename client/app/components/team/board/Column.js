'use strict'

import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Map as ImmutableMap, fromJS } from 'immutable'
import { onClass as classMixin } from 'react-mixin'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'

import Card from './Card'

const dndTarget = {
  hover (props, monitor, component) {
    const monitorItem = monitor.getItem()

    const dragIndex = {
      columnIdx: monitor.getItem().columnIdx
    }
    const hoverIndex = {
      columnIdx: props.columnIdx
    }

    // Don't replace items with themselves
    if (monitorItem.id === props.id) {
      return
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

    // Get vertical middle
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2

    // Determine mouse position
    const clientOffset = monitor.getClientOffset()

    // Get pixels to the top
    const hoverClientX = clientOffset.x - hoverBoundingRect.left

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex.columnIdx < hoverIndex.columnIdx && hoverClientX < hoverMiddleX) {
      return
    }

    // Dragging upwards
    if (dragIndex.columnIdx > hoverIndex.columnIdx && hoverClientX > hoverMiddleX) {
      return
    }

    // Time to actually perform the action
    props.moveColumn(dragIndex, hoverIndex)

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().columnIdx = hoverIndex.columnIdx
  }
}

const dndSource = {
  beginDrag (props) {
    return {
      id: props.id,
      columnIdx: props.columnIdx,
      cardIdx: props.cardIdx
    }
  },
  isDragging (props, monitor) {
    return props.id === monitor.getItem().id
  }
}

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
    const { column, moveCard, columnIdx, isDragging,
      connectDragSource, connectDropTarget } = this.props
    const { cards } = this.state

    const cardStyle = {
      opacity: isDragging ? 0.2 : 1
    }

    return connectDragSource(connectDropTarget(
      <div style={cardStyle} className="column">
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
    ))
  }
}

classMixin(Column, PureRenderMixin)

Column.displayName = 'Column'

Column.propTypes = {
  id: PropTypes.string.isRequired,
  column: PropTypes.instanceOf(ImmutableMap).isRequired,
  columnIdx: PropTypes.number.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  moveCard: PropTypes.func.isRequired,
  moveColumn: PropTypes.func.isRequired
}

const WithTarget = DropTarget(ItemTypes.COLUMN, dndTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(Column)

const WithSource = DragSource(ItemTypes.COLUMN, dndSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(WithTarget)

export default WithSource
