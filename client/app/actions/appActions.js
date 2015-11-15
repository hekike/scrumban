'use strict'

export const APP_ERROR = 'APP_ERROR'
export const APP_ERROR_CLEAR = 'APP_ERROR_CLEAR'

/**
 * @method appError
 * @method {Object} payload
 * @return {Object} action
 */
export function appError ({ errorType, error }) {
  return {
    type: APP_ERROR,
    error,
    errorType
  }
}

/**
 * @method appErrorClear
 * @return {Object} action
 */
export function appErrorClear () {
  return {
    type: APP_ERROR_CLEAR
  }
}
