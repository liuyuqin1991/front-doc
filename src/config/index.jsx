
import React from 'react'
import { Tabs } from 'antd';

import QueryForm from './QueryForm'
import Table from './Table'

import '@liuyuqin1991/quickcss/lib/main.css';

const Config = () => {

  const { TabPane } = Tabs;

  return (
    <React.Fragment>
      <Tabs defaultActiveKey="1">
        <TabPane tab="QueryForm" key="QueryForm">
          <QueryForm />
        </TabPane>
        <TabPane tab="Table" key="Table">
          <Table />
        </TabPane>
        <TabPane tab="Form" key="Form">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
      </React.Fragment>
  )
}

export default () => <Config />
