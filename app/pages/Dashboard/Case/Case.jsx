/**
 *
 * Case
 *
 */

import React, { memo } from 'react'
// import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl'
import messages from './messages'
import './case.scss'
import { Tooltip } from 'antd'

function Case({ logs }) {
  const data = {
    shifts: [],
    total: 0,
  }
  data.shifts = logs.map(shift => {
    data.total += shift.duration / 60
    return {
      duration: `${shift.duration / 60}h`,
      desc: shift.description,
    }
  })

  return (
    <div className="case">
      <div className="left-section">
        {data.shifts.map(shift => (
          <Tooltip title={shift.desc}>
            <div>{shift.duration}</div>
          </Tooltip>
        ))}
      </div>
      <div className="right-section">{`${data.total}h`}</div>
    </div>
  )
}

Case.propTypes = {}

export default memo(Case)
