<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    :inline="true"
    size="medium"
    :label-width="`${labelWidth}px`"
    label-position="right"
    :disabled="action === 'view'"
    :validate-on-rule-change="false"
    @submit.native.prevent
  >
    <div v-for="(c,i) in config" :key="`form-group-${i}`" class="b-form-group">
      <el-divider content-position="left">{{ t(c.title) }}</el-divider>
      <div class="p-20">
        <slot v-if="c.type === 'custom'" :name="c.name" :form="form" />
        <el-row v-else-if="c.type === 'form'">
          <el-col v-for="(item, j) in c.children" :key="`form-item-${j}`" :span="setSpan(item)">
            <el-form-item v-if="!setIgnore(item.ignore)" :label="t(item.label)" :prop="item.key" class="b-form-item">
              <span v-if="item.tooltip" slot="label">
                <el-tooltip :content="t(item.tooltip)">
                  <i class="el-icon-question" />
                </el-tooltip>
                <span class="ml-4">{{ t(item.label) }}</span>
              </span>
              <slot v-if="item.type === 'custom'" :name="item.name" :form="form" />
              <!-- 输入框 -->
              <el-input
                v-else-if="item.type === 'input'"
                v-model="form[item.key]"
                :placeholder="action !== 'view' ? t(item.placeholder) : ''"
                :style="`width: ${item.width || '100%'}`"
                :disabled="item.disabled"
                type="input"
                clearable
              >
                <template v-if="item.prepend" slot="prepend">{{ t(item.prepend) }}</template>
                <template v-if="item.append" slot="append">{{ t(item.append) }}</template>
              </el-input>
              <!-- 数字输入框 -->
              <el-input-number
                v-else-if="item.type === 'input-number'"
                v-model="form[item.key]"
                controls-position="right"
                :placeholder="action !== 'view' ? t(item.placeholder) : ''"
                :style="`width: ${item.width || '100%'}`"
                :min="item.min"
                :max="item.max"
                :disabled="item.disabled"
              />
              <!-- 密码输入框 -->
              <el-input
                v-else-if="item.type === 'password'"
                v-model="form[item.key]"
                :placeholder="action !== 'view' ? t(item.placeholder) : ''"
                :style="`width: ${item.width || '100%'};`"
                autocomplete="new-password"
                type="password"
                :disabled="item.disabled"
                clearable
              />
              <!-- 文本域输入框 -->
              <el-input
                v-else-if="item.type === 'textarea'"
                v-model="form[item.key]"
                :placeholder="action !== 'view' ? t(item.placeholder) : ''"
                :style="`width: ${item.width || '100%'};`"
                type="textarea"
                :rows="item.rows ? item.rows : 2"
                :disabled="item.disabled"
                clearable
              />
              <!-- 下拉框 -->
              <el-select
                v-else-if="item.type === 'select'"
                v-model="form[item.key]"
                :placeholder="action !== 'view' ? t(item.placeholder) : ''"
                :style="`width: ${item.width || '100%'}`"
                :disabled="item.disabled"
                :multiple="item.multiple"
                :filterable="setSelectFilterable(item.filterable)"
                clearable
              >
                <template v-if="getDataType(item.data) === 'array'">
                  <el-option v-for="dict in item.data" :key="`${item.label}-${dict.value}`" :label="dict.label" :value="dict.value" />
                </template>
                <template v-if="getDataType(item.data) === 'object'">
                  <el-option
                    v-for="dict in item.data.data"
                    :key="`${dict[item.data.label || 'label']}-${dict[item.data.value || 'value']}`"
                    :label="dict[item.data.label || 'label']"
                    :value="dict[item.data.value || 'value']"
                  />
                </template>
              </el-select>
              <!-- 单选框 -->
              <el-radio-group v-else-if="item.type === 'radio'" v-model="form[item.key]" :style="`width: ${item.width || '100%'}`" :disabled="item.disabled">
                <template v-if="getDataType(item.data) === 'array'">
                  <el-radio v-for="dict in item.data" :key="`${dict.label}-${dict.value}`" :label="dict.value">{{ dict.label }}</el-radio>
                </template>
                <template v-if="getDataType(item.data) === 'object'">
                  <el-radio
                    v-for="dict in item.data.data"
                    :key="`${dict[item.data.label || 'label']}-${dict[item.data.value || 'value']}`"
                    :label="dict[item.data.value || 'value']"
                  >{{ dict[item.data.label || 'label'] }}</el-radio>
                </template>
              </el-radio-group>
              <!-- 单选按钮框 -->
              <el-radio-group
                v-else-if="item.type === 'radio-button'"
                v-model="form[item.key]"
                :style="`width: ${item.width || '100%'}`"
                :disabled="item.disabled"
              >
                <template v-if="getDataType(item.data) === 'array'">
                  <el-radio-button v-for="dict in item.data" :key="`${dict.label}-${dict.value}`" :label="dict.value">{{ dict.label }}</el-radio-button>
                </template>
                <template v-if="getDataType(item.data) === 'object'">
                  <el-radio-button
                    v-for="dict in item.data.data"
                    :key="`${dict[item.data.label || 'label']}-${dict[item.data.value || 'value']}`"
                    :label="dict[item.data.value || 'value']"
                  >{{ dict[item.data.label || 'label'] }}</el-radio-button>
                </template>
              </el-radio-group>
              <!-- 复选框 -->
              <el-checkbox-group
                v-else-if="item.type === 'checkbox'"
                v-model="form[item.key]"
                :style="`width: ${item.width || '100%'}`"
                :disabled="item.disabled"
              >
                <template v-if="getDataType(item.data) === 'array'">
                  <el-checkbox v-for="dict in item.data" :key="`${dict.label}-${dict.value}`" :label="dict.value">{{ dict.label }}</el-checkbox>
                </template>
                <template v-if="getDataType(item.data) === 'object'">
                  <el-checkbox
                    v-for="dict in item.data.data"
                    :key="`${dict[item.data.label || 'label']}-${dict[item.data.value || 'value']}`"
                    :label="dict[item.data.value || 'value']"
                  >{{ dict[item.data.label || 'label'] }}</el-checkbox>
                </template>
              </el-checkbox-group>
              <!-- 复选按钮框 -->
              <el-checkbox-group
                v-else-if="item.type === 'checkbox-button'"
                v-model="form[item.key]"
                :style="`width: ${item.width || '100%'}`"
                :disabled="item.disabled"
              >
                <template v-if="getDataType(item.data) === 'array'">
                  <el-checkbox-button v-for="dict in item.data" :key="`${dict.label}-${dict.value}`" :label="dict.value">{{ dict.label }}</el-checkbox-button>
                </template>
                <template v-if="getDataType(item.data) === 'object'">
                  <el-checkbox-button
                    v-for="dict in item.data.data"
                    :key="`${dict[item.data.label || 'label']}-${dict[item.data.value || 'value']}`"
                    :label="dict[item.data.value || 'value']"
                  >{{ dict[item.data.label || 'label'] }}</el-checkbox-button>
                </template>
              </el-checkbox-group>
              <!-- 日期选择框 -->
              <el-date-picker
                v-else-if="item.type === 'date' || item.type ==='week' || item.type ==='month' || item.type ==='year' || item.type ==='datetime'"
                v-model="form[item.key]"
                :type="item.type"
                :style="`width: ${item.width || '100%'}`"
                clearable
                :placeholder="action !== 'view' ? t(item.placeholder) : ''"
                :disabled="item.disabled"
                :format="item.format || setDatePickerFormatDefault(item.type)"
                :value-format="item.valueFormat || setDatePickerFormatDefault(item.type)"
              />
              <!-- 日期范围选择框 -->
              <el-date-picker
                v-else-if="item.type === 'daterange' || item.type === 'datetimerange'"
                v-model="form[item.key]"
                :type="item.type"
                :style="`width: ${item.width || '100%'}`"
                clearable
                unlink-panels
                :range-separator="t('至')"
                :start-placeholder="action !== 'view' ? t('开始日期'): ''"
                :end-placeholder="action !== 'view' ? t('结束日期') : ''"
                :disabled="item.disabled"
                :format="item.format || setDatePickerFormatDefault(item.type)"
                :value-format="item.valueFormat || setDatePickerFormatDefault(item.type)"
              />
              <!-- 时间选择框 -->
              <el-time-picker
                v-else-if="item.type === 'time'"
                v-model="form[item.key]"
                :type="item.type"
                :style="`width: ${item.width || '100%'}`"
                clearable
                :placeholder="action !== 'view' ? t(item.placeholder) : ''"
                :disabled="item.disabled"
                :format="item.format || setDatePickerFormatDefault(item.type)"
                :value-format="item.valueFormat || setDatePickerFormatDefault(item.type)"
              />
              <!-- 时间范围选择框 -->
              <el-time-picker
                v-else-if="item.type === 'timerange'"
                v-model="form[item.key]"
                is-range
                :type="item.type"
                :style="`width: ${item.width || '100%'}`"
                clearable
                :range-separator="t('至')"
                :start-placeholder="action !== 'view' ? t('开始时间'): ''"
                :end-placeholder="action !== 'view' ? t('结束时间') : ''"
                :disabled="item.disabled"
                :format="item.format || setDatePickerFormatDefault(item.type)"
                :value-format="item.valueFormat || setDatePickerFormatDefault(item.type)"
              />
              <!-- 文件上传组件框 -->
              <VFileUpload
                v-else-if="item.type === 'fileUpload'"
                v-model="form[item.key]"
                :tip="item.tip"
                :limit="item.limit"
                :file-size="item.fileSize"
                :file-type="item.fileType"
                :disabled="item.disabled || action === 'view'"
                @success="(fileStr) => fileUploadSuccess(fileStr, item.key)"
                @remove="(fileStr) => fileUploadRemove(fileStr, item.key)"
              />
              <!-- 图片上传组件框 -->
              <VImageUpload
                v-else-if="item.type === 'imageUpload'"
                v-model="form[item.key]"
                :tip="item.tip"
                :limit="item.limit"
                :file-size="item.fileSize"
                :file-type="item.fileType"
                :disabled="item.disabled || action === 'view'"
              />
              <!-- 下拉树组件框 -->
              <Treeselect
                v-else-if="item.type === 'select-tree'"
                v-model="form[item.key]"
                :options="convertTreeSelectData(item.data)"
                :disabled="action ==='view'"
                :multiple="item.multiple"
                :normalizer="(node) => convertTreeSelectNormalizer(item.data, node)"
                show-count
                :placeholder="action !== 'view' ? item.placeholder : ''"
              />
              <el-color-picker v-else-if="item.type === 'color'" v-model="form[item.key]" :predefine="item.predefine" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-form>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

