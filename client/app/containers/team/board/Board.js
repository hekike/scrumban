'use strict'

import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { onClass as classMixin } from 'react-mixin'
import { Map as ImmutableMap } from 'immutable'
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

    this.boardRender = this.boardRender.bind(this)
    this.loadData = this.loadData.bind(this)
    this.findColumnByIdx = this.findColumnByIdx.bind(this)
  }

  /**
   * @method componentWillMount
   */
  componentWillMount () {
    const { board, router } = this.props
    const { loadData } = this
    const boardId = router.params.boardId

    const needToFetch = !board.get('isFetched')
    const isDifferentBoard = board && board.get('id') !== boardId

    if ((needToFetch || isDifferentBoard) || !board.get('isLoading')) {
      loadData()
    }
  }

  /**
   * @method loadData
   */
  loadData () {
    const { fetchBoardById, router } = this.props
    const teamId = router.params.teamId
    const boardId = router.params.boardId

    return fetchBoardById(teamId, boardId)
  }

  /**
   * @method findColumnByIdx
   * @param {Number} columnIdx
   * @returns {ImmutableMap} column
   */
  findColumnByIdx (columnIdx) {
    const { board } = this.props

    return board.getIn(['columns', columnIdx])
  }

  /**
   * @method boardRender
   * @return {JSX}
   */
  boardRender () {
    const { findColumnByIdx, loadData } = this
    const { board, sendColumnOrder, sendCardOrder, sendCardCreate,
      boardColumnMove, boardCardMove } = this.props

    const refetchBoard = () => loadData()

    if (!board && board.get('isLoading')) {
      return (<Loader />)
    } else if (!board.get('isFetched')) {
      return
    }

    const columnsStyle = {
      width: (Math.round(313.33 * (board.get('columns').count()))) + 'px'
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
                    findColumnByIdx={findColumnByIdx}
                    moveColumn={boardColumnMove}
                    moveCard={boardCardMove}
                    sendCardCreate={sendCardCreate}
                    refetchBoard={refetchBoard} />
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
    const { boardRender } = this

    return (
      <div className="row">
        <div className="col-md-12">
          {boardRender()}
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
    router: state.router,
    board: state.board
  }
}

/**
 * @method mapDispatchToProps
 * @param {Function} dispatch
 * @return {Object} props
 */
function mapDispatchToProps (dispatch) {
  const { fetchBoardById, boardColumnMove, boardCardMove } = actions.board
  const { sendColumnOrder } = actions.column
  const { sendCardOrder, sendCardCreate } = actions.card

  return {
    // board
    fetchBoardById: (teamId, boardId) => dispatch(fetchBoardById(teamId, boardId)),
    boardColumnMove: (dragIndex, hoverIndex) => dispatch(boardColumnMove(dragIndex, hoverIndex)),
    boardCardMove: (dragIndex, hoverIndex) => dispatch(boardCardMove(dragIndex, hoverIndex)),

    // column
    sendColumnOrder: (teamId, boardId, columnId, order) =>
      dispatch(sendColumnOrder(teamId, boardId, columnId, order)),

    // card
    sendCardOrder: (teamId, boardId, columnId, order) =>
      dispatch(sendCardOrder(teamId, boardId, columnId, order)),
    sendCardCreate: (teamId, boardId, data) =>
      dispatch(sendCardCreate(teamId, boardId, data))
  }
}

Board.propTypes = {
  router: PropTypes.shape({
    params: PropTypes.shape({
      teamId: PropTypes.string.isRequired,
      boardId: PropTypes.string.isRequired
    })
  }).isRequired,
  board: PropTypes.instanceOf(ImmutableMap).isRequired,
  fetchBoardById: PropTypes.func.isRequired,
  boardCardMove: PropTypes.func.isRequired,
  boardColumnMove: PropTypes.func.isRequired,
  sendColumnOrder: PropTypes.func.isRequired,
  sendCardOrder: PropTypes.func.isRequired,
  sendCardCreate: PropTypes.func.isRequired
}

const BoardConnected = connect(mapStateToProps, mapDispatchToProps)(Board)

export default DragDropContext(HTML5Backend)(BoardConnected)
