---
title: pie-2
order: 1
group:
  title: 图表组件
  order: 2
---

#### 示例

![pie-1](../assets/screen-component/pie2.png)

#### 引用代码

```javascript
<template>
  <Chart id="xxx" :data="data" :color="color" :title="title" :bg-color="bgColor" style="width: 300px;height: 250px"/>
</template>

<script>
  data() {
    return {
      title: '人工填报隐患',
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' }
      ]
      color:['#e14b28', '#faa21f', '#f1ec41', '#32b34a'],
      bgColor: '#032656'
    }
  }
</script>
```

#### 组件代码

```javascript
<template>
  <div :id="id" />
</template>

<script>
const CHART_ID = 'HdRatePieChart'
/**
 * 有间隔的环形饼图
 */
export default {
  name: CHART_ID,
  props: {
    id: {
      type: String,
      default: CHART_ID
    },
    title: {
      type: String,
      default: ''
    },
    color: {
      type: Array,
      default() {
        return []
      }
    },
    bgColor: {
      type: String,
      default: 'transparent'
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      chart: {}
    }
  },
  watch: {
    data() {
      this.chart.setOption(this.getOption())
    }
  },
  mounted() {
    this.chart = this.$echarts.init(document.getElementById(this.id))
    this.chart.setOption(this.getOption())
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    resize: _.debounce(function () {
      this.chart.resize()
    }, 300),
    getOption() {
      const option = {
        color: this.color,
        legend: {
          show: false
        },
        title: {
          text: this.title,
          subtext: this.data[0].rate,
          left: 'center',
          top: '30%',
          textStyle: {
            color: '#fff',
            fontSize: 14,
            lineHeight: 16
          },
          subtextStyle: {
            color: '#6ec0ff',
            fontSize: 24
          }
        },
        series: [
          {
            type: 'pie',
            top: '2%',
            radius: ['65%', '85%'],
            avoidLabelOverlap: false,
            percentPrecision: 0,
            itemStyle: {
              borderRadius: 0,
              borderWidth: 5,
              borderColor: this.bgColor
            },
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            data: this.data
          }
        ]
      }
      return option
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

```
