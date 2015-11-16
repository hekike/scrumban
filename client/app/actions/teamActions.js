'use strict'

import fetch from 'isomorphic-fetch'
import config from '../../../config/client'
import { checkFetchStatus, parseFetchJSON, handleError } from './fetchHelper'

export const TEAM_SET_TEAMS = 'TEAM_SET_TEAMS'

const USER_URL = config.api.url + '/team'

/**
 * @method setTeams
 * @param {Object} items
 * @return {Object} action
 */
function setTeams (teams) {
  return {
    type: TEAM_SET_TEAMS,
    teams
  }
}

/**
 * @method fetchTeams
 * @param {Object} data
 * @return {Promise}
 */
export function fetchTeams (include = {}) {
  return (dispatch) => {
    dispatch(setTeams({
      isLoading: true
    }))

    let url = USER_URL

    if (include.boards) {
      url += '?include=boards'
    }

    return fetch(url, {
      method: 'get',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(checkFetchStatus)
      .then(parseFetchJSON)
      .then(json => dispatch(setTeams(json)))
      .catch(err => handleError(dispatch, err))
  }
}
