'use strict'

import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Map as ImmutableMap } from 'immutable'
import { onClass as classMixin } from 'react-mixin'
import { Link } from 'react-router'

/**
* @class TeamBoard
*/
class TeamBoard extends Component {

  /**
   * @method render
   * @return {JSX}
   */
  render () {
    const { team } = this.props

    return (
      <div key={team.get('id')} className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{team.get('name')}</h3>
        </div>
        <div className="panel-body">
          <ul>
            {team.get('boards').map(board =>
              <li key={board.get('id')}>
                {board.get('name')}
                <Link to={`/team/${team.get('id')}/board/${board.get('id')}`}>
                  {'Open board'}
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    )
  }
}

classMixin(TeamBoard, PureRenderMixin)

TeamBoard.displayName = 'TeamBoard'

TeamBoard.propTypes = {
  team: PropTypes.instanceOf(ImmutableMap).isRequired
}

export default TeamBoard
