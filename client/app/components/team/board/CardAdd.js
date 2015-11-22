'use strict'

import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { onClass as classMixin } from 'react-mixin'
import { DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import { cardTarget } from './cardDnd'

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
