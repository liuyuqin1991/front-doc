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

const VTable = ({ formData }) => {
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
      type: 'text',
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

  // 自动生成表单 setTableData
  const autoGenerate = () => {
    const result = []
    _.forEach(formData, (d) => {
      if(_.includes(['input', 'input-number','textarea',], d.type)) {
        result.push({id: d.id, type: 'text', label: d.label, key: d.key})
      } else if(_.includes(['select', 'radio','radio-button',], d.type)){
        result.push({id: d.id, type: 'text', label: d.label, key: d.key, dict: d.data})
      } else if(d.type === 'custom') {
        result.push({id: d.id, type: 'custom', label: d.label, key: d.key, name: d.name})
      } else if(_.includes(['date', 'week','month','year','datetime','daterange'], d.type)) {
        result.push({id: d.id, type: 'date', label: d.label, key: d.key})
      } else if(_.includes(['time', 'timerange'], d.type)) {
        result.push({id: d.id, type: 'time', label: d.label, key: d.key})
      } else if(d.type === 'imageUpload') {
        result.push({id: d.id, type: 'image', label: d.label, key: d.key})
      }
    })
    setTableData(result)
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
      return temp
    })
  }

  // 处理输出粘贴板，去掉字典的引号
  const onCopy = (copy) => {
    const container = document.createElement('textarea')
    const arr = copy.src
    const filterStr = _.map(arr, (item) => {
      return ((item.type === 'text' || item.type === 'tag') && item.dict) || (item.type === 'text' && item.map) || (item.type === 'image' && item.mapSize)
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

  const mapLabel = "{'1': '启用', '2': '停用'}"
  const mapSizeLabel = "{small: 'smallImageUrl', big: 'bigImageUrl' }"

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
        title="Table配置详情"
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
                  { value: 'text', label: 'text-文本' },
                  { value: 'date', label: 'date-日期' },
                  { value: 'tag', label: 'tag-标签' },
                  { value: 'custom', label: 'custom-自定义'},
                  { value: 'image', label: 'image-图片'},
                  { value: 'date-time', label: 'date-time-日期+时分'},
                  { value: 'date-time-second', label: 'date-time-second-日期+时分秒'},
                  { value: 'time', label: 'time-时分'},
                  { value: 'time-second', label: 'time-second-时分秒'},
                ]}
              />
            </Col>  
          </Row>
          { (currentRow.current.type === 'text' || currentRow.current.type === 'tag') && 
          <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">字典数据集</Col>
            <Col span={18}>
              <Input value={currentRow.current.dict?currentRow.current.dict.replace(new RegExp('^this.dict.type.'), ''):''} prefix="this.dict.type." onChange={(e) => edit('dict', `this.dict.type.${e.currentTarget.value}`, currentRow.current.id)} />
            </Col>
            <Col span={24} className="c-r10 mt-4">注：需要映射字典时使用，如果type为tag，还会根据字典设置里的回显样式和样式属性设置 tag 的颜色值，样式属性优先回显样式</Col>
          </Row>
          }
          { (currentRow.current.type === 'text' || currentRow.current.type === 'tag') && 
          <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">自定义事件</Col>
            <Col span={18}>
              <Input value={currentRow.current.click} onChange={(e) => edit('click', e.currentTarget.value, currentRow.current.id)} />
            </Col>
            <Col span={24} className="c-r10 mt-4">注：需要在Table prop增加相对应名称的@xx事件</Col>
          </Row>
          }
          {currentRow.current.type === 'text' && 
          <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">自定义数据集</Col>
            <Col span={18}>
            <Input value={currentRow.current.map?currentRow.current.map.replace(new RegExp('^this.'), ''):''} prefix="this." onChange={(e) => edit('map', `this.${e.currentTarget.value}`, currentRow.current.id)} />
            </Col>
            <Col span={24} className="c-r10 mt-4">注：map对象数据，这里只用填写参数名称，详细数据代码里实现，例如：{mapLabel}</Col>
          </Row>
          }
          {currentRow.current.type === 'image' && 
          <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">图片数据</Col>
            <Col span={18}>
            <Input value={currentRow.current.mapSize?currentRow.current.mapSize.replace(new RegExp('^this.'), ''):''} prefix="this." onChange={(e) => edit('mapSize', `this.${e.currentTarget.value}`, currentRow.current.id)} />
            </Col>
            <Col span={24} className="c-r10 mt-4">注：图片map对象数据，这里只用填写参数名称，详细数据代码里实现。包含表格显示图片与点击放大图片的url映射，例如：{mapSizeLabel}，key必须为'size'和'small'，必须同时设置大小图的url，大小图可以设置为同一个url</Col>
          </Row>
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
            <Col span={6} className="f-r --c">列宽</Col>
            <Col span={18}>
              <Input value={currentRow.current.width} onChange={(e) => edit('width', e.currentTarget.value, currentRow.current.id)} />
            </Col>
            <Col span={24} className="c-r10 mt-4">注：填入例如'200px'固定列宽，不填将自动计算列宽</Col>
          </Row>
          <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">对齐方式</Col>
            <Col span={18}>
            <Select
                value={currentRow.current.align}
                style={{ width: '100%' }}
                onChange={(v) => edit('align', v, currentRow.current.id)}
                options={[
                  { value: 'center', label: '居中' },
                  { value: 'left', label: '靠左' },
                  { value: 'right', label: '靠右' },
                ]}
              />
            </Col>
          </Row>
          <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">是否排序</Col>
            <Col span={18}>
              <Radio.Group value={currentRow.current.sortable} onChange={(e) => edit('sortable', e.target.value, currentRow.current.id)} >
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Col>
          </Row>
          <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">禁用列过滤</Col>
            <Col span={18}>
              <Radio.Group value={currentRow.current.disabledFilter} onChange={(e) => edit('disabledFilter', e.target.value, currentRow.current.id)} >
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Col>
            <Col span={24} className="c-r10 mt-4">注：禁用列过滤，如设置true，则该列不受列过滤影响持续显示，默认为false</Col>
          </Row>
          <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">是否隐藏列</Col>
            <Col span={18}>
              <Radio.Group value={currentRow.current.isHidden} onChange={(e) => edit('isHidden', e.target.value, currentRow.current.id)} >
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Col>
            <Col span={24} className="c-r10 mt-4">注：是否隐藏列，如设置true，则该列在表格初始化时不显示，默认为false</Col>
          </Row>
          <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">是否内容过长隐藏</Col>
            <Col span={18}>
              <Radio.Group value={currentRow.current.showOverflowTooltip} onChange={(e) => edit('showOverflowTooltip', e.target.value, currentRow.current.id)} >
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Col>
            <Col span={24} className="c-r10 mt-4">注：内容过长时会隐藏内容，并在鼠标悬停时以tooltip形式展示全部内容，默认为false</Col>
          </Row>
        </div>
      </Drawer>
    </div>
  )
}

export default VTable