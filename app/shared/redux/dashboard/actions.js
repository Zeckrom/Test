/*
 *
 * Dashboard actions
 *
 */
import constants from './constants'
import { generateEmptyAction } from '../../utils/generic-saga'

export default {
  fetchData: generateEmptyAction(constants.fetchData.request),
}
