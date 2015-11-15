'use strict'

import fetch from 'isomorphic-fetch'
import config from '../../../config/client'
import { checkFetchStatus, parseFetchJSON, handleError } from './fetchHelper'

export const USER_LOGIN = 'USER_LOGIN'

const USER_URL = config.api.url + '/user'

/**
 * @method login
 * @param {Object} user
 * @return {Object} action
 */
function login (user) {
  return {
    type: USER_LOGIN,
    user
  }
}

/**
 * @method sendLogin
 * @param {Object} data
 * @return {Promise}
 */
export function sendLogin ({ email, password }) {
  return (dispatch) => {
    return fetch(`${USER_URL}/login`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then(checkFetchStatus)
      .then(parseFetchJSON)
      .then(json => dispatch(login(json)))
      .catch(err => handleError(dispatch, err))
  }
}
