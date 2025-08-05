<template>
  <div class="f-c">
    <div class="f-r -sb --c mb-12">
      <div class="f-r --c fs-24">
        <i class="el-icon-arrow-left cur-p mt-4" @click="prevClick" />
        <span class="mx-4">{{ title }}</span>
        <i class="el-icon-arrow-right cur-p mt-4" @click="nextClick" />
      </div>
      <div class="px-12" style="margin: 0 auto 0 0">
        <slot name="leftToolbar" :date="currentDate" />
      </div>
      <div class="px-12" style="margin: 0 0 0 auto">
        <slot name="rightToolbar" :date="currentDate" />
      </div>
      <div class="f-r --c">
        <el-button-group>
          <el-button type="primary" size="small" @click="prevClick">{{ t('上个月') }}</el-button>
          <el-button type="primary" size="small" @click="currentMonthClick">{{ t('本月') }}</el-button>
          <el-button type="primary" size="small" @click="nextClick">{{ t('下个月') }}</el-button>
        </el-button-group>
      </div>
    </div>
    <FullCalendar ref="fullCalendar" :options="calendarOptions">
      <template #dayCellContent="{ date }">
        <div class="f-c -c pos-r">
          <div class="f-r">
            <div :class="setTextClass(date, 'main')">{{ dateFormat(date) }}</div>
            <div v-if="mode === 'advanced'" :class="setTagClass(date)">{{ tagFormat(date) }}</div>
          </div>
          <div v-if="mode !== 'simple'" :class="setTextClass(date, 'sub')">{{ lunarDateFormat(date) }}</div>
          <slot :date="date" />
        </div>
      </template>
    </FullCalendar>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import {
  getLunarDate,
  isHoliday,
  getDayDetail,
  isWorkday,
  getSolarTerms
} from 'chinese-days'
import dayjs from 'dayjs'

/**
 * v2.1 日历组件
 */
