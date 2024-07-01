---
nav:
  title: 组件
  order: 2
group:
  title: 基础组件
  order: 1
title: VForm
order: 1
debug: true
---

# VForm

基于 element ui 的 Form 定制新增/修改/查看模版组件

## 属性

### Attributes

|    参数     | 说明                                          |  类型   | 是否必须 | 默认值 |
| :---------: | :-------------------------------------------- | :-----: | :------: | :----: |
|    config     | Form 配置，对象数组，详细见下方的 config 配置项 |  Array  |   必选   |   []   |
|   columns   | 列数，仅可选 1,2,3,4,6,8,12,24 列               | Number  |   可选   |   4    |
|  label-width  | label 宽度                                    | Number  |   可选   |  100   |
|  rules  | 规则集                                    | Array  |   可选   |  []   |
|  disabled  | 是否禁用                                    | Boolean  |   可选   |  false   |


### Config Attributes

config是表单配置项参数，数组中的对象是表单中的Divider对象，为第一层级；Divider对象的children数组中的对象是Divider内的表单对象，为第二层级

|    参数     | 说明                        |      类型      |          是否必须          |
| :---------: | :-------------------------- | :------------: | :------------------------: |
|    label     | 表单label                |     String     |             是             |
|     key     | 键值                |     String     |             是             |
|    width    | form-item内容宽度                |     String     |             否             |
|    rule     | 规则               |     Array     |             否             |

