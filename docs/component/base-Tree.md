---
nav:
  title: 组件
  order: 2
group:
  title: 基础组件
  order: 1
title: Tree
---

# Tree

基于 element ui 的 Tree 进行树组件封装，只适用于一般通用树。

## 使用案例

- 长勘院
  - enterprisePerson 模块
  - organization 模块

## 属性

### Attributes

|     参数     | 说明                                             |  类型   | 是否必须 |                      默认值                       |
| :----------: | :----------------------------------------------- | :-----: | :------: | :-----------------------------------------------: |
|     data     | 显示的数据，与 el-tree 的 data 一致              |  Array  |   必选   |                        []                         |
| defaultProps | 显示数据对象的映射关系，与 el-tree 的 props 一致 | Object  |   可选   | {children: 'children',label: 'label',value: 'id'} |
|   default    | 默认值，为 data 数组中的某个对象 node            | Object  |   可选   |                        {}                         |
| isExpandAll  | 是否默认展开                                     | Boolean |   可选   |                       false                       |

### Event

|  事件  | 说明               |     回调参数     |
| :----: | :----------------- | :--------------: |
| change | 点击树节点回调函数 | 点击的 node 对象 |
