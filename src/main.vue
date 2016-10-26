<script>
  import '../font/iconfont.css';
  import dropdown from './dropdown.vue';
  import days from './days.vue';
  export default {
    name: 'calendar',
    data() {
      return {
        currentDate: this.date.getDate(),
        currentMonth: this.date.getMonth() + 1,
        currentYear: this.date.getFullYear(),
        currentDay: this.date.getDay(),
        days: [],
        years: [],
        months: [],
        isYear: false,
        isMonth: false,
        cache: {}
      }
    },
    components: {
      dropdown,
      days
    },
    created() {
      for (var i = this.startYear; i < this.endYear; i++) {
        this.years.push(i);
      }
      for (var i = 1; i <= 12; i++) {
        this.months.push(i);
      }
      this.initDate(this.date);
    },
    mounted() {
      window.addEventListener('click', this.calendarClickHandler, false);
    },
    beforeDestroy() {
      window.removeEventListener('click', this.calendarClickHander, false);
    },
    props: {
      // 当前日期
      date: {
        type: Date,
        default: () => new Date()
      },
      // class 名称
      className: {
        type: String,
        default: 'calendar'
      },
      // 日历上方标题
      calendarTitle: {
        type: String,
        default: '当前日期'
      },
      // 开始时候/结束时间
      startYear: {
        type: [String,Number],
        default: 1901,
        validator: function (val) {
          if ((typeof val !== 'string' && typeof val !== 'number') || !val.toString().match(/^[1,2]/gi) || val.toString().length !== 4) {
            console.warn("props 'starDate' invalid format !! example '1970'");
            return 1901;
          }
          return parseInt(val);
        }
      },
      endYear: {
        type: [String,Number],
        default: 2050,
        validator: function (val) {
          if ((typeof val !== 'string' && typeof val !== 'number') || !val.toString().match(/^[1,2]/gi) || val.toString().length !== 4) {
            console.warn("props 'starDate' invalid format !! example '2050'");
            return 2050;
          }
          return parseInt(val);
        }
      }
    },
    computed: {
      formatCurrentDate: function () {
        return this.formatDate(
          this.currentYear,
          this.currentMonth,
          this.currentDate
        )
      },
      dateChange: function () {
        return this.newDate(this.currentYear, this.currentMonth, this.currentDate);
      }
    },
    watch: {
      dateChange: function (value) {
        this.$emit('dateChange',this.formatDate(this.currentYear, this.currentMonth, this.currentDate));
      }
    },
    methods: {
      initDate: function (cur) {
        var d = cur || new Date();
        var _currentDate = 1;
        this.currentDate = d.getDate();
        this.currentMonth = d.getMonth() + 1;
        this.currentYear = d.getFullYear();
        this.currentDay = d.getDay() || 7;
        this.days.length = 0;
        var _key = `${this.currentYear}-${this.currentMonth}`;
        if (this.cache[_key]) {
          this.days = [].concat(this.cache[_key]);
          return;
        }
        var str = this.formatDate(this.currentYear, this.currentMonth, _currentDate);
        for (var i = this.currentDay - 1; i >= 0; i--) {
          var _d = new Date(str);
          _d.setDate(_d.getDate() - i);
          this.days.push(_d);
        }
        for (var i = 1; i <= 42 - this.currentDay; i++) {
          var _d = new Date(str);
          _d.setDate(_d.getDate() + i);
          this.days.push(_d);
        }
        this.cache[`${this.currentYear}-${this.currentMonth}`] = [].concat(this.days);
      },
      pre: function () {
        if (this.currentMonth > 1) {
          this.initDate(this.newDate(this.currentYear, this.currentMonth - 1, this.currentDate));
        }else {
          this.initDate(this.newDate(this.currentYear - 1, 12, this.currentDate));
        }
      },
      next: function () {
        if (this.currentMonth < 12) {
          this.initDate(this.newDate(this.currentYear, this.currentMonth + 1, this.currentDate));
        }else {
          this.initDate(this.newDate(this.currentYear + 1, 1, this.currentDate));
        }
      },
      dropdownShow: function (name) {
        if (name === 'year') {
          this.isYear = true;
          this.isMonth = false;
        }
        else {
          this.isYear = false;
          this.isMonth = true;
        }
      },
      selectedYear: function (year) {
        this.currentYear = year;
        this.initDate(this.newDate(this.currentYear, this.currentMonth, this.currentDate));
        this.isYear = false;
      },
      selectedMonth: function (month) {
        this.currentMonth = month;
        this.initDate(this.newDate(this.currentYear, this.currentMonth, this.currentDate));
        this.isMonth = false;
      },
      selectedDate: function (newDate) {
        this.currentDate = newDate;
      },
      newDate: function (y,m,d) {
        var _d = this.formatDate(y,m,d);
        return new Date(_d);
      },
      formatDate: function (y,m,d) {
        m = m < 10 ? '0' + m : m;
        d = d < 10 ? '0' + d : d;
        return y + '-' + m + '-' + d;
      },
      calendarClickHandler: function (e) {
        this.isYear= false;
        this.isMonth = false;
      }
    }
  }
