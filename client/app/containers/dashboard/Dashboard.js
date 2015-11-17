'use strict'

import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { onClass as classMixin } from 'react-mixin'
import { fromJS } from 'immutable'
import { connect } from 'react-redux'
import { pushState } from 'redux-router'
import actions from '../../actions'

import Loader from '../../components/Loader'
import TeamBoard from '../../components/dashboard/TeamBoard'

/**
* @class Dashboard
*/
class Dashboard extends Component {
  constructor () {
    super()

    this.state = {
      teams: [],
      isLoading: false,
      isFetched: false
    }

    this.loadData = this.loadData.bind(this)
  }

  componentWillMount () {
    if (!this.state.isFetched && !this.state.isLoading) {
      this.loadData()
    }
  }

  loadData () {
    const { fetchTeams } = this.props

    this.setState({
      isLoading: true
    })

    return fetchTeams({
      boards: true
    })
      .then(resp => {
        this.setState({
          teams: fromJS(resp.teams),
          isFetched: true,
          isLoading: false
        })
      })
  }

  /**
   * @method render
   * @return {JSX}
   */
  render () {
    const { teams, isLoading } = this.state

    return (
      <div className="row">
        <div className="col-md-12">
          <h1>{'Dashboard'}</h1>
          {isLoading ? <Loader /> : null}
          {teams.map(team => <TeamBoard key={team.get('id')} team={team} />)}
        </div>
      </div>
    )
  }
}

classMixin(Dashboard, PureRenderMixin)

Dashboard.displayName = 'Dashboard'

/**
 * @method mapDispatchToProps
 * @param {Function} dispatch
 * @return {Object} props
 */
function mapDispatchToProps (dispatch) {
  const { fetchTeams } = actions.team

  return {
    fetchTeams: include => dispatch(fetchTeams(include)),
    pushState: (state, path) => dispatch(pushState(state, path))
  }
}

Dashboard.propTypes = {
  pushState: PropTypes.func.isRequired,
  fetchTeams: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(Dashboard)
