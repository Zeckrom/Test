/*
 *
 * Dashboard constants
 *
 */

import { generateActionTypes } from '../../utils/generic-saga'
const root = 'app/Dashboard/'

export default {
  fetchData: generateActionTypes(root, 'FETCH_DATA'),
}