export default {
  name: 'VFullCalendar',
  components: {
    FullCalendar
  },
  props: {
    height: {
      type: Number,
      default: 550
    },
    mode: {
      type: String,
      default: 'simple'
    },
    start: {
      type: String,
      default: undefined
    },
    end: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth', // 日历加载时的初始视图，默认值为'dayGridMonth'，可以为任何可用视图的值，如例如'dayGridWeek'，'timeGridDay'，'listWeek'
        initialDate: new Date(), // 日历第一次加载时显示的初始日期。可以解析为Date的任何职包括ISO8601日期字符串，例如"2014-02-01"。
        dateAlignment: 'month',
        dateIncrement: { months: 1 }, // 设置日期增量为一个月
        locale: this.convertLocale([localStorage.getItem('language')]), // 设置日历的语言，中文为 “zh-cn”
        weekNumberCalculation: 'ISO', // 指定"ISO"结果为ISO8601周数。指定"ISO"将firstDay的默认值更改为1（Monday）
        contentHeight: this.height, // 日历高度
        headerToolbar: false,
        validRange: {
          start: this.start,
          end: this.end
        }
      },
      title: '',
      calendarApi: null,
      currentDate: new Date(),
      holidays: [] // 用于存储节假日，以此判断哪天为节假日的第一天
    }
  },
  created() {
    // 注册toggleLanguage事件,从而获取语言改变触发的事件响应
    this.$EventBus.$on('toggleLanguage', (v) => {
      this.calendarOptions = {
        ...this.calendarOptions,
        locale: this.convertLocale(v)
      }
      this.$nextTick(() => {
        this.calendarApi = this.$refs.fullCalendar.getApi()
        this.title = this.calendarApi.view.title
      })
    })
  },
  mounted() {
    this.calendarApi = this.$refs.fullCalendar.getApi()
    this.title = this.calendarApi.view.title
  },
  methods: {
    convertLocale(v) {
      const localeMap = {
        cn: 'zh-cn',
        en: 'en',
        ja: 'ja'
      }
      return localeMap[v]
    },
    dateFormat(date) {
      return dayjs(date).date()
    },
    lunarDateFormat(date) {
      // 简单模式不显示，标准模式只显示农历，复杂模式显示法定节假日、节气和农历
      if (this.mode === 'simple') {
        return ''
      }
      const dateCalendar = getLunarDate(date)
      const lunarMonCN = dateCalendar.lunarMonCN
      const lunarDayCN = dateCalendar.lunarDayCN
      if (this.mode === 'standard') {
        return `${dateCalendar.lunarMonCN}${dateCalendar.lunarDayCN}`
      }
      if (this.mode === 'advanced') {
        // 显示优先级依次为 法定节假日 > 节气 > 农历
        // 法定节假日
        if (lunarMonCN === '正月' && lunarDayCN === '初一') {
          return '春节'
        }
        if (lunarMonCN === '五月' && lunarDayCN === '初五') {
          return '端午节'
        }
        if (lunarMonCN === '八月' && lunarDayCN === '十五') {
          return '中秋节'
        }
        const solarMon = dayjs(date).month()
        const solarDay = dayjs(date).date()
        if (solarMon === 0 && solarDay === 1) {
          return '元旦'
        }
        if (solarMon === 0 && solarDay === 1) {
          return '清明节'
        }
        if (solarMon === 4 && solarDay === 1) {
          return '劳动节'
        }
        if (solarMon === 9 && solarDay === 1) {
          return '国庆节'
        }
        // 节气
        const solarTerms = getSolarTerms(date)
        if (!_.isEmpty(solarTerms.name)) {
          return solarTerms.name
        }
        // 农历
        return `${dateCalendar.lunarMonCN}${dateCalendar.lunarDayCN}`
      }
    },
    tagFormat(date) {
      // 简单模式和标准模式不显示标签，复杂模式显示标签
      if (this.mode === 'simple' || this.mode === 'standard') {
        return ''
      }
      if (this.isWork(date)) {
        return '班'
      }
      if (this.isLegalHolidays(date)) {
        return '休'
      }
    },
    setTextClass(date, type) {
      let tClass = type === 'main' ? 'text' : 'sub-text'
      if (isHoliday(date) && this.mode === 'advanced') {
        tClass += ' holiday'
      }
      return tClass
    },
    setTagClass(date) {
      let tClass = 'tag'
      if (this.isWork(date)) {
        tClass += ' work'
      } else if (this.isLegalHolidays(date)) {
        tClass += ' holiday'
      }
      return tClass
    },
    // 是否为调休工作日
    isWork(date) {
      const weekday = dayjs(date).day()
      return isWorkday(date) && (weekday === 0 || weekday === 6)
    },
    // 是否为法定节假日
    isLegalHolidays(date) {
      const { work, name } = getDayDetail(date)
      return !work && name !== 'Saturday' && name !== 'Sunday'
    },
    prevClick() {
      this.calendarApi.prev()
      this.title = this.calendarApi.view.title
      this.currentDate = this.calendarApi.currentData.currentDate
      this.$emit('prev', this.currentDate)
      // 如果dayGridMonth查看日历，则将日历后移一个月。
      // 如果日历位于dayGridWeek或中timeGridWeek，则将日历后移一周。
      // 如果日历位于dayGridDay或中timeGridDay，则将日历移回一天。
    },
    nextClick() {
      this.calendarApi.next()
      this.title = this.calendarApi.view.title
      this.currentDate = this.calendarApi.currentData.currentDate
      this.$emit('next', this.currentDate)
      // 如果dayGridMonth查看日历，则将日历向前移动一个月。
      // 如果日历位于dayGridWeek或中timeGridWeek，则将日历向前移动一周。
      // 如果日历位于dayGridDay或中timeGridDay，则将日历向前移动一天。
    },
    currentMonthClick() {
      this.calendarApi.today() // 将日历移动到当前日期。
      this.calendarApi.getDate() // 返回日期的日历的当前日期
      this.title = this.calendarApi.view.title
      this.currentDate = dayjs().startOf('month').toDate()
      this.$emit('current', this.currentDate)
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
  font-size: 18px;
  font-weight: 700;

  &.holiday {
    color: #c73737;
  }
}

.sub-text {
  font-size: 12px;
  font-weight: 400;

  &.holiday {
    color: #c73737;
  }
}

.tag {
  width: 16px;
  height: 16px;
  margin-left: 4px;
  font-size: 12px;
  margin-top: -2px;
  display: flex;
  justify-content: center;
  align-items: center;

  &.work {
    background-color: #4e5877;
    color: #fff;
  }
  &.holiday {
    background-color: #c73737;
    color: #fff;
  }
}

::v-deep .fc-daygrid-day-top {
  justify-content: flex-start;
  flex-direction: row;
  padding: 6px 8px;
  a {
    cursor: default !important;
  }
}

::v-deep .fc-daygrid-day-events {
  min-height: 0 !important;
}

::v-deep .fc-daygrid-day-number {
  width: 100%;
}

::v-deep .fc-daygrid-day-frame {
  min-height: 85px;

  &:hover {
    background-color: #f5f5f5;
  }
}
</style>
