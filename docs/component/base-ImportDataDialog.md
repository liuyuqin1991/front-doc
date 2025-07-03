---
nav:
  title: 组件
  order: 2
group:
  title: 基础组件
  order: 1
title: VImportDataDialog
order: 13
debug: true
---

# VImportDataDialog

导入弹窗，功能为下载标准模板并填写信息后上传，再导入

## 属性

### Attributes

|    参数     | 说明                      |  类型   | 是否必须 |               默认值               |
| :---------: | :------------------------ | :-----: | :------: | :--------------------------------: |
|    open     | 弹窗隐藏/显示受控属性     | Boolean |   必选   |               false                |
|    title    | 弹窗标题                  | String  |   可选   |               '导入'               |
| template-tip | 下载模板显示文案          | String  |   可选   | '请下载标准模板，按照模板录入数据' |
| template-url | 下载模板的文件路径        | String  |   必选   |                 ''                 |
|  ...$attr   | FileUpload 组件的属性透传 |    -    |    -     |                 -                  |

### Event

| 事件  | 说明             |   回调参数    |
| :---: | :--------------- | :-----------: |
|  ok   | 导入功能回调     | file 对象数组 |
| close | 关闭弹窗功能回调 |       -       |

### Slot

|  插槽  | 说明             |
| :----: | :--------------- |
| custom | 自定义内容区插槽 |
