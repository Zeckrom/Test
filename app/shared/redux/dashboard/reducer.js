/*
 *
 * Dashboard reducer
 *
 */
import produce from 'immer'
import constants from './constants'
import { data } from './data'

export const initialState = {
  data,
  local: {
    loading: false,
  },
}

/* eslint-disable default-case, no-param-reassign */
const dashboardReducer = (state = initialState, action) =>
  produce(state, (/* draft */) => {
    switch (action.type) {
      case constants.fetchData.request:
        state.local.loading = true
        break
      case constants.fetchData.failure:
        state.local.loading = false
        break
      case constants.fetchData.success:
        state.local.loading = false
        state.data = data
        break
    }
  })

export default dashboardReducer
