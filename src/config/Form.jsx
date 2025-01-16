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


const VForm = ({ onChange }) => {
  const [tableData, setTableData] = useState([])
  const [drawer, setDrawer] = useState(false)
  let currentRow =  useRef({})

  useEffect(() => {
    onChange(tableData)
  }, [tableData]);

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
    setTableData([
      ...tableData, 
      {
      id: _.uniqueId(),
      label: '',
      key: '',
      type: 'input',
      rows: 2,
      span: 1,
      limit: 5,
      fileSize: 5,
      fileType: ['doc','docx','xls','xlsx','ppt','pptx','txt','pdf','png','jpg']
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

  // 是否为输入项
  const isInputType = (v) => {
    return _.includes(['input', 'input-number', 'password', 'textarea'], v)
  }

  // 自动注入占位显示文案
  const autoPlaceholder = () => {
    const prefix = isInputType(currentRow.current.type) ? '请输入' : '请选择'
    const label = !_.isEmpty(currentRow.current.label) ? currentRow.current.label : ''
    edit('placeholder', prefix + label, currentRow.current.id)
  }

  // 自动注入插槽
  const autoSlot = () => {
    const label = !_.isEmpty(currentRow.current.key) ? currentRow.current.key : ''
    edit('name', label, currentRow.current.id)
  }

  // 自动注入规则
  const autoRule = (type) => {
    const rule = {}
    const label = !_.isEmpty(currentRow.current.label) ? currentRow.current.label : ''
    const prefix = isInputType(currentRow.current.type) ? '请输入' : '请选择'
    const trigger = isInputType(currentRow.current.type) ? 'blur' : 'change'
    if(type === '非空校验') {
      return  `{required: true,message: '${prefix}${label}',trigger: '${trigger}'}`
    } else if(type === '字符长度校验') {
      return  `{min: 3,max: 5,message: '长度应在3到5个字符之间',trigger: '${trigger}'}`
    } else if(type === '邮箱格式校验') {
      return  `{type: 'email',message: '请输入正确的邮箱地址',trigger: '${trigger}'}`
    } else if(type === '手机号码格式校验') {
      return  `{pattern: /^1[3-9]\d{9}$/,message: '请输入正确的手机号码',trigger: '${trigger}'}`
    } else if(type === '密码强度校验') {
      return  `{pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,message: '密码至少8位，且包含数字和字母',trigger: '${trigger}'}`
    } else if(type === '数字范围校验') {
      return  `{type: 'number',min: 18,max: 100,message: '${label}必须在18到100之间',trigger: '${trigger}'}`
    } else if(type === '自定义校验规则') {
      return  `{validator: (rule, value, callback) => {if (!value || /^[A-Za-z]/.test(value)) {callback();} else {callback(new Error('用户名必须以字母开头'));}},trigger: '${trigger}'}`
    }
    return '{}'
  }

  // 自动注入忽略
  const autoIgnore = (type) => {
    if(type === 'function') {
      return `(form) => { return form.status !== '失败' }`
    }
    return `this.action !== 'add'`
  }

  // 处理输出json，去掉不需要的字段与默认值
  const processJson = () => {
    return _.map(tableData, (q) => {
      const temp = {
        ...q
      }
      temp.id && delete temp.id
      temp.span === 1 && delete temp.span
      temp.rows === 2 && delete temp.rows
      temp.prepend === '' && delete temp.prepend
      temp.append === '' && delete temp.append
      temp.limit === 5 && delete temp.limit
      temp.fileSize === 5  && delete temp.fileSize
      _.isEqual(temp.fileType,['doc','docx','xls','xlsx','ppt','pptx','txt','pdf','png','jpg']) && delete temp.fileType
      _.isEmpty(temp.rule) && delete temp.rule
      _.isEmpty(temp.format) && delete temp.format
      _.isEmpty(temp.valueFormat) && delete temp.valueFormat
      return temp
    })
  }

  // 处理输出粘贴板，去掉字典的引号
  const onCopy = (copy) => {
    const container = document.createElement('textarea')
    const arr = copy.src
    let resultStr = JSON.stringify(arr)
    // 字典字段去引号
    const filterDicts = _.map(arr, (item) => {
      return (item.type === 'select' || item.type === 'select-tree' || item.type === 'radio' || item.type === 'radio-button' ) && item.data
    })
    _.forEach(filterDicts, (f) => {
      resultStr = _.replace(resultStr, `"${f}"`, f)
    })
    // 忽略字段去引号
    const filterIgnore = _.map(arr, (item) => {
      return item.ignore
    })
    _.forEach(filterIgnore, (f) => {
      resultStr = _.replace(resultStr, `"${f}"`, f)
    })
    // 规则字段去引号
    const filterRules = _.map(arr, (item) => {
      return item.rule
    })
    _.forEach(filterRules, (f) => {
      // 保留一份原始f的json
      let tempArr = JSON.stringify(f)
      // 修改后的f的json
      let resultArr = JSON.stringify(f)
      _.forEach(f, (a) => {
        resultArr = _.replace(resultArr, `"${a}"`, a)
      })
      resultStr = _.replace(resultStr, tempArr, resultArr)
    })
    container.innerHTML = resultStr
    document.body.appendChild(container)
    container.select()
    document.execCommand('copy')
    document.body.removeChild(container)
  }

  return (
    <div className="f-c">
      <div>
        <Button type="primary" onClick={addRow}>新增</Button>
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
        title="Form配置详情"
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
                  { value: 'input', label: 'input-文本输入' },
                  { value: 'input-number', label: 'input-number-数字输入(v5)'},
                  { value: 'select', label: 'select-下拉' },
                  { value: 'select-tree', label: 'select-tree-下拉树(v9)' },
                  { value: 'custom', label: 'custom-自定义' },
                  { value: 'textarea', label: 'textarea-文本域输入(v2)'},
                  { value: 'radio', label: 'radio-单选(v5)'},
                  { value: 'radio-button', label: 'radio-button-单选按钮(v5)'},
                  { value: 'checkbox', label: 'checkbox-复选(v10)'},
                  { value: 'checkbox-button', label: 'checkbox-button-复选按钮(v10)'},
                  { value: 'password', label: 'password-密码输入'},
                  { value: 'fileUpload', label: 'fileUpload-文件上传(v4)'},
                  { value: 'imageUpload', label: 'imageUpload-图片上传(v4)'},
                  { value: 'date', label: 'date-日期选择'},
                  { value: 'week', label: 'week-周选择'},
                  { value: 'month', label: 'month-月选择'},
                  { value: 'year', label: 'year-年选择'},
                  { value: 'datetime', label: 'datetime-日期时间选择'},
                  { value: 'daterange', label: 'daterange-日期范围选择'},
                  { value: 'datetimerange', label: 'datetimerange-日期时间范围选择'},
                  { value: 'time', label: 'time-时分选择(v7)'},
                  { value: 'timerange', label: 'timerange-时分范围选(v7)'},
                ]}
              />
            </Col>  
          </Row>
          { (currentRow.current.type === 'select' || currentRow.current.type === 'radio' || currentRow.current.type === 'radio-button' || currentRow.current.type === 'checkbox' || currentRow.current.type === 'checkbox-button') && 
          <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">字典数据集</Col>
            <Col span={18}>
              <Input value={currentRow.current.data?currentRow.current.data.replace(new RegExp('^this.dict.type.'), ''):''} prefix="this.dict.type." onChange={(e) => edit('data', `this.dict.type.${e.currentTarget.value}`, currentRow.current.id)} />
            </Col>
            <Col span={24} className="c-r10 mt-4">注：需要映射字典时使用，非字典自定义数据集请随意填写后在代码中修改</Col>
          </Row>
          }
          { currentRow.current.type === 'select-tree' && 
          <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">数据集</Col>
            <Col span={18}>
            <Input value={currentRow.current.data} onChange={(e) => edit('data', e.currentTarget.value, currentRow.current.id)} />
            </Col>
            <Col span={24} className="c-r10 mt-4">注：默认映射关系为label: 'label' , value: 'id'，如需定制，则需要调整，详见<a href="./base-form" target='_blank'>示例代码</a></Col>
          </Row>
          }
          { currentRow.current.type === 'select' || currentRow.current.type === 'select-tree' &&
          <React.Fragment>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">是否多选</Col>
              <Col span={18}>
                <Radio.Group value={currentRow.current.multiple} onChange={(e) => edit('multiple', e.target.value, currentRow.current.id)} >
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Col>
              <Col span={24} className="c-r10 mt-4">注：不填type=select默认为否,type=select-tree默认为是</Col>
            </Row>
          </React.Fragment>
          }
          { currentRow.current.type === 'select' &&
          <React.Fragment>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">是否可搜索</Col>
              <Col span={18}>
                <Radio.Group value={currentRow.current.filterable} onChange={(e) => edit('filterable', e.target.value, currentRow.current.id)} >
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Col>
              <Col span={24} className="c-r10 mt-4">注：不填即默认为是</Col>
            </Row>
          </React.Fragment>
          }
          {currentRow.current.type === 'textarea' &&
          <Row className="my-12" gutter={4}>
            <Col span={6} className="f-r --c">文本域行数</Col>
            <Col span={18}>
              <InputNumber value={currentRow.current.rows} onChange={(v) => edit('rows', v, currentRow.current.id)} />
            </Col>
            <Col span={24} className="c-r10 mt-4">注：默认为2行</Col>
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
          { currentRow.current.type === 'input' && 
          <React.Fragment>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">前缀内容</Col>
              <Col span={18}>
                <Input value={currentRow.current.prepend} onChange={(e) => edit('prepend', e.currentTarget.value, currentRow.current.id)} />
              </Col>
            </Row>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">后缀内容</Col>
              <Col span={18}>
                <Input value={currentRow.current.append} onChange={(e) => edit('append', e.currentTarget.value, currentRow.current.id)} />
              </Col>
            </Row>
          </React.Fragment>
          }
          { currentRow.current.type === 'input-number' && 
          <React.Fragment>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">输入最小值</Col>
              <Col span={18}>
                <InputNumber value={currentRow.current.min} onChange={(v) => edit('min', v, currentRow.current.id)} />
              </Col>
            </Row>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">输入最大值</Col>
              <Col span={18}>
              <InputNumber value={currentRow.current.max} onChange={(v) => edit('max', v, currentRow.current.id)} />
              </Col>
            </Row>
          </React.Fragment>
          }
          { (currentRow.current.type === 'fileUpload' || currentRow.current.type === 'imageUpload' ) && 
          <React.Fragment>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">数量限制</Col>
              <Col span={18}>
                <InputNumber value={currentRow.current.limit} onChange={(v) => edit('limit', v, currentRow.current.id)} />
              </Col>
              <Col span={24} className="c-r10 mt-4">注：默认为5个</Col>
            </Row>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">大小限制(MB)</Col>
              <Col span={18}>
                <InputNumber value={currentRow.current.fileSize} onChange={(v) => edit('fileSize', v, currentRow.current.id)} />
              </Col>
              <Col span={24} className="c-r10 mt-4">注：默认为5MB</Col>
            </Row>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">类型限制</Col>
              <Col span={18}>
                <Select
                  value={currentRow.current.fileType}
                  style={{ width: '100%' }}
                  mode="multiple"
                  allowClear
                  onChange={(v) => edit('fileType', v, currentRow.current.id)}
                  options={[
                    { value: 'doc', label: 'doc' },
                    { value: 'docx', label: 'docx' },
                    { value: 'xls', label: 'xls' },
                    { value: 'xlsx', label: 'xlsx' },
                    { value: 'ppt', label: 'ppt' },
                    { value: 'pptx', label: 'pptx' },
                    { value: 'txt', label: 'txt' },
                    { value: 'pdf', label: 'pdf' },
                    { value: 'png', label: 'png' },
                    { value: 'jpg', label: 'jpg' },
                    { value: 'jpeg', label: 'jpeg' },
                    { value: 'gif', label: 'gif' },
                  ]}
                />
              </Col>
              <Col span={24} className="c-r10 mt-4">注：默认为['doc','docx','xls','xlsx','ppt','pptx','txt','pdf','png','jpg']</Col>
            </Row>
          </React.Fragment>
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
              <Col span={24} className="c-r10 mt-4">注：不填即默认yyyy[w]WW（补0），输出格式化存在bug，无法直接输出例如yyyy-WW这种格式，默认输出的是当前选择周的周一Date对象，如需要存当年周数，可以用dayjs转换一下</Col>
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
              <Col span={24} className="c-r10 mt-4">注：不填即默认yyyy-MM（补0）</Col>
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
              <Col span={24} className="c-r10 mt-4">注：不填即默认yyyy（补0）</Col>
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
          { (currentRow.current.type !== 'radio' && currentRow.current.type !== 'radio-button' && currentRow.current.type !== 'checkbox' && currentRow.current.type !== 'checkbox-button' && currentRow.current.type !== 'fileUpload' && currentRow.current.type !== 'imageUpload')&& 
          <React.Fragment>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">占位字符</Col>
              <Col span={18}>
                <Space.Compact style={{ width: '100%' }}>
                  <Input value={currentRow.current.placeholder} onChange={(e) => edit('placeholder', e.currentTarget.value, currentRow.current.id)} />
                  <Button type="primary" onClick={autoPlaceholder}>自动写入</Button>
                </Space.Compact>
              </Col>
            </Row>
          </React.Fragment>
          }
          {currentRow.current.type !== 'custom' &&
          <React.Fragment>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">内容宽度</Col>
              <Col span={18}>
                <Input value={currentRow.current.width} onChange={(e) => edit('width', e.currentTarget.value, currentRow.current.id)} />
              </Col>
              <Col span={24} className="c-r10 mt-4">注：填入例如'200px'或'80%'，不填即默认100%宽度</Col>
            </Row>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">是否禁用</Col>
              <Col span={18}>
                <Radio.Group value={currentRow.current.disabled} onChange={(e) => edit('disabled', e.target.value, currentRow.current.id)} >
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Col>
              <Col span={24} className="c-r10 mt-4">注：用于特殊表单项的禁用判断，不填即默认为全局控制，即新增修改不禁用，查看禁用，若需代码条件控制，可随意填写后代码中再修改</Col>
            </Row>
          </React.Fragment>
          }
          <React.Fragment>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">提示信息</Col>
              <Col span={18}>
                <Space.Compact style={{ width: '100%' }}>
                  <Input value={currentRow.current.tooltip} onChange={(e) => edit('tooltip', e.currentTarget.value, currentRow.current.id)} />
                </Space.Compact>
              </Col>
              <Col span={24} className="c-r10 mt-4">注：label提示信息，会在label前显示一个问号icon，鼠标悬停时显示输入的提示信息</Col>
            </Row>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">规则</Col>
              <Col span={18}>
                <Select
                    value={currentRow.current.rule}
                    style={{ width: '100%' }}
                    onChange={(v) => edit('rule', v, currentRow.current.id)}
                    allowClear
                    mode="multiple"
                    options={[
                      { value: autoRule('非空校验'), label: '非空校验' },
                      { value: autoRule('字符长度校验'), label: '字符长度校验' },
                      { value: autoRule('邮箱格式校验'), label: '邮箱格式校验' },
                      { value: autoRule('手机号码格式校验'), label: '手机号码格式校验' },
                      { value: autoRule('密码强度校验'), label: '密码强度校验(字母+数字+至少8位)' },
                      { value: autoRule('数字范围校验'), label: '数字范围校验' },
                      { value: autoRule('自定义校验规则'), label: '自定义校验规则' },
                    ]}
                  />
              </Col>
              <Col span={24} className="c-r10 mt-4">注：如需自定义，请先选择必填后再在代码里修改，点击查看<a href="https://github.com/yiminghe/async-validator" target='_blank'>校验规则</a></Col>
            </Row>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">占据列数</Col>
              <Col span={18}>
                <InputNumber value={currentRow.current.span} onChange={(v) => edit('span', v, currentRow.current.id)} />
              </Col>
              <Col span={24} className="c-r10 mt-4">注：用于超长的表单项，默认占据1列，如有变更，需小于等于columns</Col>
            </Row>
            <Row className="my-12" gutter={4}>
              <Col span={6} className="f-r --c">是否忽略</Col>
              <Col span={18}>
                <Radio.Group value={currentRow.current.ignore} onChange={(e) => edit('ignore', e.target.value, currentRow.current.id)} >
                  <Radio value={autoIgnore('boolean')}>Boolean</Radio>
                  <Radio value={autoIgnore('function')}>Function</Radio>
                </Radio.Group>
              </Col>
              <Col span={24} className="c-r10 mt-4">注：一般用于某一表单项在特定场景下显示或者忽略，选择后会生成示例代码，可复制到config里修改</Col>
            </Row>
          </React.Fragment>
        </div>
      </Drawer>
    </div>
  )
}

export default VForm