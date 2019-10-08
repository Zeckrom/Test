/**
 *
 * Asynchronously loads the component for Case
 *
 */

import loadable from 'utils/loadable'

export default loadable(() => import('./index'))
