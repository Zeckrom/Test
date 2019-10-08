import { takeEvery, all } from 'redux-saga/effects'
// import * as CONSTANTS from './constants';
// Individual exports for testing
import * as api from 'shared/services/data.service'
import constants from './constants'
import { generateSaga, sagaTypes } from '../../utils/generic-saga'

function* fetchDataWatcher() {
  yield takeEvery(
    constants.fetchData.request,
    generateSaga(sagaTypes.GET, constants.fetchData, api.fetchData),
  )
}
export default function* dashboardSaga() {
  yield all([fetchDataWatcher()])
}