</script>

<template>
  <div :class="'calendar ' + className">
    <div class="calendar-date" v-text="calendarTitle + ' ' + formatCurrentDate"></div>
    <div class="calendar-select">
      <span class="calendar-select-pre" @click="pre">
        <i class="iconfont icon-right"></i>
      </span>
      <dropdown
        className="year"
        :list="years"
        :current="currentYear"
        :isShow="isYear"
        @show="dropdownShow"
        @selected="selectedYear"
        >
      </dropdown>
      <dropdown
        className="dropdown-month"
        :list="months"
        :current="currentMonth"
        :isShow="isMonth"
        @show="dropdownShow"
        @selected="selectedMonth"
        style="margin-left: 0"
        >
      </dropdown>
      <span class="calendar-select-next" @click="next">
        <i class="iconfont icon-right"></i>
      </span>
    </div>
    <ul class="calendar-weekdays">
      <li>一</li>
      <li>二</li>
      <li>三</li>
      <li>四</li>
      <li>五</li>
      <li>六</li>
      <li>日</li>
    </ul>
    <days
      :days="days"
      :currentYear="currentYear"
      :currentMonth="currentMonth"
      :currentDate="currentDate"
      @selectedDate="selectedDate"
      >
    </days>
  </div>
</template>

<style>
.calendar {
  max-width: 600px;
  min-width: 230px;
  background-color: #da3e3d;
  color: #fff;
  font-family: Helvetica, Tahoma, Arial, STXihei, "华文细黑", "Microsoft YaHei", "微软雅黑", SimSun, "宋体", Heiti, "黑体", sans-serif;
}
.calendar-date {
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  vertical-align: baseline;
  font-size: 14px;
}
.calendar-select {
  width: 100%;
  font-size: 0;
  -webkit-text-size-adjust: none;
}
.calendar-select-pre,
.calendar-select-next {
  display: inline-block;
  font-size: 12px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  cursor: pointer;
  text-align: center;
  vertical-align: top;
}

.calendar-select-pre,
.calendar-select-next {
  margin: 0px 1%;
  width: 12.28%;
}
.calendar-select-pre .icon-right {
  display: block;
  margin: 0 auto;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #fff;
  color: #da3e3d;
  transform-origin: center center;
  transform: rotate(180deg);
}
.calendar-select-next .icon-right {
  display: block;
  margin: 0 auto;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #fff;
  color: #da3e3d;
}
/* 星期、日 */
.calendar-weekdays,
.calendar-days {
  width: 100%;
  font-size: 0;
  -webkit-text-size-adjust: none;
  font-weight: bold;
}
.calendar-weekdays li {
  display: inline-block;
  width: 14.28%;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  text-align: center;
}
</style>
