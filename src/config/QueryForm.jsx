import React, { useState, useRef, useContext, useMemo, useEffect } from 'react'
import { Button, Drawer, Row, Col, Table, Input, InputNumber, Radio , Select, Space } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ReactJson from 'react-json-view'
import _ from 'lodash'

const RowContext = React.createContext({});

const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: 'move' }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

const tableRow = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props['data-row-key'] });

  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  const contextValue = useMemo(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners],
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

const VQueryForm = ({formData}) => {
  const [tableData, setTableData] = useState([])
  const [drawer, setDrawer] = useState(false)
  let currentRow =  useRef({})

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setTableData((prevState) => {
        const activeIndex = prevState.findIndex((record) => record.id === active?.id);
        const overIndex = prevState.findIndex((record) => record.id === over?.id);
        return arrayMove(prevState, activeIndex, overIndex);
      });
    }
  };

  const columns = [
    { 
      key: 'sort', 
      align: 'center', 
      width: 50, 
      render: () => <DragHandle /> 
    },{
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
    }
  ]

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

  const addRow = () => {
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

  const isDateOrTime = (v) => {
    return _.includes(['date','week','month','year','datetime','time','daterange','datetimerange','timerange'], v)
  }

  // 自动生成表单 setTableData
  const autoGenerate = () => {
    const result = []
    _.forEach(formData, (d) => {
      if(_.includes(['input', 'select', 'data', 'week', 'month', 'year', 'datetime', 'daterange', 'time', 'timerange'], d.type)) {
        result.push({
          id: d.id,
          type: d.type,
          label: d.label,
          key: d.key,
          data: d.data,
          span: d.span,
          placeholder: d.placeholder
        })
      }
    })
    setTableData(result)
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

  // 处理输出json，去掉不需要的字段与默认值
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
        <Button type="primary" onClick={addRow}>新增</Button>
        <Button type="primary" className="ml-8" onClick={autoGenerate}>一键生成</Button>
      </div>
      <Row className="mt-12" gutter={12}>
        <Col span={12}>
          <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
            <SortableContext items={tableData.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <Table rowKey="id" columns={columns} dataSource={tableData} components={{ body: { row: tableRow } }} pagination={false} />
            </SortableContext>
          </DndContext>
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
                  { value: 'custom', label: 'custom-自定义'},
                  { value: 'date', label: 'date-日期' },
                  { value: 'week', label: 'week-周'},
                  { value: 'month', label: 'month-月'},
                  { value: 'year', label: 'year-年'},
                  { value: 'datetime', label: 'datetime-日期+时间'},
                  { value: 'daterange', label: 'daterange-日期范围'},
                  { value: 'datetimerange', label: 'datetimerange-日期时间范围'},
                  { value: 'time', label: 'time-时分选择(v2)'},
                  { value: 'timerange', label: 'timerange-时分范围选(v2)'},
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
          {(currentRow.current.type === 'date' || currentRow.current.type === 'daterange') && 
          <React.Fragment>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">显示格式化</Col>
              <Col span={18}>
                <Select
                  value={currentRow.current.format}
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(v) => edit('format', v, currentRow.current.id)}
                  options={[
                    { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd（补0）' },
                    { value: 'yyyy-M-d', label: 'yyyy-M-d（不补0）' },
                    { value: 'yyyy/MM/dd', label: 'yyyy/MM/dd（补0）' },
                    { value: 'yyyy/M/d', label: 'yyyy/M/d（不补0）' },
                    { value: 'yyyy年MM月dd日', label: 'yyyy年MM月dd日（补0）' },
                    { value: 'yyyy年M月d日', label: 'yyyy年M月d日（不补0）' },
                  ]}
                />
              </Col>
              <Col span={24} className="c-r10 mt-4">注：不填即默认yyyy-MM-dd（补0）</Col>
            </Row>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">输出格式化</Col>
              <Col span={18}>
                <Select
                  value={currentRow.current.valueFormat}
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(v) => edit('valueFormat', v, currentRow.current.id)}
                  options={[
                    { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd（补0）' },
                    { value: 'yyyy-M-d', label: 'yyyy-M-d（不补0）' },
                    { value: 'yyyy/MM/dd', label: 'yyyy/MM/dd（补0）' },
                    { value: 'yyyy/M/d', label: 'yyyy/M/d（不补0）' },
                  ]}
                />
              </Col>
              <Col span={24} className="c-r10 mt-4">注：不填即绑定选择日期的Date对象，选择后，则输出相应格式的String字符串</Col>
            </Row>
          </React.Fragment>
          }
          { currentRow.current.type === 'week' && 
          <React.Fragment>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">显示格式化</Col>
              <Col span={18}>
                <Select
                  value={currentRow.current.format}
                  style={{ width: '100%' }}
                  onChange={(v) => edit('format', v, currentRow.current.id)}
                  options={[
                    { value: 'yyyy第WW周', label: 'yyyy第WW周（补0）' },
                    { value: 'yyyy第W周', label: 'yyyy第W周（不补0）' },
                  ]}
                />
              </Col>
              <Col span={24} className="c-r10 mt-4">注：不填即默认yyyy[w]WW（补0），输出格式化存在bug，无法直接输出例如yyyy-WW这种格式，默认输出的是当前选择周的周一Date对象，如需要存当年周数，可以用momentjs或者dayjs转换一下</Col>
            </Row>
          </React.Fragment>
          }
          { currentRow.current.type === 'month' && 
          <React.Fragment>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">显示格式化</Col>
              <Col span={18}>
                <Select
                  value={currentRow.current.format}
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(v) => edit('format', v, currentRow.current.id)}
                  options={[
                    { value: 'yyyy-MM', label: 'yyyy-MM（补0）' },
                    { value: 'yyyy-M', label: 'yyyy-M（不补0）' },
                    { value: 'yyyy/MM', label: 'yyyy/MM（补0）' },
                    { value: 'yyyy/M', label: 'yyyy/M（不补0）' },
                    { value: 'yyyy年MM月', label: 'yyyy年MM月（补0）' },
                    { value: 'yyyy年M月', label: 'yyyy年M月（不补0）' },
                  ]}
                />
              </Col>
              <Col span={24} className="c-r10 mt-4">注：不填即默认yyyy-MM-dd（补0）</Col>
            </Row>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">输出格式化</Col>
              <Col span={18}>
                <Select
                  value={currentRow.current.valueFormat}
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(v) => edit('valueFormat', v, currentRow.current.id)}
                  options={[
                    { value: 'yyyy-MM-dd', label: 'yyyy-MM（补0）' },
                    { value: 'yyyy-M-d', label: 'yyyy-M（不补0）' },
                    { value: 'yyyy/MM/dd', label: 'yyyy/MM（补0）' },
                    { value: 'yyyy/M/d', label: 'yyyy/M（不补0）' },
                  ]}
                />
              </Col>
              <Col span={24} className="c-r10 mt-4">注：不填即绑定选择月份第一天的Date对象，选择后，则输出相应格式的String字符串</Col>
            </Row>
          </React.Fragment>
          }
          { currentRow.current.type === 'year' && 
          <React.Fragment>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">显示格式化</Col>
              <Col span={18}>
                <Select
                  value={currentRow.current.format}
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(v) => edit('format', v, currentRow.current.id)}
                  options={[
                    { value: 'yyyy', label: 'yyyy' },
                    { value: 'yyyy年', label: 'yyyy年' },
                  ]}
                />
              </Col>
              <Col span={24} className="c-r10 mt-4">注：不填即默认yyyy-MM-dd（补0）</Col>
            </Row>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">输出格式化</Col>
              <Col span={18}>
                <Select
                  value={currentRow.current.valueFormat}
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(v) => edit('valueFormat', v, currentRow.current.id)}
                  options={[
                    { value: 'yyyy', label: 'yyyy' },
                  ]}
                />
              </Col>
              <Col span={24} className="c-r10 mt-4">注：不填即绑定选择年份第一天的Date对象，选择后，则输出相应格式的String字符串</Col>
            </Row>
          </React.Fragment>
          }
          {(currentRow.current.type === 'datetime' || currentRow.current.type === 'datetimerange') && 
          <React.Fragment>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">显示格式化</Col>
              <Col span={18}>
                <Select
                  value={currentRow.current.format}
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(v) => edit('format', v, currentRow.current.id)}
                  options={[
                    { value: 'yyyy-MM-dd HH:mm:ss', label: 'yyyy-MM-dd HH:mm:ss（补0）' },
                    { value: 'yyyy-M-d H:m:s', label: 'yyyy-M-d H:m:s（不补0）' },
                    { value: 'yyyy-MM-dd HH:mm', label: 'yyyy-MM-dd HH:mm（补0）' },
                    { value: 'yyyy-M-d H:m', label: 'yyyy-M-d H:m（不补0）' },
                    { value: 'yyyy/MM/dd HH:mm:ss', label: 'yyyy/MM/dd HH:mm:ss（补0）' },
                    { value: 'yyyy/M/d H:m:s', label: 'yyyy/M/d H:m:s（不补0）' },
                    { value: 'yyyy/MM/dd HH:mm', label: 'yyyy/MM/dd HH:mm（补0）' },
                    { value: 'yyyy/M/d H:m', label: 'yyyy/M/d H:m（不补0）' },
                    { value: 'yyyy年MM月dd日 HH时mm分ss秒', label: 'yyyy年MM月dd日 HH时mm分ss秒（补0）' },
                    { value: 'yyyy年M月d日 H时m分s秒', label: 'yyyy年M月d日 H时m分s秒（不补0）' },
                    { value: 'yyyy年MM月dd日 HH时mm分', label: 'yyyy年MM月dd日 HH时mm分（补0）' },
                    { value: 'yyyy年M月d日 H时m分', label: 'yyyy年M月d日 H时m分（不补0）' },
                  ]}
                />
              </Col>
              <Col span={24} className="c-r10 mt-4">注：不填即默认yyyy-MM-dd HH:mm:ss（补0）。显示格式化与输出格式化的时间选择上（非日期选择）最好是选择一样的选项，element的时间选择器有bug，format控制分选择器，valueFormat控制秒选择器，时选择器无法控制</Col>
            </Row>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">输出格式化</Col>
              <Col span={18}>
                <Select
                  value={currentRow.current.valueFormat}
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(v) => edit('valueFormat', v, currentRow.current.id)}
                  options={[
                    { value: 'yyyy-MM-dd HH:mm:ss', label: 'yyyy-MM-dd HH:mm:ss（补0）' },
                    { value: 'yyyy-M-d H:m:s', label: 'yyyy-M-d H:m:s（不补0）' },
                    { value: 'yyyy-MM-dd HH:mm', label: 'yyyy-MM-dd HH:mm（补0）' },
                    { value: 'yyyy-M-d H:m', label: 'yyyy-M-d H:m（不补0）' },
                    { value: 'yyyy/MM/dd HH:mm:ss', label: 'yyyy/MM/dd HH:mm:ss（补0）' },
                    { value: 'yyyy/M/d H:m:s', label: 'yyyy/M/d H:m:s（不补0）' },
                    { value: 'yyyy/MM/dd HH:mm', label: 'yyyy/MM/dd HH:mm（补0）' },
                    { value: 'yyyy/M/d H:m', label: 'yyyy/M/d H:m（不补0）' },
                  ]}
                />
              </Col>
              <Col span={24} className="c-r10 mt-4">注：不填即绑定选择日期的Date对象，选择后，则输出相应格式的String字符串</Col>
            </Row>
          </React.Fragment>
          }
          {(currentRow.current.type === 'time' || currentRow.current.type === 'timerange') && 
          <React.Fragment>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">显示格式化</Col>
              <Col span={18}>
                <Select
                  value={currentRow.current.format}
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(v) => edit('format', v, currentRow.current.id)}
                  options={[
                    { value: 'HH:mm:ss', label: 'HH:mm:ss（补0）' },
                    { value: 'H:m:s', label: 'H:m:s（不补0）' },
                    { value: 'HH:mm', label: 'HH:mm（补0）' },
                    { value: 'H:m', label: 'H:m（不补0）' },
                  ]}
                />
              </Col>
              <Col span={24} className="c-r10 mt-4">注：不填即默认HH:mm:ss（补0）。显示格式化与输出格式化的时间选择上（非日期选择）最好是选择一样的选项，element的时间选择器有bug，format控制分选择器，valueFormat控制秒选择器，时选择器无法控制</Col>
            </Row>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">输出格式化</Col>
              <Col span={18}>
                <Select
                  value={currentRow.current.valueFormat}
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(v) => edit('valueFormat', v, currentRow.current.id)}
                  options={[
                    { value: 'HH:mm:ss', label: 'HH:mm:ss（补0）' },
                    { value: 'H:m:s', label: 'H:m:s（不补0）' },
                    { value: 'HH:mm', label: 'HH:mm（补0）' },
                    { value: 'H:m', label: 'H:m（不补0）' },
                  ]}
                />
              </Col>
              <Col span={24} className="c-r10 mt-4">注：不填即绑定选择时间的Date对象（当前日期），选择后，则输出相应格式的String字符串</Col>
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
          <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">占据列数</Col>
            <Col span={18}>
              <InputNumber value={currentRow.current.span} onChange={(v) => edit('span', v, currentRow.current.id)} />
            </Col>
          </Row>
        </div>
      </Drawer>
    </div>
  )
}

export default VQueryForm