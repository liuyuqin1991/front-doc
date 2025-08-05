<template>
  <div ref="tableContainer" v-resize="onResize" :class="{'b-n': showTopAction, 'p-8': showTopAction, 'f-c':true, 'f-1': true}">
    <div v-if="showTopAction" class="f-r -sb mb-8">
      <div class="f-r">
        <slot name="top-action" />
      </div>
      <div>
        <el-tooltip class="item" effect="dark" :content="showSearch ? t('隐藏搜索') : t('显示搜索')" placement="top">
          <el-button size="mini" circle icon="el-icon-search" @click="toggleSearch" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="t('刷新')" placement="top">
          <el-button size="mini" circle icon="el-icon-refresh" @click="refresh" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="t('列过滤')" placement="top">
          <el-dropdown trigger="click" :hide-on-click="false">
            <span class="el-dropdown-link ml-8">
              <el-button size="mini" circle icon="el-icon-setting" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, i) in tableConfig" :key="item.key">
                <el-checkbox v-if="!item.disabled" :checked="!item.isHidden" :label="t(item.label)" @change="filterChange(i)" />
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
      </div>
    </div>
    <el-table
      ref="table"
      v-loading="loading"
      :stripe="true"
      size="mini"
      style="width: 100%"
      :height="tableHeight"
      :max-height="tableMaxHeight"
      :data="data"
      :border="true"
      :default-expand-all="defaultExpandAll"
      highlight-current-row
      :row-key="rowKey"
      :cell-style="cellStyle"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :span-method="spanMethod"
      :row-class-name="rowClassName"
      :cell-class-name="cellClassName"
      @header-dragend="drag"
      @selection-change="selectionChange"
      @select="select"
      @select-all="selectAll"
      @sort-change="sort"
      @row-click="rowClick"
      @row-dblclick="rowDblclick"
    >
      <template v-if="selectableType === 'boolean'">
        <el-table-column type="selection" width="40" />
      </template>
      <template v-if="selectableType === 'function'">
        <el-table-column :selectable="selectable" type="selection" width="40" />
      </template>
      <el-table-column v-if="serializable" type="index" :label="t('序号')" width="50" align="center" />
      <template v-for="(c,i) in tableConfig">
        <el-table-column
          v-if="c.type === 'text' && !c.isHidden"
          :key="`column-${i}`"
          :label="t(c.label) || ''"
          :align="c.align || 'left'"
          :prop="c.key"
          :width="c.width"
          :sortable="c.sortable ? 'custom' : undefined"
          :show-overflow-tooltip="c.showOverflowTooltip || false"
        >
          <template slot-scope="scope">
            <span :class="{'click-text': c.click}" v-on="setCommonEvent(scope,c)">{{ textFormatter(scope.row[c.key], c) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="isDateTimeType(c.type) && !c.isHidden"
          :key="`column-${i}`"
          :label="t(c.label) || ''"
          :align="c.align || 'left'"
          :prop="c.key"
          :width="c.width"
          :sortable="c.sortable ? 'custom' : undefined"
          :formatter="(_, __, cellValue) => dateTimeFormatter(cellValue, c)"
        />
        <el-table-column
          v-else-if="c.type === 'tag' && !c.isHidden"
          :key="`column-${i}`"
          :label="t(c.label) || ''"
          :align="c.align || 'left'"
          :prop="c.key"
          :width="c.width"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="getTagType(scope,c) === 'custom'"
              :class="{'cur-p': c.click}"
              :style="tagColorFormatter(scope, c, true)"
              v-on="setCommonEvent(scope,c)"
            >{{ tagLabelFormatter(scope, c) }}</el-tag>
            <el-tag
              v-if="getTagType(scope,c) === 'normal'"
              :class="{'cur-p': c.click}"
              :type="tagColorFormatter(scope, c, false)"
              v-on="setCommonEvent(scope, c)"
            >{{ tagLabelFormatter(scope, c) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="c.type === 'image' && !c.isHidden"
          :key="`column-${i}`"
          :label="t(c.label) || ''"
          :align="c.align || 'left'"
          :prop="c.key"
          :width="c.width"
        >
          <template slot-scope="scope">
            <el-image style="width: 80px; height: 80px" :src="scope.row[c.mapSize.small]" :preview-src-list="[scope.row[c.mapSize.big]]" />
          </template>
        </el-table-column>
        <slot v-else-if="c.type === 'custom' && !c.isHidden" :name="c.name" />
      </template>
      <slot name="column-action" />
    </el-table>
    <div v-if="total !== 0" class="f-r -e pt-16">
      <el-form>
        <el-pagination
          background
          :current-page.sync="paginationNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="paginationSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </el-form>
    </div>
  </div>
</template>

<script>
/**
 * v7.1 表格组件
 */
import dayjs from 'dayjs'
export default {
  props: {
    // 1. 表格数据
    data: {
      type: Array,
      default() {
        return []
      }
    },
    // 2. 列配置
    config: {
      type: Array,
      default() {
        return []
      }
    },
    // 3. 数据总数 分页用
    total: {
      type: Number,
      default: 0
    },
    // 4. 是否表显示多选框列
    selectable: {
      type: [Boolean, Function],
      default: false
    },
    // 5. 是否显示序号列
    serializable: {
      type: Boolean,
      default: false
    },
    // 6. 是否显示top action
    showTopAction: {
      type: Boolean,
      default: true
    },
    // 7. 高度
    height: {
      type: Number,
      default: undefined
    },
    // 8. 最大高度
    maxHeight: {
      type: Number,
      default: undefined
    },
    // 9. 高度是否自适应外部给定
    isHeightOuterResize: {
      type: Boolean,
      default: false
    },
    // 10. 列表rowKey，同el-table中的row-key
    rowKey: {
      type: [String, Function],
      default: 'id'
    },
    // 11. cell样式
    cellStyle: {
      type: [Function, Object],
      default: undefined
    },
    // 12. 分页 - 当前页  分页用
    pageNum: {
      type: Number,
      default: 1
    },
    // 13. 分页 - 每页数量  分页用
    pageSize: {
      type: Number,
      default: 10
    },
    // 14. 加载
    loading: {
      type: Boolean,
      default: false
    },
    // 15. 合并行或列的计算方法
    spanMethod: {
      type: Function,
      default: undefined
    },
    // 16. 行的 className 的回调方法
    rowClassName: {
      type: [Function, String],
      default: undefined
    },
    // 17. 单元格的 className 的回调方法
    cellClassName: {
      type: [Function, String],
      default: undefined
    },
    // 18. 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
    defaultExpandAll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showSearch: true,
      paginationNum: 1,
      paginationSize: 10,
      orderList: [],
      tableMaxHeight: this.maxHeight,
      tableHeight: this.height,
      tableConfig: this.convertConfig(this.config)
    }
  },
  computed: {
    selectableType() {
      if (this.selectable) {
        if (_.isBoolean(this.selectable)) {
          return 'boolean'
        } else if (_.isFunction(this.selectable)) {
          return 'function'
        }
      }
      return undefined
    }
  },
  watch: {
    pageNum(v) {
      if (_.isNumber(v)) {
        this.paginationNum = v
      }
    },
    pageSize(v) {
      if (_.isNumber(v)) {
        this.paginationSize = v
      }
    },
    paginationNum(v) {
      if (this.pageNum !== v) {
        this.$emit('update:pageNum', v)
      }
    },
    paginationSize(v) {
      if (this.pageNum !== v) {
        this.$emit('update:pageSize', v)
      }
    },
    total() {
      this.calcHeight()
    }
  },
  methods: {
    convertConfig(config) {
      return _.map(config, (c) => {
        return {
          ...c,
          disabled: !!c.disabledFilter,
          isHidden: !!c.isHidden
        }
      })
    },
    filterChange(i) {
      this.$set(this.tableConfig[i], 'isHidden', !this.tableConfig[i].isHidden)
    },
    isDateTimeType(type) {
      return _.includes(
        ['date', 'time', 'date-time', 'time-second', 'date-time-second'],
        type
      )
    },
    setCommonEvent(scope, config) {
      const _this = this
      const temp = {}
      if (config.click) {
        temp.click = () => {
          _this.$emit(config.click, scope.row)
        }
      }
      return temp
    },
    toggleSearch() {
      this.showSearch = !this.showSearch
      this.$EventBus.$emit('toggleSearch', this.showSearch)
    },
    drag() {
      this.$refs.table.doLayout()
    },
    refresh() {
      this.$emit('refresh')
    },
    select(selection, row) {
      this.$emit('select', selection, row)
    },
    selectAll(selection) {
      this.$emit('select-all', selection)
    },
    selectionChange(selection) {
      this.$emit('selection-change', selection)
    },
    rowDblclick(row) {
      this.$emit('row-dblclick', row)
    },
    rowClick(row) {
      this.$emit('row-click', row)
    },
    sort({ order, prop }) {
      this.orderList = []
      if (order !== null) {
        this.orderList.push({
          column: prop,
          isAsc: order
        })
      }
      this.$emit('sort', this.orderList)
    },
    textFormatter(cellValue, config) {
      // formatter回调
      if (config.formatter) {
        return config.formatter(cellValue, config)
      }
      // undefinded null '' 值处理
      if (cellValue === '' || _.isNil(cellValue)) {
        return config.emptyPlaceholder ? config.emptyPlaceholder : ''
      }
      // 字典映射
      if (config.dict) {
        const item = _.find(
          config.dict,
          (d) => _.toString(d.value) === _.toString(cellValue)
        )
        return item ? this.t(item.label) : ''
      }
      // map映射
      if (config.map) {
        const item = config.map[cellValue]
        return item || ''
      }
      return cellValue
    },
    dateTimeFormatter(cellValue, config) {
      if (cellValue === undefined || cellValue === null) return ''
      const formatMap = {
        date: 'YYYY-MM-DD',
        time: 'HH:mm',
        'time-second': 'HH:mm:ss',
        'date-time': 'YYYY-MM-DD HH:mm',
        'date-time-second': 'YYYY-MM-DD HH:mm:ss'
      }
      return dayjs(cellValue).format(formatMap[config.type])
    },
    // Tag的类型，custom为自定义tag，可以拉取字典表中cssClass字段的自定义样式；normal为普通tag，选择为el-tag中的几种样式
    getTagType(scope, config) {
      const cellValue = scope.row[config.key]
      if (cellValue === undefined || cellValue === null || cellValue === '') {
        return false
      }
      const item = _.find(
        config.dict,
        (d) => _.toString(d.value) === _.toString(cellValue)
      )
      const colorStyle = item?.raw?.cssClass
      return colorStyle ? 'custom' : 'normal'
    },
    // 若isCustom = true，显示字典配置中的样式属性，反之，显示字典配置中的回显样式
    tagColorFormatter(scope, config, isCustom) {
      const cellValue = scope.row[config.key]
      if (cellValue !== undefined && cellValue !== null) {
        const item = _.find(
          config.dict,
          (d) => _.toString(d.value) === _.toString(cellValue)
        )
        if (isCustom) {
          return item?.raw?.cssClass
        } else return item?.raw?.listClass
      }
      return ''
    },
    tagLabelFormatter(scope, config) {
      const cellValue = scope.row[config.key]
      if (cellValue === undefined || cellValue === null) return ''
      const item = _.find(
        config.dict,
        (d) => _.toString(d.value) === _.toString(cellValue)
      )
      return item ? this.t(item.label) : ''
    },
    onResize(height) {
      this.$nextTick(() => {
        _.debounce(() => this.calcHeight(height), 1500)
      })
    },
    calcHeight(h) {
      if (!this.maxHeight && !this.height && this.isHeightOuterResize) {
        let rectHeight = h
        if (rectHeight > 0) {
          // 如果有工具栏
          if (this.showTopAction) {
            // 28+8+16+2
            rectHeight -= 54
          }
          // 如果有分页栏
          if (this.total !== 0) {
            // 32+16
            rectHeight -= 48
          }
          this.tableMaxHeight = rectHeight
          this.tableHeight = this.tableMaxHeight
          this.$refs.table.doLayout()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.click-text {
  cursor: pointer;
  color: #409eff;
}
</style>
