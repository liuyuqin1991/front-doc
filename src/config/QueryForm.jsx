import React, { useState, useRef } from 'react'
import { Button, Drawer, Row, Col, Table, Input, InputNumber, Select, Space } from 'antd';
import ReactJson from 'react-json-view'
import _ from 'lodash'

const VQueryForm = () => {
  const [tableData, setTableData] = useState([])
  const [drawer, setDrawer] = useState(false)
  let currentRow =  useRef({})
  const columns = [{
    title: 'label',
    dataIndex: 'label',
    render: (text, record, index) => { return(<Input value={text} onChange={(e) => edit('label', e.currentTarget.value, record.id)} />)},
  },{
    title: 'key',
    dataIndex: 'key',
    render: (text, record, index) => {  return(<Input value={text} onChange={(e) => edit('key', e.currentTarget.value, record.id)} />)},
  },{
    title: '操作',
    dataIndex: 'operation',
    width: 100,
    render: (text, record, index) =>
      <span>
        <a onClick={() => selectRow(record)}>详情</a>
        <span className="mx-4" />
        <a onClick={() => deleteRow(record)}>删除</a>
      </span>
  }]

  const toggleDrawer = (func, toggle) => {
    func(toggle)
  }

  const edit = (key, value, id) => {
    let temp = [...tableData]
    const obj = _.find(temp, (t) => t.id === id)
    obj[key] = value
    setTableData(temp)
    currentRow.current = obj
  }

  const add = () => {
    setTableData([...tableData, {
      id: _.uniqueId(),
      label: '',
      key: '',
      type: 'input',
      span: 1
    }])
  }

  const selectRow = (record) => {
    toggleDrawer(setDrawer, true)
    currentRow.current = record
  }

  const deleteRow = (record) => {
    setTableData(_.filter(tableData, (q) => {
      return q.id !== record.id
    }))
  }

  // 自动注入占位显示文案
  const autoPlaceholder = () => {
    const prefix = currentRow.current.type === 'input' ? '请输入' : '请选择'
    const label = !_.isEmpty(currentRow.current.label) ? currentRow.current.label : ''
    edit('placeholder', prefix + label, currentRow.current.id)
  }

  // 自动注入插槽
  const autoSlot = () => {
    const label = !_.isEmpty(currentRow.current.key) ? currentRow.current.key : ''
    edit('name', label, currentRow.current.id)
  }

  // 处理输出json，去掉id和span为1的情况
  const processJson = () => {
    return _.map(tableData, (q) => {
      const temp = {
        ...q
      }
      temp.id && delete temp.id
      temp.span === 1 && delete temp.span
      return temp
    })
  }

  // 处理输出粘贴板，去掉字典的引号
  const onCopy = (copy) => {
    const container = document.createElement('textarea')
    const arr = copy.src
    const filterStr = _.map(arr, (item) => {
      return item.type === 'select' && item.data
    })
    let tempStr = JSON.stringify(arr)
    _.forEach(filterStr, (s) => {
      tempStr = _.replace(tempStr, `"${s}"`, s)
    })
    container.innerHTML = tempStr
    document.body.appendChild(container)
    container.select()
    document.execCommand('copy')
    document.body.removeChild(container)
  }

  return (
    <div className="f-c">
      <div>
        <Button type="primary" onClick={add}>新增</Button>
      </div>
      <Row className="mt-12" gutter={12}>
        <Col span={12}>
          <Table rowKey="id" columns={columns} dataSource={tableData}/>
        </Col>
        <Col span={12}>
          <ReactJson 
            src={processJson()}
            theme="google"
            indentWidth={2}
            iconStyle="circle"
            style={{minHeight: '300px'}}
            name={false}
            quotesOnKeys={false}
            enableClipboard={onCopy}
          /></Col>
      </Row>
      <Drawer
        title="QueryForm配置详情"
        placement="right"
        closable={false}
        onClose={() => toggleDrawer(setDrawer,false)}
        open={drawer}
        width={400}
      >
        <div className="f-c">
          <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">类型</Col>
            <Col span={18}>
              <Select
                value={currentRow.current.type}
                style={{ width: '100%' }}
                onChange={(v) => edit('type', v, currentRow.current.id)}
                options={[
                  { value: 'input', label: 'input-输入框' },
                  { value: 'select', label: 'select-下拉框' },
                  { value: 'date', label: 'date-日期' },
                  { value: 'custom', label: 'custom-自定义'},
                  { value: 'week', label: 'week-周'},
                  { value: 'month', label: 'month-月'},
                  { value: 'year', label: 'year-年'},
                  { value: 'datetime', label: 'datetime-日期+时间'},
                  { value: 'daterange', label: 'daterange-日期范围'},
                  { value: 'datetimerange', label: 'datetimerange-日期时间范围'}
                ]}
              />
            </Col>  
          </Row>
          { currentRow.current.type === 'select' && 
          <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">字典数据集</Col>
            <Col span={18}>
              <Input value={currentRow.current.data?currentRow.current.data.replace(new RegExp('^this.dict.type.'), ''):''} prefix="this.dict.type." onChange={(e) => edit('data', `this.dict.type.${e.currentTarget.value}`, currentRow.current.id)} />
            </Col>
            <Col span={24} className="c-r10 mt-4">（注：自定义数据集请在配置代码中自行修改）</Col>
          </Row> 
          }
          { currentRow.current.type !== 'custom' && 
          <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">占位字符</Col>
            <Col span={18}>
              <Space.Compact style={{ width: '100%' }}>
                <Input value={currentRow.current.placeholder} onChange={(e) => edit('placeholder', e.currentTarget.value, currentRow.current.id)} />
                <Button type="primary" onClick={autoPlaceholder}>自动写入</Button>
              </Space.Compact>
            </Col>
          </Row>
          }
          <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">占据列数</Col>
            <Col span={18}>
              <InputNumber value={currentRow.current.span} onChange={(v) => edit('span', v, currentRow.current.id)} />
            </Col>
          </Row>
          { currentRow.current.type == 'date' && 
          <React.Fragment>
            <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">显示格式化</Col>
            <Col span={18}>
              <Select
                  value={currentRow.current.format}
                  style={{ width: '100%' }}
                  onChange={(v) => edit('format', v, currentRow.current.id)}
                  options={[
                    { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd' },
                    { value: 'yyyy-M-d', label: 'yyyy-M-d' },
                    { value: 'yyyy/MM/dd', label: 'yyyy/MM/dd' },
                    { value: 'yyyy/M/d', label: 'yyyy/M/d' },
                    { value: 'yyyy年MM月dd日', label: 'yyyy年MM月dd日' },
                    { value: 'yyyy年M月d日', label: 'yyyy年M月d日' },
                  ]}
                />
            </Col>
            </Row>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">输出格式化</Col>
              <Col span={18}>
              <Select
                  value={currentRow.current.valueFormat}
                  style={{ width: '100%' }}
                  onChange={(v) => edit('valueFormat', v, currentRow.current.id)}
                  options={[
                    { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd' },
                    { value: 'yyyy-M-d', label: 'yyyy-M-d' },
                    { value: 'yyyy/MM/dd', label: 'yyyy/MM/dd' },
                    { value: 'yyyy/M/d', label: 'yyyy/M/d' },
                    { value: 'yyyy年MM月dd日', label: 'yyyy年MM月dd日' },
                    { value: 'yyyy年M月d日', label: 'yyyy年M月d日' },
                  ]}
                />
              </Col>
            </Row>
          </React.Fragment>
          }
          { currentRow.current.type == 'datetime' && 
          <React.Fragment>
            <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">显示格式化</Col>
            <Col span={18}>
              <Select
                  value={currentRow.current.format}
                  style={{ width: '100%' }}
                  onChange={(v) => edit('format', v, currentRow.current.id)}
                  options={[
                    { value: 'yyyy-MM-dd HH:mm:ss', label: 'yyyy-MM-dd HH:mm:ss' },
                    { value: 'yyyy-M-d H:m:s', label: 'yyyy-M-d H:m:s' },
                    { value: 'yyyy/MM/dd HH:mm:ss ', label: 'yyyy/MM/dd HH:mm:ss' },
                    { value: 'yyyy/M/d H:m:s', label: 'yyyy/M/d H:m:s' },
                    { value: 'yyyy年MM月dd日 HH时mm分ss秒', label: 'yyyy年MM月dd日 HH时mm分ss秒' },
                    { value: 'yyyy年M月d日 H时m分s秒', label: 'yyyy年M月d日 H时m分s秒' },
                  ]}
                />
            </Col>
            </Row>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">输出格式化</Col>
              <Col span={18}>
              <Select
                  value={currentRow.current.valueFormat}
                  style={{ width: '100%' }}
                  onChange={(v) => edit('valueFormat', v, currentRow.current.id)}
                  options={[
                    { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd' },
                    { value: 'yyyy-M-d', label: 'yyyy-M-d' },
                    { value: 'yyyy/MM/dd', label: 'yyyy/MM/dd' },
                    { value: 'yyyy/M/d', label: 'yyyy/M/d' },
                    { value: 'yyyy年MM月dd日', label: 'yyyy年MM月dd日' },
                    { value: 'yyyy年M月d日', label: 'yyyy年M月d日' },
                  ]}
                />
              </Col>
            </Row>
          </React.Fragment>
          }
          { currentRow.current.type === 'custom' && 
          <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">插槽名称</Col>
            <Col span={18}>
              <Space.Compact style={{ width: '100%' }}>
                <Input value={currentRow.current.name} onChange={(e) => edit('name', e.currentTarget.value, currentRow.current.id)} />
                <Button type="primary" onClick={autoSlot}>自动写入</Button>
              </Space.Compact>
            </Col>
          </Row>
          }
        </div>
      </Drawer>
    </div>
  )
}

export default () => <VQueryForm />