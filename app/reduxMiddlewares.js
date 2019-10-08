import {
  NOTIFICATION_TYPES,
  REQUEST,
  SUCCESS,
  FAILURE,
  GET,
  URL_SEPARATOR,
} from 'shared/constants'
import { pushNotification } from 'shared/utils/notification'
import { errorsExtraction } from 'shared/utils/error-interceptors'
import { push } from 'connected-react-router'
import routes from 'shared/routes'

const isRequest = action => action.type.slice(-REQUEST.length) === REQUEST
const isSuccess = action => action.type.slice(-SUCCESS.length) === SUCCESS
const isFailure = action => action.type.slice(-FAILURE.length) === FAILURE
const isGet = e => e.config.method === GET

const extractRoot = type => {
  const splitType = type.split(URL_SEPARATOR)
  return `app/${splitType[1]}`
}

const error400Handling = (store, next, action) => {
  if (action.e && isFailure(action)) {
    if (action.e.response.status === 400) {
      const errors = errorsExtraction(action.e.response.data.model)
      /* Uncomment this line to re-enable notifications for bad request errors */
      // errors.forEach(error => pushNotification(NOTIFICATION_TYPES.error, error))
      next({ ...action, errors })
      return
    }
  }
  next(action)
}

const error404Handling = (store, next, action) => {
  if (action.e && isFailure(action)) {
    if (action.e.response.status === 404) {
      if (isGet(action.e)) {
        store.dispatch(push(routes.FOUR_O_FOUR.path))
        next(action)
      } else {
        const errors = ['Operation failed']
        errors.forEach(error =>
          pushNotification(NOTIFICATION_TYPES.error, error),
        )
        next({ ...action, errors })
        return
      }
    }
  }
  next(action)
}

const error500Handling = (store, next, action) => {
  pushNotification(NOTIFICATION_TYPES.error, 'Internal server error')
  next(action)
}

const error403Handling = (store, next, action) => {
  if (action.e && isFailure(action)) {
    if (action.e.response.status === 403) {
      if (isGet(action.e)) {
        store.dispatch(push(routes.FOUR_O_THREE.path))
        next(action)
      } else {
        const errors = ['You are not authorized']
        errors.forEach(error =>
          pushNotification(NOTIFICATION_TYPES.error, error),
        )
        next({ ...action, errors })
        return
      }
    }
  }
  next(action)
}

const clearErrors = store => next => action => {
  if (isRequest(action) || isSuccess(action))
    store.dispatch({
      type: `${extractRoot(action.type)}/CLEAR_ERRORS`,
    })
  next(action)
}

const errorsHandling = store => next => action => {
  if (action.e && action.e.response && isFailure(action)) {
    switch (action.e.response.status) {
      case 400:
        error400Handling(store, next, action)
        break
      case 403:
        error403Handling(store, next, action)
        break
      case 404:
        error404Handling(store, next, action)
        break
      default:
        next(action)
    }
  } else if (isFailure(action)) {
    next({ ...action, unreachableService: true })
  } else {
    next(action)
  }
}

export default [errorsHandling, clearErrors]
