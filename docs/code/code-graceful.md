---
nav: 代码规范
group:
  title: 进阶
  order: 2
order: 2
---

# 风格规范

```

// vue文件按<script>、<template>、<style>顺序编写，原因：<script>放最前面可以方便chrome debug
<script>

// import 采用 第三方依赖、@别名、相对路径的顺序依次声明，并在中间用空行隔开
import moment from 'moment';

import {
  getWarningConfigByEsId,
  editWarningConfig
} from '@/api/screen/videoWarming'

import GantryCraneWarningTable from './GantryCraneWarningTable'
import WireRopeWarningTable from './WireRopeWarningTable'
import SenderSettingDialog from './SenderSettingDialog'

// 涉及到的常量定义放这里，顺序采用基本类型到复杂类型，原因：方便字典常量管理，如遇后端数据变更，只需改动常量定义即可
// 代码中尽量避免直接赋予string或int类型，boolean可以直接赋值
// 如果常量过多，应新建constant文件来管理并import
const WARNING_TYPE = ['Ai', 'GantryCrane', 'WireRope']

export default {
  // 名称和文件名一致
  name: 'WarningDialog',
  // 组件名称命名采用PascalCase，并且在<template>也采用PascalCase，而非kebab-case
  components: {
    GantryCraneWarningTable,
    WireRopeWarningTable,
    SenderSettingDialog
  },
  // props命名采用camelCase，简单，易懂，优雅，在父组件使用采用kebab-case
  // props定义采用详细定义，禁止使用简单的数组声明，详细示例见：https://cn.vuejs.org/guide/components/props.html#prop-validation
  props: {
    subjectId: {
      type: String,
      default: ''
    },
    equipmentId: {
      type: String,
      default: ''
    },
    tableType: {
      validator(value) {
        return WARNING_TYPE.includes(value)
      },
      default: WARNING_TYPE[0]
    }
  },
  // states命名采用camelCase，简单，易懂，优雅
  // states命名不能跟props重名，states与props的参数定义需要考虑组件的受控与非受控设计
  data() {
    return {
      warnSwitch: false,
      senderSettingDialogVisible: false
    }
  },
  computed: {
    bizType() {
      return String(WARNING_TYPE.findIndex((v) => v === this.tableType) + 1)
    }
  },
  watch: {
    subjectId() {
      if (this.subjectId !== '') {
        this.getWarningConfigApi()
      }
    }
  },
  methods: {
    // 调用后端服务最好在名称后面加上Api，原因：方便区分组件方法与接口方法
    // 如果是api方法，方法体里只做对入参和出参相关操作，如有其他逻辑，另起方法调用
    switchSendMsgApi(isAutoSend) {
      const msg = {
        esId: this.subjectId,
        isAutoSend: isAutoSend ? '1' : '0',
        bizType: this.bizType
      }
      editWarningConfig(msg)
        .then(() => {
          this.warnSwitch = isAutoSend
        })
        .catch(() => {
          this.warnSwitch = !isAutoSend
        })
    },
    getWarningConfigApi() {
      getWarningConfigByEsId({
        esId: this.subjectId,
        bizType: this.bizType
      }).then((res) => {
        if (res.data) {
          // 对于出参的相关属性操作，采用对出参解构的方式来赋值
          const { isAutoSend } = res.data
          if (isAutoSend === '1') {
            this.warnSwitch = true
          } else {
            this.warnSwitch = false
          }
        }
      })
    }
  }
}
</script>

<template>
  <div class="dialog-box">
    <div class="head">
      <div class="close-button" @click="close" />
    </div>
    <div class="body">
      <div class="search-box">
        <slot name="search">
          <div class="default-search">
            <el-col :span="6" :offset="18">
              <!-- 这里是开关按钮 -->
              <span>自动推送开关</span>
              <el-switch
                v-model="warnSwitch"
                title="激活后可自动向设置的人员对象发送预警短信"
                active-color="#1890ff"
                inactive-color="#C0CCDA"
                style="margin-right: 10px;margin-left:10px"
                @change="switchChange"
              />
              <el-button
                :disabled="!warnSwitch"
                type="primary"
                round
                size="medium"
                @click="senderSettingDialogVisible = true"
              >设置</el-button>
            </el-col>
          </div>
        </slot>
      </div>
      <div class="list-box">
        <GantryCraneWarningTable
          v-if="tableType === 'GantryCrane'"
          :subject-id="subjectId"
          :equipment-id="equipmentId"
        />
        <WireRopeWarningTable
          v-else-if="tableType === 'WireRope'"
          :subject-id="subjectId"
          :equipment-id="equipmentId"
        />
      </div>
    </div>
    <SenderSettingDialog
      v-show="senderSettingDialogVisible"
      :subject-id="subjectId"
      :biz-type="bizType"
      @close="closeSenderSettingDialog"
    />
  </div>
</template>

<style lang="scss" scoped>
// CSS命名全部采用kebab-case
.dialog-box {
  ...
}
</style>

```
