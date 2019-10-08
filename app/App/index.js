/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { memo } from 'react'
import { connect } from 'react-redux'

import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'
import injectSaga from 'utils/injectSaga'
import { DAEMON } from 'utils/constants'
import saga from 'shared/redux/app/saga'
import Dashboard from 'pages/Dashboard'
import './global-styles.scss'

function App() {
  return <Dashboard />
}
App.propTypes = {}

const mapStateToProps = createStructuredSelector({})

const mapDispatchToProps = {}

const withSaga = injectSaga({ key: 'app', saga, mode: DAEMON })

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(
  withConnect,
  memo,
  withSaga,
)(App)
