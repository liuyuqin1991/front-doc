
import React, { useState } from 'react'
import { Tabs } from 'antd';

import QueryForm from './QueryForm'
import Table from './Table'
import Form from './Form'

import '@liuyuqin1991/quickcss/lib/main.css';

const Config = () => {

  const { TabPane } = Tabs;
  const [formData, setFormData] = useState([])

  return (
    <React.Fragment>
      <Tabs defaultActiveKey="Form">
        <TabPane tab="Form" key="Form">
          <Form onChange={setFormData} />
        </TabPane>
        <TabPane tab="Table" key="Table">
          <Table formData={formData} />
        </TabPane>
        <TabPane tab="QueryForm" key="QueryForm">
          <QueryForm formData={formData} />
        </TabPane>
      </Tabs>
      </React.Fragment>
  )
}

export default () => <Config />
