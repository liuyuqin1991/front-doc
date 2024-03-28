---
nav:
  title: 组件
  order: 2
group:
  title: 基础组件
  order: 1
title: QueryForm
order: 1
---

# QueryForm

基于 element ui 的 Form 进行查询栏表单封装，只适用于一般通用查询栏。

## 属性

### Attributes

|    参数     | 说明                                          |  类型   | 是否必须 | 默认值 |
| :---------: | :-------------------------------------------- | :-----: | :------: | :----: |
|    data     | Form 配置，对象数组，详细见下方的 data 配置项 |  Array  |   必选   |   []   |
|   columns   | 列数，仅可选 1,2,3,4,6,8,12,24 列               | Number  |   可选   |   4    |
| label-width  | label 宽度                                    | Number  |   可选   |  100   |
| default-show | 是否默认展开                                  | Boolean |   可选   |  true  |
| is-show-border | 是否显示边框，正常显示边框，窄屏需要隐藏边框                               | Boolean |   可选   |  true  |


### Event

| 事件  | 说明     |        回调参数        |
| :---: | :------- | :--------------------: |
| query | 查询回调 | {queryParams, isReset} |

### Data Attributes

|    参数     | 说明                        |      类型      |          是否必须          |
| :---------: | :-------------------------- | :------------: | :------------------------: |
|    type     | 单个查询类型                |     String     |             是             |
|    name     | 单个查询名称                |     String     |             是             |
|     key     | 单个查询键值                |     String     |             是             |
| placeholder | 占位显示文案                |     String     |             否             |
|    data     | 数据集 | [Array,Object] | 否，但 type 为 select 必须 |
|    span     | 占据列数                    |     Number     |             否             |
|    format     | 显示格式化                    |     String     |             否             |
|    valueFormat     | 输出格式化                    |     String     |             否             |

注：

1. type
   列类型，可选值：input（输入框）、select（下拉框）、data（日）、week（周）、month（月）、year（年）、datetime（日期时间）、daterange（日期范围）、datetimerange（日期时间范围）、custom（自定义）

2. data
   type 为 select 特有，下拉框数据集，类型为 Array 或 Object，示例如下：

```
// data类型为Array，映射关系默认为{ label: 'label' , value: 'value'}
data: this.dict.type.event_status,

// data类型为Object，手动指定映射关系
data: {
  data: customArray,
  label: 'name',
  value: 'id'
}

```

3. span
   占据列数，用于超长的查询项，默认占据 1 列，需小于 columns
  
4. format与valueFormat
  type 为 data、daterange、datetimerange 特有，同elementui里DatePicker组件里的format与value-format

### Slot

|  插槽  | 说明                                      |
| :----: | :---------------------------------------- |
| 自定义 | Form 配置中 type 为 custom 时的自定义插槽 |
