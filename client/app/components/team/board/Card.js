'use strict'

import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Map as ImmutableMap } from 'immutable'
import { onClass as classMixin } from 'react-mixin'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import { cardSource, cardTarget } from './cardDnd'

/**
* @class Card
*/
class Card extends Component {
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
    const { card } = this.props
    const { isOpen } = this.state
    const { close } = this

    return (
      <Modal show={isOpen} onHide={close} animation={false} bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title>{card.get('name')}</Modal.Title>
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
     const { card, isDragging, connectDragSource, connectDropTarget } = this.props
     const { open, renderModal } = this
     const cardStyle = {
       opacity: isDragging ? 0.2 : 1
     }

     return connectDragSource(connectDropTarget(
       <div onClick={open} className="card" style={cardStyle}>
         {card.get('name')}
         {renderModal()}
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
  moveCard: PropTypes.func.isRequired,
  findColumnByIdx: PropTypes.func.isRequired
}

const CardWithTarget = DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(Card)

const CardWithSource = DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(CardWithTarget)

export default CardWithSource
