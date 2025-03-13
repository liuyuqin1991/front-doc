---
nav:
  title: 规范
  order: 1
group:
  title: 代码层
  order: 2
order: 4
---

# 开发规范

## 工具类使用

- 数组、集合、函数、数学、数字、对象、字符串、使用函数等轮子方法统一使用 <b>[lodash](https://www.lodashjs.com/)</b> 工具库方法
- 日期、时间等轮子方法统一使用 <b>[moment](https://moment.nodejs.cn/docs/)</b> 或 <b>[dayjs](https://dayjs.fenxianglu.cn/)</b> 工具库方法
- 特殊工具类方法需评估是否通用，根据其通用性评估在VRM版 utils/index 文件中添加，或直接在业务模块内添加