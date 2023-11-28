---
nav:
  title: 组件
  order: 2
group:
  title: 基础组件
  order: 1
title: Tree
order: 3
---

# Tree

基于 element ui 的 Tree 进行树组件封装，只适用于一般通用树。

## 属性

### Attributes

|     参数     | 说明                                             |  类型   | 是否必须 |                      默认值                       |
| :----------: | :----------------------------------------------- | :-----: | :------: | :-----------------------------------------------: |
|     data     | 显示的数据，与 el-tree 的 data 一致              |  Array  |   必选   |                        []                         |
| default-props | 显示数据对象的映射关系，与 el-tree 的 props 一致 | Object  |   可选   | {children: 'children',label: 'label',value: 'id'} |
|   default    | 默认值，为 data 数组中的某个对象 node            | Object  |   可选   |                        {}                         |
| is-expand-all  | 是否默认展开                                     | Boolean |   可选   |                       false                       |
| expand-on-click-node | 是否点击节点默认展开/收缩子节点              | Boolean |   可选   |                       true                       |

### Event

|  事件  | 说明               |     回调参数     |
| :----: | :----------------- | :--------------: |
| change | 点击树节点回调函数 | 点击的 node 对象 |
