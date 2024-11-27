---
nav:
  title: 组件
  order: 2
group:
  title: 基础组件
  order: 1
title: VBimface
order: 98
---

# VBimface

基于 bimface  的 模型 预览组件

## 属性

### Attributes

|     参数      | 说明           |  类型   | 是否必须 | 默认值 |
| :-----------: | :------------- | :-----: | :------: | :----: |
| treeAvailable | 构件树是否可用 | Boolean |  否  |  true  |
| bimToken | 模型token | String |  是  |  无  |
| bimTreeData | 模型树Data | Array |  否  |  无  |
| selectEleList | 选中的构件id集合 | Array |  否  |  无  |
| hideEleList | 隐藏的构件id集合 | Array |  否  |  无  |
| setColorObj | 改变构件颜色对象 {eleList:['525026'],color:'#000000'} | Object |  否  |  无  |

### Methods

示例:

this.$refs.bim.resetAllElementSelect()

|         函数         | 说明             |    参数     |               参数说明                |
| :------------------: | :--------------- | :---------: | :-----------------------------------: |
|    resetAllElementSelect     | 恢复所有构件选中状态         |    无      |                        |
| resetAllElementColor | 恢复所有构件颜色 |     无      |                                       |

### Event

|       事件       | 说明                                |         回调参数         |
| :--------------: | :---------------------------------- | :----------------------: |
|     gerCurrentBimNode      | 点击bim组件树节点回调                            |       树节点对象                 |


