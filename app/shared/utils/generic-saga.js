import { put, call } from 'redux-saga/effects'

export const sagaTypes = {
  GET: 'get',
  DELETE: 'delete',
  POST: 'post',
  PUT: 'put',
  WITHOUT_API: 'without_api',
}

function* fetchOrDeleteTemplate(actionTypes, api, action) {
  try {
    const result = yield call(api, action.id)
    yield put({
      type: actionTypes.success,
      data: result,
    })
  } catch (e) {
    yield put({ type: actionTypes.failure, e })
  }
}

function* postTemplate(actionTypes, api, action) {
  try {
    const result = yield call(api, action.body)
    yield put({
      type: actionTypes.success,
      data: result,
    })
  } catch (e) {
    yield put({ type: actionTypes.failure, e })
  }
}

function* putTemplate(actionTypes, api, action) {
  try {
    const result = yield call(api, action.id, action.body)
    yield put({
      type: actionTypes.success,
      data: result,
    })
  } catch (e) {
    yield put({ type: actionTypes.failure, e })
  }
}

function* withoutApiTemplate(actionTypes, action) {
  try {
    yield put({
      type: actionTypes.success,
      data: action.body,
    })
  } catch (e) {
    yield put({ type: actionTypes.failure, e })
  }
}

export const generateSaga = (sagaType, actionTypes, api) => {
  switch (sagaType) {
    case sagaTypes.GET:
    case sagaTypes.DELETE:
      return fetchOrDeleteTemplate.bind(null, actionTypes, api)
    case sagaTypes.POST:
      return postTemplate.bind(null, actionTypes, api)
    case sagaTypes.PUT:
      return putTemplate.bind(null, actionTypes, api)
    case sagaTypes.WITHOUT_API:
      return withoutApiTemplate.bind(null, actionTypes)
    default:
      return 'Failed'
  }
}

export const generateActionWithBody = type => body => ({
  type,
  body,
})

export const generateActionWithId = type => id => ({
  type,
  id,
})

export const generateEmptyAction = type => () => ({
  type,
})

export const generateActionWithBodyAndId = type => (id, body) => ({
  type,
  id,
  body,
})

const REQUEST = 'REQUEST'
const SUCCESS = 'SUCCESS'
const FAILURE = 'FAILURE'

export const generateActionTypes = (root, prefix) => ({
  request: `${root}${prefix}_${REQUEST}`,
  success: `${root}${prefix}_${SUCCESS}`,
  failure: `${root}${prefix}_${FAILURE}`,
})
