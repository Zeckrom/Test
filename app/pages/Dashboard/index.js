/**
 *
 * Dashboard
 *
 */

import React, { memo } from 'react'
import { connect } from 'react-redux'

import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'
import injectSaga from 'utils/injectSaga'
import { DAEMON } from 'utils/constants'
import { useInjectReducer } from 'utils/injectReducer'
import makeSelectDashboard from '../../shared/redux/dashboard/selectors'
import reducer from '../../shared/redux/dashboard/reducer'

import actions from '../../shared/redux/dashboard/actions'

import saga from '../../shared/redux/dashboard/saga'

import Dashboard from './Dashboard'

const DashboardIndex = props => {
  useInjectReducer({ key: 'dashboard', reducer })

  return <Dashboard {...props} />
}

const mapStateToProps = createStructuredSelector({
  dashboard: makeSelectDashboard(),
})

const mapDispatchToProps = {
  ...actions,
}

const withSaga = injectSaga({ key: 'dashboard', saga, mode: DAEMON })

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(
  withConnect,
  memo,
  withSaga,
)(DashboardIndex)
