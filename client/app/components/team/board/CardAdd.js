'use strict'

import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
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
      isOpen: false,
      cardName: null
    }

    this.linkState = this.linkState.bind(this)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.save = this.save.bind(this)
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

  save (ev) {
    ev.preventDefault()

    const { cardName } = this.state
    const { teamId, boardId, columnId, sendCardCreate, refetchBoard } = this.props

    const card = {
      name: cardName,
      columnId
    }

    return sendCardCreate(teamId, boardId, card)
      .then(() => {
        this.setState({
          cardName: null
        })

        this.close()

        return refetchBoard(teamId, boardId)
      })
  }

  renderModal () {
    const { isOpen } = this.state
    const { close, save, linkState } = this

    return (
      <Modal show={isOpen} onHide={close} animation={false} bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title>{'Add new card'}</Modal.Title>
        </Modal.Header>
        <form onSubmit={save}>
          <Modal.Body>
            <div className="form-group">
              <label htmlFor="name">{'Name'}</label>
              <input type="name" valueLink={linkState('cardName')} tabIndex={1}
                  className="form-control" id="name" placeholder="name" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={close}>{'Close'}</Button>
            <button type="submit" className="btn btn-primary">{'Create'}</button>
          </Modal.Footer>
        </form>
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
classMixin(CardAdd, LinkedStateMixin)

CardAdd.displayName = 'CardAdd'

CardAdd.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  columnIdx: PropTypes.number.isRequired,
  cardIdx: PropTypes.number.isRequired,
  teamId: PropTypes.string.isRequired,
  boardId: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
  moveCard: PropTypes.func.isRequired,
  refetchBoard: PropTypes.func.isRequired,
  sendCardCreate: PropTypes.func.isRequired
}

const CardWithTarget = DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(CardAdd)

export default CardWithTarget
