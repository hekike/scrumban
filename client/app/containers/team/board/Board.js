'use strict'

import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { onClass as classMixin } from 'react-mixin'
import { fromJS } from 'immutable'
import { connect } from 'react-redux'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

import actions from '../../../actions'
import Loader from '../../../components/Loader'
import Column from '../../../components/team/board/Column'

/**
* @class Board
*/
class Board extends Component {
  constructor () {
    super()

    this.state = {
      board: null,
      isLoading: false,
      isFetched: false
    }

    this.loadData = this.loadData.bind(this)
    this.moveCard = this.moveCard.bind(this)
    this.moveColumn = this.moveColumn.bind(this)
    this.findColumnByIdx = this.findColumnByIdx.bind(this)
  }

  /**
   * @method componentWillMount
   */
  componentWillMount () {
    if (!this.state.isFetched && !this.state.isLoading) {
      this.loadData()
    }
  }

  /**
   * @method findColumnByIdx
   * @param {Number} columnIdx
   * @returns {ImmutableMap} column
   */
  findColumnByIdx (columnIdx) {
    const { board } = this.state

    return board.getIn(['columns', columnIdx])
  }

  /**
   * @method moveCard
   * @param {Number} dragIndex
   * @param {Number} hoverIndex
   */
  moveCard (dragIndex, hoverIndex) {
    const { board } = this.state

    const dragColumnIdx = dragIndex.columnIdx
    const hoverColumnIdx = hoverIndex.columnIdx

    const dragCardIdx = dragIndex.cardIdx
    const hoverCardIdx = hoverIndex.cardIdx

    // dragged card
    let draggedCard = board.getIn(['columns', dragColumnIdx, 'cards', dragCardIdx])

    // remove from source column
    let newBoard = board.updateIn(['columns', dragColumnIdx, 'cards'], cards =>
      cards.splice(dragCardIdx, 1)
    )

    // add to target column
    newBoard = newBoard.updateIn(['columns', hoverColumnIdx, 'cards'], cards =>
      cards.splice(hoverCardIdx, 0, draggedCard)
    )

    this.setState({
      board: newBoard
    })
  }

  /**
   * @method moveColumn
   * @param {Number} dragIndex
   * @param {Number} hoverIndex
   */
  moveColumn (dragIndex, hoverIndex) {
    const { board } = this.state

    const dragColumnIdx = dragIndex.columnIdx
    const hoverColumnIdx = hoverIndex.columnIdx

    // dragged column
    let draggedColumn = board.getIn(['columns', dragColumnIdx])

    // remove from source column
    let newBoard = board.updateIn(['columns'], columns =>
      columns.splice(dragColumnIdx, 1)
    )

    // add to target column
    newBoard = newBoard.updateIn(['columns'], columns =>
      columns.splice(hoverColumnIdx, 0, draggedColumn)
    )

    this.setState({
      board: newBoard
    })
  }

  /**
   * @method loadData
   */
  loadData () {
    const { fetchBoardById, router } = this.props
    const teamId = router.params.teamId
    const boardId = router.params.boardId

    this.setState({
      isLoading: true
    })

    return fetchBoardById(teamId, boardId)
      .then(resp => {
        this.setState({
          board: fromJS(resp.board),
          isFetched: true,
          isLoading: false
        })
      })
  }

  /**
   * @method boardRender
   * @return {JSX}
   */
  boardRender () {
    const { board } = this.state
    const { moveColumn, moveCard, findColumnByIdx } = this
    const { sendColumnOrder, sendCardOrder } = this.props
    const columnsStyle = {
      width: (Math.round(313.33 * (board.get('columns').count()))) + 'px'
    }

    if (!board) {
      return
    }

    return (
      <div className="board">
        <strong>{board.get('name')}</strong>
        <div className="container-columns">
          <div className="columns" style={columnsStyle}>
            {board.get('columns').map((column, columnIdx) => {
              const orderColumn = (order) =>
                sendColumnOrder(board.get('teamId'), board.get('id'), column.get('id'), order)

              const orderCard = (cardId, order) =>
                sendCardOrder(board.get('teamId'), board.get('id'),
                  cardId, order)

              return (
                <Column key={column.get('id')}
                    id={column.get('id')}
                    columnIdx={columnIdx}
                    column={column}
                    orderColumn={orderColumn}
                    orderCard={orderCard}
                    moveColumn={moveColumn}
                    findColumnByIdx={findColumnByIdx}
                    moveCard={moveCard} />
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  /**
   * @method render
   * @return {JSX}
   */
  render () {
    const { isLoading } = this.state

    return (
      <div className="row">
        <div className="col-md-12">
          {isLoading ? <Loader /> : this.boardRender()}
        </div>
      </div>
    )
  }
}

classMixin(Board, PureRenderMixin)

Board.displayName = 'Board'

/**
 * @method mapStateToProps
 * @param {Object} state
 * @return {Object} props
 */
function mapStateToProps (state) {
  return {
    router: state.router
  }
}

/**
 * @method mapDispatchToProps
 * @param {Function} dispatch
 * @return {Object} props
 */
function mapDispatchToProps (dispatch) {
  const { fetchBoardById } = actions.board
  const { sendColumnOrder } = actions.column
  const { sendCardOrder } = actions.card

  return {
    fetchBoardById: (teamId, boardId) => dispatch(fetchBoardById(teamId, boardId)),
    sendColumnOrder: (teamId, boardId, columnId, order) =>
      dispatch(sendColumnOrder(teamId, boardId, columnId, order)),
    sendCardOrder: (teamId, boardId, columnId, order) =>
      dispatch(sendCardOrder(teamId, boardId, columnId, order))
  }
}

Board.propTypes = {
  router: PropTypes.shape({
    params: PropTypes.shape({
      teamId: PropTypes.string.isRequired,
      boardId: PropTypes.string.isRequired
    })
  }).isRequired,
  fetchBoardById: PropTypes.func.isRequired,
  sendColumnOrder: PropTypes.func.isRequired,
  sendCardOrder: PropTypes.func.isRequired
}

const BoardConnected = connect(mapStateToProps, mapDispatchToProps)(Board)

export default DragDropContext(HTML5Backend)(BoardConnected)
