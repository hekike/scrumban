'use strict'

import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { onClass as classMixin } from 'react-mixin'
import { fromJS } from 'immutable'
import { connect } from 'react-redux'

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

    if (!board) {
      return
    }

    return (
      <div>
        {board.get('name')}
        <div className="columns">
          <Column />
          <Column />
          <Column />
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
