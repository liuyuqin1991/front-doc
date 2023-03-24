---
nav: 代码规范
group:
  title: 基础
  order: 2
order: 2
---

# 命名规范

基本命名准则：
1. 贴合业务
2. 简洁、语义化，能够英文释义
3. 始终保持一种命名方法。项目中可能多人协同开发，而命名方式有多种都是可行的，进行开发时应保持原来代码命名风格

命名方式：
* PascalCase：帕斯卡命名方式，又称大驼峰命名方式(UpperCamelCase)，每个单词首字母大写。
* camelCase：驼峰命名方式，又称小驼峰命名方式(lowerCamelCase)，第一个单词首字母小写，后面的每个单词首字母大写。
* kebab-case或KEBAB-CASE：串式命名方式，又称破折号方式(dash-case)，每个单词全小写或全大写，多单词使用中划线隔开。
* snake_case或SNAKE_CASE：蛇形命名方式，每个单词全小写或全大写，多单词使用下划线隔开。

通用规则：
* 缩写只能是英文单词缩写，禁止中文拼音缩写，尽量不要使用缩写，会造成单词拼写插件误报
* 禁止随意使用缩写
* 禁止单个字母或毫不相干的英文单词
* 禁止直接中文命名
* 禁止命名有空格
* 禁止复数写法

## 文件级规范

### 1. 文件夹/目录/资源文件

> kebab-case

### 2. 业务vue文件夹或文件

> kebab-case 

### 3. 组件vue文件夹或文件

> PascalCase

## 代码级规范

### 1. 常量


```
// SNAKE_CASE

const SNAKE_CASE = 1
const SNAKE_CASE_EXAMPLE = "example"
```

### 2. 变量/属性/方法名
```
// camelCase

let defaultParams = {};

let specialDate = {
  startDate: 'xxx',
  endDate: 'xxx',
}

function getData() {}

```

### 3. vue组件

```
// 在Dom模版，单文件组件，字符串模板中都采用 PascalCase
<MyComponent/>
```

## 约定建议

### 1. 可见性状态（组件显示场景）

```
约定： is+动词（现在进行时）/形容词，类型必须是boolean

isShow：是否显示
isVisible：是否可见
isLoading：是否处于加载中
isConnecting：是否处于连接中
isValidating：正在验证中
isRunning：正在运行中
isListening：正在监听中
```

### 2. 属性状态（实体属性）

```
约定： 形容词，类型必须是Boolean

disabled：是否禁用
editable：是否可编辑
clearable：是否可清除
readonly：只读
expandable：是否可展开
checked：是否选中
enumerable：是否可枚举
iterable：是否可迭代
clickable：是否可点击
draggable：是否可拖拽
```

### 3. 配置项（功能开启）

```
约定： allow、with、enable、no等动词为前缀的camelCase，类型必须是Boolean

//是否带选项卡
withTab
//不带选项卡
withoutTab
//开启过滤
enableFilter
//允许自定义缩放
allowCustomScale
//是否清除
shouldClear
//是否能选中元素
canSelectItem
//不显示label后面的冒号
noColon
//检查Js
checkJs
```

### 4. 事件处理

```
约定： 1. 原生事件 on为前缀的camelCase; 2. 自定义事件 handle为前缀的camelCase，类型必须是Function

//提交表单
onSubmit
//处理分页页数改变
handleSizeChange
//处理分页每页大小改变
handlePageChange
//按下键
onKeydown
```

### 5. 功能函数

```
约定： 以下列动词为前缀的camelCase

get 获取/set 设置,
add 增加/remove 删除
create 创建/destroy 移除
start 启动/stop 停止
open 打开/close 关闭,
read 读取/write 写入
load 载入/save 保存,
create 创建/destroy 销毁
begin 开始/end 结束,
backup 备份/restore 恢复
import 导入/export 导出,
split 分割/merge 合并
inject 注入/extract 提取,
attach 附着/detach 脱离
bind 绑定/separate 分离,
view 查看/browse 浏览
edit 编辑/modify 修改,
select 选取/mark 标记
copy 复制/paste 粘贴,
undo 撤销/redo 重做
insert 插入/delete 移除,
add 加入/append 添加
clean 清理/clear 清除,
index 索引/sort 排序
find 查找/search 搜索,
increase 增加/decrease 减少
play 播放/pause 暂停,
launch 启动/run 运行
compile 编译/execute 执行,
debug 调试/trace 跟踪
observe 观察/listen 监听,
build 构建/publish 发布
input 输入/output 输出,
encode 编码/decode 解码
encrypt 加密/decrypt 解密,
compress 压缩/decompress 解压缩
pack 打包/unpack 解包,
parse 解析/emit 生成
connect 连接/disconnect 断开,
send 发送/receive 接收
download 下载/upload 上传,
refresh 刷新/synchronize 同步
update 更新/revert 复原,
lock 锁定/unlock 解锁
check out 签出/check in 签入,
submit 提交/commit 交付
push 推/pull 拉,
expand 展开/collapse 折叠
begin 起始/end 结束,
start 开始/finish 完成
enter 进入/exit 退出,
abort 放弃/quit 离开
obsolete 废弃/depreciate 废旧,
collect 收集/aggregate 聚集
```

### 6. 路由跳转

```
约定：to、go为前缀的camelCase

//跳转到模版详情页面
toTplDetail
//导航到首页
navigateToHome
//跳转首页
jumpHome
//跳转首页
goHome
//重定向到登录页
redirectToLogin
//切换Tab选项卡
switchTab
//回到主页
backHome
```

### 7. 数据处理

```
约定： 1. 获取数据用get或者query为前缀的camelCase 2. 格式化数据有format、convert、、inverse、parse、sort等为前缀的camelCase

//根据ID获取数据元素
getItemById
//根据传入的已选列表ID来获取列表全部数据
getItemsBySelected
//根据UID查询用户
queryUserByUid
//格式化日期
formatDate
//转换货币单位
convertCurrency
//反转数据列表
inverseList
//切换所有已选择数据状态
toggleAllSelected
//解析XML数据
parseXml
//展开选择数据
flatSelect
//按降序排序
sortByDesc
```


 





