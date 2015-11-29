'use strict'

import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { onClass as classMixin } from 'react-mixin'
import { connect } from 'react-redux'
import actions from '../../../actions'

export default function boardData (ComponentToWrap) {
  /**
   * @class BoardData
   */
  class BoardData extends Component {
    componentWillMount () {
      const { setItemById, router } = this.props
      const boardId = router.params.boardId

      setItemById(boardId)
    }

    render () {
      return <ComponentToWrap />
    }
  }

  classMixin(BoardData, PureRenderMixin)

  BoardData.displayName = 'BoardData'

  /**
   * @method mapStateToProps
   * @param {Object} state
   * @return {Object} props
   */
  function mapStateToProps (state) {
    return {}
  }

  /**
   * @method mapDispatchToProps
   * @param {Function} dispatch
   * @return {Object} props
   */
  function mapDispatchToProps (dispatch) {
    const { setItemById } = actions.board

    return {
      setItemById: (boardId) => dispatch(setItemById(boardId))
    }
  }

  BoardData.propTypes = {
    setItemById: PropTypes.func.isRequired,
    router: PropTypes.shape({
      location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
      })
    })
  }

  return connect(mapStateToProps, mapDispatchToProps)(BoardData)
}
