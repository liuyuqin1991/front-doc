---
nav:
  title: 组件
  order: 2
group:
  title: 基础组件
  order: 1
title: VTable
order: 3
---

# VTable<Badge>v7.0</Badge>

基于 element ui 的 Table 进行了封装，实现了一般通用表格展示、自定义功能按钮、隐藏/显示搜索栏、刷新数据、列过滤、分页、批量操作等功能。

![Table](../assets/base-component/table.png)

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
| default-expand-all<Badge>v5</Badge>  | 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效    |      Boolean       |   可选   | true  |
| show-top-action | 是否显示 top action                                      |      Boolean       |   可选   |  true  |
| height | 表格高度，与 el-table 组件中 height 结构一致                 |      Number       |   可选   |  undefined  |
| max-height | 表格最大高度，与 el-table 组件中 max-height 结构一致            |      Number       |   可选   |  undefined  |
| is-height-outer-resize | 是否外部自适应高度，如开启此项，就不要传height与max-height           |      Boolean       |   可选   |  false  |
| row-key | 列表rowKey，与el-table中的row-key 结构一致          |      [String, Function]      |   可选   |  'id'  |
| cell-style | 单元格的 style 的回调方法， 与 el-table 组件中 cell-style 结构一致 |      [Function, Object]      |   可选   |  undefined  |
| span-method<Badge>v3</Badge> | 合并行或列的计算方法 的回调方法， 与 el-table 组件中 span-method 结构一致 |      Function      |   可选   |  undefined  |
| row-class-name<Badge>v4</Badge> | 行的 className 的回调方法， 与 el-table 组件中 row-class-name 结构一致 |      [Function, String]      |   可选   |  undefined  |
| cell-class-name<Badge>v4</Badge> | 单元格的 className 的回调方法， 与 el-table 组件中 cell-class-name 结构一致 |      [Function, String]      |   可选   |  undefined  |


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
|    自定义事件    | 列配置中 type 为 tag 时的自定义事件 |       row: Object        |

### Config Attributes

|   参数   | 说明                                                   |  类型   |         是否必须          |
| :------: | :----------------------------------------------------- | :-----: | :-----------------------: |
|   type   | 列类型                                                 | String  |            是             |
|  label   | 列名                                                   | String  |            是             |
|   name    | type 为 custom 特有，插槽名称，与插槽template的name对应  | String |            否             |
|   key    | 列键值                                                 | String  |            是             |
|  align   | 对齐方式                                               | String  |            否             |
|  width   | 列宽                                                   | String  |            否             |
| sortable | 是否排序                                               | Boolean |            否             |
|  formatter<Badge>v6</Badge>   | type 为 text 特有，格式化内容   | Function  |            否             |
|  emptyPlaceholder<Badge>v7</Badge>  | type 为 text 特有，空值占位符              | String  |            否             |
|   dict   | type 为 text 和 tag 特有，字典数据，需要映射字典时使用 |  Array  |            否             |
|  click   | type 为 text 和 tag 特有，自定义点击事件 emit 的名称   | String  |            否             |
|  showOverflowTooltip<Badge>v5</Badge>   | type 为 text 特有，当内容过长被隐藏时显示 tooltip   | Boolean  |            否             |
|   map    | type 为 text 特有，map 数据，需要映射 map 时使用       | Object  |            否             |
| mapSize  | type 为 image 特有，map 数据，需要映射 map 时使用      | Object  | 否，但 type 为 image 必须 |
| disabledFilter<Badge>v2</Badge> | 禁用列过滤，如设置true，则该列不受列过滤影响持续显示 | Boolean |            否             |
| isHidden<Badge>v2</Badge> | 是否隐藏列，如设置true，则该列在表格初始化时不显示 | Boolean |            否             |

注：

:::warning{title=重要}
为降低心智负担，文档库配备了可视化页面来创建Table列配置代码，详见左侧菜单<配置可视化>
:::

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

5. formatter
   格式化内容回调函数，(value, config) => {}， value为当前值，config为当前列配置对象，例如：

```
{
   type: 'text',
   label: '参数键值',
   key: 'configValue',
   align: 'center',
   showOverflowTooltip: true,
   formatter: (value, config) => {
      return _.isEmpty(value) ? '/' : value
   }
},
```

### Slot

|     插槽      | 说明                                   |
| :-----------: | :------------------------------------- |
|  top-action   | 表格左上自定义 button 区               |
| column-action | 表格行右侧操作栏                       |
|    自定义     | 列配置中 type 为 custom 时的自定义插槽 |

示例：

```
<VTable
   ref="table"
   :config="tableColumnsConfig"
   :data="tableData"
   :total="total"
   :page-num.sync="queryParams.pageNum"
   :page-size.sync="queryParams.pageSize"
   serializable
   selectable
   is-height-outer-resize
   @refresh="getTableData"
   @selection-change="selectionChange"
   @sort="sort"
>
   <template #status>
      <el-table-column :label="t('状态')" align="center">
         <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @change="handleStatusChange(scope.row)" />
         </template>
      </el-table-column>
   </template>
   <template #top-action>
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="showAdd()">{{ t('新增') }}</el-button>
      <el-button type="primary" icon="el-icon-delete" size="mini" @click="showBatchDeleteDialog()">{{ t('批量删除') }}</el-button>
      <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport">{{ t('导出') }}</el-button>
   </template>
   <template #column-action>
      <el-table-column :label="t('操作')" width="200" align="center">
         <template slot-scope="scope">
            <el-button type="text" size="mini" @click="showEditDialog(scope.row)">{{ t('修改') }}</el-button>
            <el-button type="text" size="mini" @click="showDetailDialog(scope.row)">{{ t('查看') }}</el-button>
            <el-button type="text" size="mini" @click="handleDelete(scope.row)">{{ t('删除') }}</el-button>
            <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
               <el-button size="mini" type="text">{{ t('更多') }}</el-button>
               <el-dropdown-menu slot="dropdown">
               <el-dropdown-item command="handleRun">{{ t('执行一次') }}</el-dropdown-item>
               <el-dropdown-item command="handleJobLog">{{ t('调度日志') }}</el-dropdown-item>
               </el-dropdown-menu>
            </el-dropdown>
         </template>
      </el-table-column>
   </template>
</VTable>
```
