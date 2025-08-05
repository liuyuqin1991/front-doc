<template>
  <el-form
    v-show="isShow"
    ref="queryForm"
    :class="{'px-12 py-16': true, 'b-n': isShowBorder, 'mb-8': isShow}"
    :model="queryParams"
    :inline="true"
    size="medium"
    :label-width="`${labelWidth}px`"
    label-position="right"
    @submit.native.prevent
  >
    <el-row v-for="row in rows" :key="`row-${row}`">
      <el-col v-for="(item, i) in filterRowData(row)" :key="`col-${row}-${i}`" :span="setSpan(item)">
        <el-form-item :label="t(item.label)" class="form-item">
          <slot v-if="item.type === 'custom'" :name="item.name" :form="queryParams" style="width: 100%" />
          <el-input v-if="item.type === 'input'" v-model="queryParams[item.key]" :placeholder="t(item.placeholder)" type="input" clearable style="width: 100%" />
          <el-select
            v-if="item.type === 'select'"
            v-model="queryParams[item.key]"
            :placeholder="t(item.placeholder)"
            style="width: 100%"
            clearable
            :filterable="setSelectFilterable(item.filterable)"
          >
            <template v-if="tagDataType(item.data) === 'array'">
              <el-option v-for="dict in item.data" :key="dict.value" :label="t(dict.label)" :value="dict.value" />
            </template>
            <template v-if="tagDataType(item.data) === 'object'">
              <el-option
                v-for="dict in item.data.data"
                :key="dict[item.data.value || 'value']"
                :label="dict[item.data.label || 'label']"
                :value="dict[item.data.value || 'value']"
              />
            </template>
          </el-select>
          <el-date-picker
            v-if="item.type === 'date' || item.type ==='week' || item.type ==='month' || item.type ==='year' || item.type ==='datetime'"
            v-model="queryParams[item.key]"
            :type="item.type"
            style="width: 100%"
            clearable
            :placeholder="t(item.placeholder)"
            :format="item.format || setDatePickerFormatDefault(item.type)"
            :value-format="item.valueFormat || setDatePickerFormatDefault(item.type)"
          />
          <el-date-picker
            v-if="item.type === 'daterange' || item.type === 'datetimerange'"
            v-model="queryParams[item.key]"
            :type="item.type"
            style="width: 100%"
            clearable
            unlink-panels
            :range-separator="t('至')"
            :start-placeholder="item.type === 'daterange'?t('开始日期'):t('开始时间')"
            :end-placeholder="item.type === 'daterange'?t('结束日期'):t('结束时间')"
            :format="item.format || setDatePickerFormatDefault(item.type)"
            :value-format="item.valueFormat || setDatePickerFormatDefault(item.type)"
          />
          <el-time-picker
            v-else-if="item.type === 'time'"
            v-model="form[item.key]"
            :type="item.type"
            :style="`width: ${item.width || '100%'}`"
            clearable
            :placeholder="action !== 'view' ? item.placeholder : ''"
            :disabled="item.disabled"
            :format="item.format || setDatePickerFormatDefault(item.type)"
            :value-format="item.valueFormat || setDatePickerFormatDefault(item.type)"
          />
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
        </el-form-item>
      </el-col>
    </el-row>
    <div class="btn-action-box">
      <el-button type="primary" plain icon="el-icon-search" size="small" @click="query">{{ t('搜索') }}</el-button>
      <el-button icon="el-icon-refresh" class="ml-12" size="small" @click="reset">{{ t('重置') }}</el-button>
    </div>
  </el-form>
</template>

<script>
/**
 * v3.4 查询栏组件
 */
export default {
  name: 'VQueryForm',
  props: {
    // query对象数组
    config: {
      type: Array,
      default() {
        return []
      }
    },
    // 列数，仅限于1,2,3,4,6,8,12,24列，默认为4列
    columns: {
      type: Number,
      default: 4,
      validator(v) {
        return [1, 2, 3, 4, 6, 8, 12, 24].includes(v)
      }
    },
    labelWidth: {
      type: Number,
      default: 100
    },
    // 收否展开
    defaultShow: {
      type: Boolean,
      default: true
    },
    // 是否显示查询栏边框
    isShowBorder: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      queryParams: {},
      isShow: this.defaultShow
    }
  },
  computed: {
    // 总行数
    rows() {
      return _.ceil(this.config.length / this.columns)
    }
  },
  created() {
    // 注册toggleSearch事件,从而获取Table兄弟组件触发的事件响应
    this.$EventBus.$on('toggleSearch', (v) => {
      this.isShow = v
    })
  },
  mounted() {},
  methods: {
    // 设置下拉框搜索配置
    setSelectFilterable(filterable) {
      if (_.isUndefined(filterable)) return true
      return filterable
    },
    // 只筛选出当前行的data数据
    filterRowData(row) {
      return _.filter(this.config, (_, i) => {
        const start = (row - 1) * this.columns
        return i >= start && i < start + this.columns
      })
    },
    // 设置搜索块的span占比
    setSpan(item) {
      if (item.span && item.span > 0 && item.span <= this.columns) {
        return (item.span * 24) / this.columns
      } else return 24 / this.columns
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
    query() {
      this.$emit('query', this.queryParams)
    },
    reset() {
      _.forEach(_.keys(this.queryParams), (k) => {
        this.$set(this.queryParams, k, '')
      })
      this.$emit('query', this.queryParams, true)
    },
    tagDataType(tagData) {
      if (tagData) {
        if (_.isArray(tagData)) {
          return 'array'
        } else if (_.isObject(tagData)) {
          return 'object'
        }
      }
      return undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-action-box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  position: relative;
  color: #aaa;

  &.hide {
    height: 6px;
  }

  .btn-visible {
    position: absolute;
    right: 0;
    font-size: 20px;
    cursor: pointer;
  }
}

.form-item {
  display: flex;
  margin-bottom: 12px;

  ::v-deep .el-form-item__content {
    flex: 1;
  }
}
</style>
