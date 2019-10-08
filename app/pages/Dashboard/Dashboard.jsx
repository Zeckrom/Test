/**
 *
 * Dashboard
 *
 */

import React, { useEffect, useState } from 'react'

// import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl'
import { Helmet } from 'react-helmet'
import { Table, Avatar, Select } from 'antd'
import { handleData } from './helpers'
import Case from './Case'
import messages from './messages'

import './dashboard.scss'

const { Option } = Select

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name',
    render: fullName => <Avatar>{fullName.match(/\b\w/g) || []}</Avatar>,
  },
  {
    title: 'Mon',
    dataIndex: 'mon',
    key: 'mon',
    render: logs => <Case logs={logs} />,
  },
  {
    title: 'Tue',
    dataIndex: 'tue',
    key: 'tue',
    render: logs => <Case logs={logs} />,
  },
  {
    title: 'Wed',
    dataIndex: 'wed',
    key: 'wed',
    render: logs => <Case logs={logs} />,
  },
  {
    title: 'Thu',
    dataIndex: 'thu',
    key: 'thu',
    render: logs => <Case logs={logs} />,
  },
  {
    title: 'Fri',
    dataIndex: 'fri',
    key: 'fri',
    render: logs => <Case logs={logs} />,
  },
]

const Dashboard = ({ fetchData, dashboard }) => {
  const [week, setWeek] = useState(0)
  useEffect(
    () => () => {
      fetchData()
    },
    [],
  )
  return (
    <div className="dashboard">
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="Description of Dashboard" />
      </Helmet>
      <div className="select-container">
        <Select
          defaultValue={0}
          style={{ width: 120 }}
          onChange={e => setWeek(e)}
        >
          {Object.keys(dashboard.data).map((week, index) => (
            <Option value={index}>{`week ${index + 1}`}</Option>
          ))}
        </Select>
      </div>
      <Table
        bordered
        columns={columns}
        dataSource={handleData(dashboard.data)[week]}
        pagination={false}
      />
    </div>
  )
}

Dashboard.propTypes = {}

export default Dashboard
