<template>
  <div class="tree-box">
    <div ref="asideTree" class="tree-content b-n px-12 py-16" :style="{width: `${MIN_WIDTH}px`}">
      <template v-if="!isHide">
        <div v-show="isToolbarShow" class="f-r --c mb-8">
          <el-input v-model="filterText" placeholder="关键字" class="mr-8" />
          <el-tooltip class="item" effect="dark" :content="expandAll? '收起': '展开'" placement="top">
            <i
              :class="{
                'fs-20 cur-p': true,
                'el-icon-caret-bottom': !expandAll,
                'el-icon-caret-top': expandAll
              }"
              @click="triggerCollapse"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="隐藏" placement="top">
            <i class="el-icon-s-fold fs-20 ml-4 cur-p" @click="triggerVisible" />
          </el-tooltip>
        </div>
        <div class="mb-8">
          <slot name="tip" />
        </div>
        <div>
          <el-tree
            ref="tree"
            :filter-node-method="filterNode"
            :data="data"
            :props="defaultProps"
            :default-expand-all="expandAll"
            :expand-on-click-node="expandOnClickNode"
            highlight-current
            :node-key="defaultProps.value"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node, data }">
              <slot name="node" :data="data" :node="node">
                <span :title="node.label" class="fs-14">{{ node.label }}</span>
              </slot>
            </span>
          </el-tree>
        </div>
      </template>
      <div v-if="isHide" class="f-r -c --c">
        <el-tooltip class="item" effect="dark" content="显示" placement="top">
          <i class="el-icon-s-unfold fs-20 cur-p" @click="triggerVisible" />
        </el-tooltip>
      </div>
    </div>
    <div v-show="!isHide" ref="slide" class="slide-box">
      <span />
      <span />
    </div>
  </div>
</template>
<script>
/**
 * v1.2 树组件
 */
export default {
  components: {},
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    isExpandAll: {
      type: Boolean,
      default: false
    },
    isToolbarShow: {
      type: Boolean,
      default: true
    },
    expandOnClickNode: {
      type: Boolean,
      default: true
    },
    defaultProps: {
      type: Object,
      default() {
        return {
          children: 'children',
          label: 'label',
          value: 'id'
        }
      }
    },
    // 默认值
    default: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isHide: false,
      expandAll: this.isExpandAll,
      filterText: '',
      dom: undefined,
      // 缩放容器的起始位置
      startX: 0
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    default: {
      handler(val) {
        if (!_.isEmpty(this.data) && !_.isEmpty(val)) {
          // 在组件实例创建时会立即调用，获取this.$refs.tree需使用$nextTick
          this.$nextTick(() => {
            this.$refs.tree.setCurrentNode(val)
            this.$emit('change', val)
          })
        }
      },
      // 强制立即执行回调
      immediate: true
    }
  },
  created() {
    this.HIDE_WIDTH = 40 // 左侧隐藏时的宽度
    this.MIN_WIDTH = 220 // 左侧容器允许收缩的最小宽度
    this.MAX_WIDTH = 300 // 左侧容器允许拉伸的最大宽度
  },
  mounted() {
    this.dom = this.$refs.asideTree
    this.mousedown()
  },
  methods: {
    // 树筛选回调
    filterNode(value, data) {
      if (!value) return true
      return data[this.defaultProps.label].indexOf(value) !== -1
    },
    // 点击节点事件
    handleNodeClick(v) {
      this.$emit('change', v)
    },
    // 容器的显示隐藏
    triggerVisible() {
      this.isHide = !this.isHide
      if (this.isHide) {
        this.dom.style.width = `${this.HIDE_WIDTH}px`
      } else this.dom.style.width = `${this.MIN_WIDTH}px`
    },
    // 容器的收紧展开
    triggerCollapse() {
      this.expandAll = !this.expandAll
      const nodes = this.$refs.tree.store.root
      this.changeTreeNodeExpand(nodes)
    },
    // 递归改变节点的expanded状态
    changeTreeNodeExpand(node) {
      node.expanded = this.expandAll
      _.forEach(node.childNodes, (n) => {
        n.expanded = this.expandAll
        if (n.childNodes.length > 0) {
          this.changeTreeNodeExpand(n)
        }
      })
    },
    // 拖拽事件-鼠标按下
    mousedown() {
      const moveDom = this.$refs.slide
      moveDom.onmousedown = (e) => {
        this.startX = e.clientX
        e.preventDefault()
        document.onmousemove = (em) => {
          this.mousemove(em.clientX)
        }
        document.onmouseup = () => {
          document.onmouseup = null
          document.onmousemove = null
        }
      }
    },
    // 拖拽事件-鼠标移动
    mousemove(nowX) {
      const computedX = nowX - this.startX
      let changeWidth =
        parseInt(this.dom.style.width || this.dom.offsetWidth) + computedX
      if (changeWidth < this.MIN_WIDTH) {
        changeWidth = this.MIN_WIDTH
      } else if (changeWidth > this.MAX_WIDTH) {
        changeWidth = this.MAX_WIDTH
      }
      this.dom.style.width = changeWidth + 'px'
      this.startX = nowX
    },
    // 设置节点选中
    setCurrentKey(nodeKey) {
      this.$refs.tree.setCurrentKey(nodeKey)
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-box {
  position: relative;
}
.tree-content {
  height: 100%;
  transition: width 0.4s ease;
  color: #909399;
  overflow: auto;
}
.slide-box {
  position: absolute;
  top: 0;
  left: 100%;
  height: 100%;
  font-size: 26px;
  width: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: col-resize;

  span {
    width: 2px;
    background-color: #aaa;
    margin: 0 1px;
    height: 15px;
  }
}

::v-deep .el-tree-node > .el-tree-node__children {
  overflow: inherit;
}
</style>
