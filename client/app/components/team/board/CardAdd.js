'use strict'

import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { onClass as classMixin } from 'react-mixin'
import { DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'

const cardTarget = {
  hover (props, monitor, component) {
    const monitorItem = monitor.getItem()

    const dragIndex = {
      cardIdx: monitor.getItem().cardIdx,
      columnIdx: monitor.getItem().columnIdx
    }
    const hoverIndex = {
      cardIdx: props.cardIdx,
      columnIdx: props.columnIdx
    }

    // Don't replace items with themselves
    if (monitorItem.id === props.id) {
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

/**
* @class CardAdd
*/
class CardAdd extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isOpen: false
    }

    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.renderModal = this.renderModal.bind(this)
  }

  close () {
    this.setState({
      isOpen: false
    })
  }

  open () {
    this.setState({
      isOpen: true
    })
  }

  renderModal () {
    const { isOpen } = this.state
    const { close } = this

    return (
      <Modal show={isOpen} onHide={close} animation={false} bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title>{'Add new card'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>{'Text in a modal'}</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={close}>{'Close'}</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  /**
   * @method render
   * @return {JSX}
   */
   render () {
     const { connectDropTarget } = this.props
     const { open, renderModal } = this

     return connectDropTarget(
       <div onClick={open} className="card card-add">
         {'add new card'}
         {renderModal()}
       </div>
     )
   }
}

classMixin(CardAdd, PureRenderMixin)

CardAdd.displayName = 'CardAdd'

CardAdd.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  columnIdx: PropTypes.number.isRequired,
  cardIdx: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  moveCard: PropTypes.func.isRequired
}

const CardWithTarget = DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(CardAdd)

export default CardWithTarget
