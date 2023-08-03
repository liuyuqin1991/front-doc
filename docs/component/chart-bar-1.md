---
title: bar-1
order: 1
group:
  title: 图表组件
  order: 2
---

#### 示例

![bar-1](../assets/screen-component/bar1.png)

#### 引用代码

```javascript
<template>
  <Chart id="xxx" :data="data" :color="color" style="width: 300px;height: 250px"/>
</template>

<script>
  data() {
    return {
      data: {
        legend: ['逾期未关闭', '逾期已关闭'],
        xAxis: [
          '2022-12',
          '2023-01',
          '2023-02',
          '2023-03',
          '2023-04',
          '2023-05'
        ],
        data: [
          [18, 23, 18, 19, 17, 22],
          [32, 49, 32, 49, 33, 48]
        ]
      }
      color:['#faa21f', '#32b34a']
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
const CHART_ID = 'hdOverdueNumChart'
/**
 * 逾期隐患情况-数量-普通柱状图
 */
export default {
  name: CHART_ID,
  props: {
    id: {
      type: String,
      default: CHART_ID
    },
    color: {
      type: Array,
      default() {
        return []
      }
    },
    data: {
      type: Object,
      default() {
        return {}
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
        grid: {
          left: 35,
          top: 50,
          right: 20,
          bottom: 40
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            crossStyle: {
              color: '#fff'
            }
          }
        },
        legend: {
          top: 8,
          itemGap: 32,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            color: '#fff'
          },
          selectedMode: false,
          data: this.data.legend
        },
        xAxis: [
          {
            type: 'category',
            data: this.data.xAxis,
            axisLabel: {
              rotate: 20,
              margin: 20,
              color: '#fff',
              align: 'center'
            },
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: {
              color: '#fff'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#163e7f'
              }
            }
          }
        ],
        series: []
      }
      _.forEach(this.data.data, (d, i) => {
        option.series.push({
          name: this.data.legend[i],
          type: 'bar',
          data: d,
          barGap: 0,
          barWidth: 12,
          label: {
            show: false,
            position: 'top',
            color: '#fff'
          }
        })
      })
      return option
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

```