/**
 * v11.2 表单组件
 */
export default {
  name: 'VForm',
  components: {
    Treeselect
  },
  props: {
    config: {
      type: Array,
      default() {
        return []
      }
    },
    columns: {
      type: Number,
      default: 2,
      validator(v) {
        return [1, 2, 3, 4, 6, 8, 12, 24].includes(v)
      }
    },
    labelWidth: {
      type: Number,
      default: 100
    },
    action: {
      type: String,
      default: 'add'
    },
    object: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form: {}
    }
  },
  computed: {
    rules() {
      const resultRules = {}
      _.forEach(this.config, (c) => {
        if (c.children) {
          _.forEach(c.children, (cc) => {
            if (cc.rule) {
              _.forEach(cc.rule, (r) => {
                r.message = this.t(r.message)
              })
              resultRules[cc.key] = cc.rule
            }
          })
        }
      })
      return resultRules
    }
  },
  watch: {
    object: {
      handler() {
        this.loadData()
      },
      immediate: true
    }
  },
  created() {
    // checkbox和checkbox-button为特殊情况，需先给v-model赋值[]
    _.forEach(this.config, (c) => {
      if (c.type === 'form') {
        _.forEach(c.children, (child) => {
          if (child.type === 'checkbox' || child.type === 'checkbox-button') {
            this.form[child.key] = []
          }
        })
      }
    })
  },
  mounted() {},
  methods: {
    // 编辑/查看时加载数据
    loadData() {
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.resetFields()
          this.form = {
            ...this.form,
            ...this.object
          }
        }
      })
    },
    setIgnore(ignore) {
      if (_.isBoolean(ignore)) {
        return ignore
      } else if (_.isFunction(ignore)) {
        return ignore(this.form)
      }
      return false
    },
    // 设置搜索块的span占比
    setSpan(item) {
      if (item.span && item.span > 0 && item.span <= this.columns) {
        return (item.span * 24) / this.columns
      } else return 24 / this.columns
    },
    // 设置下拉框搜索配置
    setSelectFilterable(filterable) {
      if (_.isUndefined(filterable)) return true
      return filterable
    },
    // 设置datepicker的默认格式
    setDatePickerFormatDefault(type) {
      const MAP = {
        date: 'yyyy-MM-dd',
        week: 'yyyy[w]WW',
        month: 'yyyy-MM',
        year: 'yyyy',
        datetime: 'yyyy-MM-dd HH:mm:ss',
        daterange: 'yyyy-MM-dd',
        datetimerange: 'yyyy-MM-dd HH:mm:ss',
        time: 'HH:mm:ss',
        timerange: 'HH:mm:ss'
      }
      return MAP[type]
    },
    getDataType(dataType) {
      if (dataType) {
        if (_.isArray(dataType)) {
          return 'array'
        } else if (_.isObject(dataType)) {
          return 'object'
        }
      }
      return undefined
    },
    // 文件上传成功回调
    fileUploadSuccess(fileStr, key) {
      this.$refs.form.validateField(key)
    },
    // 文件删除回调
    fileUploadRemove(fileStr, key) {
      this.$refs.form.validateField(key)
    },
    // 转换下拉树数据
    convertTreeSelectData(data) {
      if (this.getDataType(data) === 'array') return data
      return data.data
    },
    // 转换下拉树数据映射
    convertTreeSelectNormalizer(data, node) {
      if (this.getDataType(data) === 'array') {
        return {
          id: node.id,
          label: node.label,
          children: node.children
        }
      }
      return {
        id: node[data.value],
        label: node[data.label],
        children: node.children
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.b-form-group {
  border: 1px solid #dcdfe6;
  border-top: 0;
  margin-bottom: 20px;
  .el-divider--horizontal {
    margin: 8px 0;
  }

  .el-divider__text {
    font-weight: 700;
  }
}

::v-deep .el-input--medium .el-input__inner {
  vertical-align: top;
}

::v-deep .el-input-number--medium {
  line-height: 36px;
}
</style>
