'use strict'

import { appError } from './appActions'

/**
 * @method checkFetchStatus
 * @param {Object} response
 * @return {Object|Error} response
 */
export function checkFetchStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    let error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

/**
 * @method parseFetchJSON
 * @param {Object} response
 * @return {Promise}
 */
export function parseFetchJSON (response) {
  return response.json()
}

/**
 * @method handleError
 * @param {Function} dispatch
 * @param {Error} error
 * @return {Promise}
 */
export function handleError (dispatch, error) {
  let errorType

  if (error.response && error.response.status === 401) {
    errorType = 'unauthorized'
  } else if (error.response) {
    errorType = 'fetch'
  }

  dispatch(appError({
    errorType: errorType,
    error: error
  }))

  throw error
}
