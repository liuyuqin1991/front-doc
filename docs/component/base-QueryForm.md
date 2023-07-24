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

## 使用案例

- 长勘院
  - enterprisePerson 模块
  - organization 模块
- 地铁
  - 隐患排查-ai 预警模块

## 属性

### Attributes

|    参数     | 说明                                          |  类型   | 是否必须 | 默认值 |
| :---------: | :-------------------------------------------- | :-----: | :------: | :----: |
|    data     | Form 配置，对象数组，详细见下方的 data 配置项 |  Array  |   必选   |   []   |
|   columns   | 列数，仅可选 2,3,4 列                         | Number  |   可选   |   4    |
| labelWidth  | label 宽度                                    | Number  |   可选   |  100   |
| defaultShow | 是否默认展开                                  | Boolean |   可选   |  true  |

### Event

| 事件  | 说明     |        回调参数        |
| :---: | :------- | :--------------------: |
| query | 查询回调 | {queryParams, isReset} |

### Data Attributes

|    参数     | 说明                            |  类型  |          是否必须          |
| :---------: | :------------------------------ | :----: | :------------------------: |
|    type     | 单个查询类型                    | String |             是             |
|    name     | 单个查询名称                    | String |             是             |
|     key     | 单个查询键值                    | String |             是             |
| placeholder | 占位显示文案                    | String |             否             |
|    data     | type 为 select 特有，数据集对象 | Object | 否，但 type 为 select 必须 |
|    span     | 占据列数                        | Number |             否             |

注：

1. type
   列类型，可选值：input（输入框）、select（下拉框）、daterange（日期范围）、datetimerange（日期时间范围）、custom（自定义）

2. data
   数据集对象，包含数据，字段映射，例如：

```
data: {
  data: this.dict.type.event_status,
  label: 'label',
  value: 'value'
}

```

3. span
   占据列数，用于超长的查询项，默认占据 1 列，需小于 columns

### Slot

|  插槽  | 说明                                      |
| :----: | :---------------------------------------- |
| 自定义 | Form 配置中 type 为 custom 时的自定义插槽 |
