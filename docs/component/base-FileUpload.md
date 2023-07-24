---
nav:
  title: 组件
  order: 2
group:
  title: 基础组件
  order: 1
title: FileUpload
order: 5
---

# FileUpload

基于 element ui 的 FileUpload 进行封装，只适用于一般文件上传。

## 使用案例

- cuihua
  - contractorPage 模块
  - contractorsPersonnel 模块
  - workPermit 模块
  - ImportDataDialog 公共组件模块

## 属性

### Attributes

|      参数       | 说明                          |  类型   | 是否必须 |                      默认值                       |
| :-------------: | :---------------------------- | :-----: | :------: | :-----------------------------------------------: |
| value / v-model | v-model 绑定值                | String  |   必选   |                        ''                         |
|      limit      | 上传数量限制                  | Number  |   可选   |                         5                         |
|    fileSize     | 上传文件大小限制              | Number  |   可选   |                         5                         |
|    fileType     | 上传文件类型                  |  Array  |   可选   | ['doc', 'xls', 'ppt', 'txt', 'pdf', 'png', 'jpg'] |
|    isShowTip    | 是否显示提示                  | Boolean |   可选   |                       true                        |
|    disabled     | 是否禁用                      | Boolean |   可选   |                       false                       |
|      size       | 按钮大小 ，可选'small'或'big' | String  |   可选   |                      'small'                      |
|      label      | 按钮文字                      | String  |   可选   |                        ''                         |

### Event

|   事件   | 说明                           |   回调参数   |
| :------: | :----------------------------- | :----------: |
|  input   | 文件变更回调，v-model 双向绑定 |  file 数组   |
| progress | 上传进度回调                   | percent 数值 |

### Slot

| 插槽 | 说明                         |
| :--: | :--------------------------- |
| tip  | 提示栏插槽，一般为<span>文案 |
