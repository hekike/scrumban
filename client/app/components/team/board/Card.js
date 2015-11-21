'use strict'

import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Map as ImmutableMap } from 'immutable'
import { onClass as classMixin } from 'react-mixin'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'

const cardTarget = {
  hover (props, monitor, component) {
    const dragIndex = {
      cardIdx: monitor.getItem().cardIdx,
      columnIdx: monitor.getItem().columnIdx
    }
    const hoverIndex = {
      cardIdx: props.cardIdx,
      columnIdx: props.columnIdx
    }

    // Don't replace items with themselves
    if (_.isEqual(dragIndex, hoverIndex)) {
      return
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

    // Determine mouse position
    const clientOffset = monitor.getClientOffset()

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex.cardIdx < hoverIndex.cardIdx && hoverClientY < hoverMiddleY) {
      return
    }

    // Dragging upwards
    if (dragIndex.cardIdx > hoverIndex.cardIdx && hoverClientY > hoverMiddleY) {
      return
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex)

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().columnIdx = hoverIndex.columnIdx
    monitor.getItem().cardIdx = hoverIndex.cardIdx
  }
}

const cardSource = {
  beginDrag (props) {
    return {
      id: props.id,
      columnIdx: props.columnIdx,
      cardIdx: props.cardIdx
    }
  }
}

/**
* @class Card
*/
class Card extends Component {

  /**
   * @method render
   * @return {JSX}
   */
   render () {
     const { card, isDragging, connectDragSource, connectDropTarget } = this.props
     const cardStyle = {
       opacity: isDragging ? 0 : 1,
       cursor: isDragging ? 'grabbing' : 'pointer'
     }

     return connectDragSource(connectDropTarget(
       <div className="card" style={cardStyle}>
         {card.get('name')}
       </div>
     ))
   }
}

classMixin(Card, PureRenderMixin)

Card.displayName = 'Card'

Card.propTypes = {
  card: PropTypes.instanceOf(ImmutableMap).isRequired,

  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  columnIdx: PropTypes.number.isRequired,
  cardIdx: PropTypes.number.isRequired,
  isDragging: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  moveCard: PropTypes.func.isRequired
}

const CardWithTarget = DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(Card)

const CardWithSource = DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(CardWithTarget)

export default CardWithSource
