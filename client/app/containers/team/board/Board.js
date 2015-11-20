'use strict'

import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { onClass as classMixin } from 'react-mixin'
import { fromJS } from 'immutable'
import { connect } from 'react-redux'

import actions from '../../../actions'
import Loader from '../../../components/Loader'
import Column from '../../../components/team/board/Column'

const mockColumns = [
  {
    id: 'col-1',
    name: 'Column 1',
    cards: [
      { id: 'card-1', name: 'Card 1' },
      { id: 'card-2', name: 'Card 2' },
      { id: 'card-3', name: 'Card 3' },
      { id: 'card-4', name: 'Card 4' }
    ]
  },
  {
    id: 'col-2',
    name: 'Column 2',
    cards: [
      { id: 'card-2-1', name: 'Card 2.1' },
      { id: 'card-2-2', name: 'Card 2.2' }
    ]
  },
  {
    id: 'col-3',
    name: 'Column 3',
    cards: [
      { id: 'card-3-1', name: 'Card 3.1' }
    ]
  }
]

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
    this.moveColumnCard = this.moveColumnCard.bind(this)
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
   * @method moveColumnCard
   * @method {Number} columnIndex
   * @param {Number} dragIndex
   * @param {Number} hoverIndex
   */
  moveColumnCard (columnIndex, dragIndex, hoverIndex) {
    console.log(arguments)
    const { board } = this.state
    const column = board.getIn(['columns', columnIndex])
    const draggedCard = column.getIn(['cards', dragIndex])

    let cards = column.get('cards').splice(dragIndex, 1)
    cards = cards.splice(hoverIndex, 0, draggedCard)

    const newBoard = board.setIn(['columns', columnIndex, 'cards'], cards)

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
        // TODO: remove mock
        resp.board.columns = mockColumns

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
    const { moveColumnCard } = this

    if (!board) {
      return
    }

    return (
      <div>
        {board.get('name')}
        <div className="columns">
          {board.get('columns').map((column, idx) => {
            const moveCard = (dragIndex, hoverIndex) => moveColumnCard(idx, dragIndex, hoverIndex)

            return (
              <Column key={column.get('id')}
                  column={column}
                  moveCard={moveCard} />
            )
          })}
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
          <h1>{'Board'}</h1>
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

  return {
    fetchBoardById: (teamId, boardId) => dispatch(fetchBoardById(teamId, boardId))
  }
}

Board.propTypes = {
  router: PropTypes.shape({
    params: PropTypes.shape({
      teamId: PropTypes.string.isRequired,
      boardId: PropTypes.string.isRequired
    })
  }).isRequired,
  fetchBoardById: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)
