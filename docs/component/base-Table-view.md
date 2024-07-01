---
nav:
  title: 组件
  order: 2
group:
  title: 基础组件
  order: 1
title: VTable
order: 3
debug: true
---

# VTable

基于 element ui 的 Table 进行了封装，只适用于一般通用表格。

## 属性

### Attributes

|     参数      | 说明                                                     |        类型        | 是否必须 | 默认值 |
| :-----------: | :------------------------------------------------------- | :----------------: | :------: | :----: |
|     data      | 显示的数据，为对象数组，与 el-table 组件中 data 结构一致 |       Array        |   必选   |   []   |
|    config    | 列配置，对象数组，详细见下方的 Config Attributes       |       Array        |   必选   |   []   |
|     total     | 总数据数，分页必须                                       |       Number       |   可选   |   0    |
|     page-num    | 当前页数，分页必须，需要加sync                            |       Number       |   可选   |   1    |
|     page-size   | 每页显示条目个数，分页必须，需要加sync                      |       Number       |   可选   |   10    |
|  selectable   | 多选框配置                                               | [Boolean,Function] |   可选   | false  |
| serializable  | 是否在行头显示序号                                       |      Boolean       |   可选   | false  |
| row-key | 列表rowKey，与el-table中的row-key 结构一致          |      [String, Function]      |   可选   |  'id'  |
| cell-style | 单元格的 style 的回调方法， 与 el-table 组件中 cell-style 结构一致 |      [Function, Object]      |   可选   |  undefined  |

注：

1. selectable
   selectable 可以设置为 boolean，是否展示多选框。也可以设置为一个 function，必定展示多选框，并且相当于 el-table -> Table-column Attributes -> selectable ，函数返回值决定是否可以对其勾选

### Methods

|     事件      | 说明         |           参数           |
| :-----------: | :----------- | :----------------------: |
| setPagination | 设置分页参数 | {pageNum:xx,pageSize:xx} |

注：

1. setPagination
   在查询，排序事件中需要重置pageNum为1：`this.$refs.table.setPagination({ pageNum: 1 })`

### Event

|       事件       | 说明                                |         回调参数         |
| :--------------: | :---------------------------------- | :----------------------: |
|     refresh      | 刷新回调                            |            -             |
|     row-click     | 单击行回调，同el-table的row-click事件                          |            -             |
|     row-dblclick   | 双击行回调，同el-table的row-dblclick事件       |       row: Object        |
|     select      | 当用户手动勾选数据行的 Checkbox 时触发的事件，同el-table的select事件  |     selection: Array, row: Object     |
|     select-all     | 当用户手动勾选全选 Checkbox 时触发的事件，同el-table的select-all事件  |     selection: Array  |
|      selection-change    | 当选择项发生变化时会触发该事件，同el-table的selection-change事件  |     selection: Array     |
|       sort       | 排序回调，同el-table的sort-change事件     |     orderList: Array     |
| paginationChange | 当分页数据发生变化时触发该事件            | {pageNum:xx,pageSize:xx} |

### Config Attributes

|   参数   | 说明                                                   |  类型   |         是否必须          |
| :------: | :----------------------------------------------------- | :-----: | :-----------------------: |
|  label   | 列名                                                   | String  |            是             |
|   key    | 列键值                                                 | String  |            是             |
|  align   | 对齐方式                                               | String  |            否             |
|  width   | 列宽                                                   | String  |            否             |
| sortable | 是否排序                                               | Boolean |            否             |

