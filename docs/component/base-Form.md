---
nav:
  title: 组件
  order: 2
group:
  title: 基础组件
  order: 1
title: VForm
order: 1
---

# VForm

基于 element ui 的 Form 定制新增/修改/查看模版组件

## 属性

### Attributes

|    参数     | 说明                                          |  类型   | 是否必须 | 默认值 |
| :---------: | :-------------------------------------------- | :-----: | :------: | :----: |
|    config     | Form 配置，对象数组，详细见下方的 data 配置项 |  Array  |   必选   |   []   |
|   columns   | 列数，仅可选 1,2,3,4,6,8,12,24 列               | Number  |   可选   |   4    |
| label-width  | label 宽度                                    | Number  |   可选   |  100   |
| action | 表单行为，'add'-新增，'edit'-修改，'view'-查看              | String |   可选   |  'add'  |
| object | 表单对象，action='edit'或'view'时传入的回显表单数据对象      | Object |   可选   |  {}  |


### Event

| 事件  | 说明     |        回调参数        |
| :---: | :------- | :--------------------: |

### Data Attributes

|    参数     | 说明                        |      类型      |          是否必须          |
| :---------: | :-------------------------- | :------------: | :------------------------: |
|    type     | 表单form-item类型                |     String     |             是             |
|    label     | 表单label                |     String     |             是             |
|    name     | 插槽名称，特殊form-item场景定制时使用         |     String     |            否，但 type 为 custom 必须             |
|     key     | 键值                |     String     |             是             |
| placeholder | 占位显示文案                |     String     |             否             |
|    data     | 数据集                       | [Array,Object] | 否，但 type 为 select 必须 | 
|    span     | 占据列数，小于columns列数        |     Number     |             否             |
|    format     | 显示格式化                    |     String     |             否             |
|    valueFormat     | 输出格式化                    |     String     |             否             |

注：

1. type
   列类型，可选值：input（输入框）、password(密码)、select（下拉框）、data（日）、week（周）、month（月）、year（年）、datetime（日期时间）、daterange（日期范围）、datetimerange（日期时间范围）、custom（自定义）

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

### 示例


```
<!-- 增改查 dialog -->
<VForm ref="form" :config="formConfig" :action="action" :object="selectObj">
  <template #nickName="slotProps">
    <el-input v-model="slotProps.form.nickName" placeholder="请输入用户昵称" maxlength="30" style="width: 100%" />
  </template>
</VForm>

computed: {
  formConfig() {
    return [
      {
        title: '基本信息',
        children: [
          {
            type: 'input',
            label: '用户名称',
            key: 'userName',
            placeholder: '请输入用户名称',
            rule: [
              { required: true, message: '用户名称不能为空', trigger: 'blur' }
            ]
          },
          {
            type: 'custom',
            name: 'nickName',
            label: '用户昵称'
          }
        ]
      },
      {
        title: '详细信息',
        children: [
          {
            type: 'password',
            label: '用户密码',
            key: 'password'
          },
          {
            type: 'select',
            label: '用户状态',
            key: 'status',
            placeholder: '请选择用户状态',
            data: this.dict.type.sys_normal_disable,
            width: '70%'
          }
        ]
      }
    ]
  }
}
```
