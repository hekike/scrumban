'use strict'

import fetch from 'isomorphic-fetch'
import config from '../../../config/client'
import { checkFetchStatus, parseFetchJSON, handleError } from './fetchHelper'

export const USER_LOGIN = 'USER_LOGIN'
export const USER_LOGOUT = 'USER_LOGOUT'
export const USER_SET_ME = 'USER_SET_ME'

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
 * @method logout
 * @return {Object} action
 */
export function logout () {
  return {
    type: USER_LOGOUT
  }
}

/**
 * @method setMe
 * @param {Object} user
 * @return {Object} action
 */
export function setMe (user) {
  return {
    type: USER_SET_ME,
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
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          email: email,
          password: password
        }
      })
    })
      .then(checkFetchStatus)
      .then(parseFetchJSON)
      .then(json => dispatch(login(json)))
      .catch(err => handleError(dispatch, err))
  }
}

/**
 * @method fetchMe
 * @param {Object} data
 * @return {Promise}
 */
export function fetchMe () {
  return (dispatch) => {
    dispatch(setMe({
      isLoading: true
    }))

    return fetch(`${USER_URL}/me`, {
      method: 'get',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(checkFetchStatus)
      .then(parseFetchJSON)
      .then(json => dispatch(setMe(json)))
      .catch(err => {
        dispatch(setMe())

        if (err.message === 'Unauthorized') {
          return
        }

        throw err
      })
      .catch(err => handleError(dispatch, err))
  }
}

/**
 * @method fetchLogout
 * @param {Object} data
 * @return {Promise}
 */
export function fetchLogout () {
  return (dispatch) => {
    dispatch(logout())

    return fetch(`${USER_URL}/logout`, {
      method: 'get',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(checkFetchStatus)
      .catch(err => handleError(dispatch, err))
  }
}
