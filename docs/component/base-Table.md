---
nav:
  title: 组件
  order: 2
group:
  title: 基础组件
  order: 1
title: Table
order: 2
---

# Table

基于 element ui 的 Table 进行了封装，只适用于一般通用表格。

## 属性

### Attributes

|     参数      | 说明                                                     |        类型        | 是否必须 | 默认值 |
| :-----------: | :------------------------------------------------------- | :----------------: | :------: | :----: |
|     data      | 显示的数据，为对象数组，与 el-table 组件中 data 结构一致 |       Array        |   必选   |   []   |
|    columns    | 列配置，也对象数组，详细见下方的 columns 配置项          |       Array        |   必选   |   []   |
|     total     | 总数据数，分页必须                                       |       Number       |   可选   |   0    |
|  selectable   | 多选框配置                                               | [Boolean,Function] |   可选   | false  |
| serializable  | 是否在行头显示序号                                       |      Boolean       |   可选   | false  |
| show-top-action | 是否显示 top action                                      |      Boolean       |   可选   |  true  |
| height | 表格高度，与 el-table 组件中 height 结构一致                 |      Number       |   可选   |  undefined  |
| max-height | 表格最大高度，与 el-table 组件中 max-height 结构一致            |      Number       |   可选   |  undefined  |
| is-height-outer-resize | 是否外部自适应高度，如开启此项，就不要传height与max-height           |      Boolean       |   可选   |  false  |
| row-key | 列表rowKey，与el-table中的row-key 结构一致          |      [String, Function]      |   可选   |  'id'  |
| cell-style | 单元格的 style 的回调方法， 与 el-table 组件中 cell-style 结构一致 |      [Function, Object]      |   可选   |  undefined  |

注：

1. selectable
   selectable 可以设置为 boolean，是否展示多选框。也可以设置为一个 function，必定展示多选框，并且相当于 el-table -> Table-column Attributes -> selectable ，函数返回值决定是否可以对其勾选
2. showTopAction
   TopAction 包含列表上左侧的自定义 button 区和上右侧的通用 button 区，自定义 button 区可通用插槽进行添加自定义 button，通用 button 区包含折叠查询框 button 和刷新列表 button
3. height、max-height、is-height-outer-resize
   这三项属性一起控制表格高度，高度控制情况如下：
   - 如果三个参数都不传，则表格高度内容自适应，会根据外层div来控制滚动
   - 如果只传height，没有啥用，且会存在某些渲染问题导致滚动条异常，一般不要只传height
   - 如果只传max-height，则表格高度最大值会固定为max-height，超出后表身显示滚动条，表头不跟随滚动；未超出内容自适应
   - 如果同时传height与max-height，则在b的基础上，未超出max-height时，表格高度为height而非内容自适应
   - 如果is-height-outer-resize为true，此时不能传递height和max-height，表格会根据外层div来动态计算max-height，显示情况与b相同

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
|      select      | 当存在复选框且选择项发生变化时会触发该事件，同el-table的selection-change事件  |     selection: Array     |
|       sort       | 排序回调，同el-table的sort-change事件     |     orderList: Array     |
| paginationChange | 当分页数据发生变化时触发该事件            | {pageNum:xx,pageSize:xx} |
|    自定义事件    | 列配置中 type 为 tag 时的自定义事件 |       row: Object        |

### Columns Attributes

|   参数   | 说明                                                   |  类型   |         是否必须          |
| :------: | :----------------------------------------------------- | :-----: | :-----------------------: |
|   type   | 列类型                                                 | String  |            是             |
|  label   | 列名                                                   | String  |            是             |
|   name    | type 为 custom 特有，插槽名称，与插槽template的name对应  | String |            否             |
|   key    | 列键值                                                 | String  |            是             |
|  align   | 对齐方式                                               | String  |            否             |
|  width   | 列宽                                                   | String  |            否             |
| sortable | 是否排序                                               | Boolean |            否             |
|   dict   | type 为 text 和 tag 特有，字典数据，需要映射字典时使用 |  Array  |            否             |
|  click   | type 为 text 和 tag 特有，自定义点击事件 emit 的名称   | String  |            否             |
|   map    | type 为 text 特有，map 数据，需要映射 map 时使用       | Object  |            否             |
| mapSize  | type 为 image 特有，map 数据，需要映射 map 时使用      | Object  | 否，但 type 为 image 必须 |

注：

1. type
   列类型，可选值：

   - text：文本
   - date：日期，格式为：YYYY-MM-DD
   - time：时分，格式为：HH:mm
   - time-second：时分秒，格式为：HH:mm:SS
   - date-time：日期 + 时分，格式为：YYYY-MM-DD HH:mm
   - date-time-second： 日期 + 时分秒，格式为：YYYY-MM-DD HH:mm:SS
   - tag：标签，一般为字典数据
   - image：图片
   - custom：自定义

2. dict
   字典数据，会根据值映射字典的 label 显示，如果 type=tag，还会根据字典设置里的回显样式和样式属性设置 tag 的颜色值，样式属性优先回显样式

3. mapSize
   大小图片 size 的 map 映射，type=image 时的必填项，key 为 size 和 small，value 为数据的大小图字段，必须同时设置大小图的 url，如果相同，可以设置为同一个 url，例如：`{ small: 'smallImageUrl', big: 'bigImageUrl' }`

4. click
   自定义点击事件 emit 名称，设置后，在 Table 组件属性中声明与该名称相同的事件

### Slot

|     插槽      | 说明                                   |
| :-----------: | :------------------------------------- |
|  top-action   | 表格左上自定义 button 区               |
| column-action | 表格行右侧操作栏                       |
|    自定义     | 列配置中 type 为 custom 时的自定义插槽 |
