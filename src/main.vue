<script>
  import '../font/iconfont.css';
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
        yearTrigger: false,
        monthTrigger: false
      }
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
      },
      $$className: function () {
        var _className = 'calendar';
        return this.className !== _className ? this.className : 'calendar';
      }
    },
    watch: {
      dateChange: function (value) {
        this.$emit('dateChange',this.formatDate(this.currentYear, this.currentMonth, this.currentDate));
      }
    },
    methods: {
      formatDate: function (y,m,d) {
        m = m < 10 ? '0' + m : m;
        d = d < 10 ? '0' + d : d;
        return y + '-' + m + '-' + d;
      },
      initDate: function (cur) {
        var d = cur || new Date();
        var _currentDate = 1;
        this.currentDate = d.getDate();
        this.currentMonth = d.getMonth() + 1;
        this.currentYear = d.getFullYear();
        this.currentDay = d.getDay() || 7;
        this.days.length = 0;
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
      showYear: function () {
        this.yearTrigger = true;
        this.monthTrigger = false;
        this.$nextTick(function () {
          var el = this.$refs.yearlist;
          var yearEl = el.querySelector("li[class='active-year']");
          el.scrollTop = yearEl.offsetTop - el.clientHeight/2 + yearEl.clientHeight/2;
        });
      },
      showMonth: function () {
        this.monthTrigger = true;
        this.yearTrigger = false;
        this.$nextTick(function () {
          var el = this.$refs.monthlist;
          var monthEl = el.querySelector("li[class='active-month']");
          el.scrollTop = monthEl.offsetTop - el.clientHeight/2 + monthEl.clientHeight/2;
        });
      },
      selectYear: function (year) {
        this.currentYear = year;
        this.initDate(this.newDate(this.currentYear, this.currentMonth, this.currentDate));
        this.yearTrigger = false;
      },
      selectMonth: function (month) {
        this.currentMonth = month;
        this.initDate(this.newDate(this.currentYear, this.currentMonth, this.currentDate));
        this.monthTrigger = false;
      },
      selectDay: function (day) {
        var sDate = day.getDate(),
            sMonth = day.getMonth() + 1,
            sYear = day.getFullYear();
        if (sDate === this.currentDate && sMonth === this.currentMonth && sYear === this.currentYear) {
          return;
        }
        if (sMonth !== this.currentMonth || sYear !== this.currentYear) {
          //this.initDate(day);
          return;
        }
        this.currentDate = sDate;
      },
      newDate: function (y,m,d) {
        var _d = this.formatDate(y,m,d);
        return new Date(_d);
      },
      calendarClickHandler: function (e) {
        this.yearTrigger = false;
        this.monthTrigger = false;
      }
    }
  }
</script>

<template>
  <div :class="'calendar ' + $$className">
    <div class="calendar-date" v-text="calendarTitle + ' ' + formatCurrentDate"></div>
    <div class="calendar-select">
      <span class="calendar-select-pre" @click="pre">
        <i class="iconfont icon-right"></i>
      </span>
      <span class="calendar-select-year">
        <span @click.stop="showYear">
        <!--<span @click.stop="yearTrigger = !yearTrigger, monthTrigger = false">-->
          <p v-text="currentYear"></p>
          <i class="iconfont icon-unfold"></i>
        </span>
        <div class="calendar-yearlist" v-show="yearTrigger">
          <ul ref="yearlist">
            <li :id="typeof year" :class="{'active-year': year === currentYear}" v-for="year in years" v-text="year" @click.stop.prevent="selectYear(year)"></li>
          </ul>
        </div>
      </span>
      <span class="calendar-select-month">
        <span @click.stop="showMonth">
          <p v-text="currentMonth"></p>
          <i class="iconfont icon-unfold"></i>
        </span>
        <div class="calendar-monthlist" v-show="monthTrigger">
          <ul ref="monthlist">
            <li :class="{'active-month': month === currentMonth}" v-for="month in months" v-text="month" @click.stop.prevent="selectMonth(month)"></li>
          </ul>
        </div>
      </span>
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
    <ul class="calendar-days">
      <li
        :class="{'active-day': day.getFullYear() === currentYear &&
                 day.getMonth() + 1 === currentMonth &&
                 day.getDate() === currentDate,
                 'other-month': day.getMonth() + 1 !== currentMonth
                }"
        v-for="day in days"
        >
        <span v-text="day.getDate()" @click="selectDay(day)"></span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul,ol,p,h1,h2,h3,h4,h5,h6,div,span,i {
  margin: 0;
  padding: 0;
}
ul,ol {
  list-style: none;
}
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
/* 年月下拉菜单 */
.calendar-select {
  width: 100%;
  font-size: 0;
  -webkit-text-size-adjust: none;
}
.calendar-select-year,
.calendar-select-month,
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
.calendar-select-year,
.calendar-select-month {
  position: relative;
  width: 32.72%;
  border-radius: 10px;
  background-color: #fff;
  color: #da3e3d;
  font-weight: bold;
}
.calendar-select-year {
  margin-left: 2%;
  margin-right: 2%;
}
.calendar-select-month {
  margin-right: 2%;
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
.calendar-yearlist,
.calendar-monthlist {
  position: relative;
  top: -50px;
  width: 100%;
  height: 120px;
  overflow: hidden;
  border: 1px solid #eee;
  background-color: #fff;
  color: #333;
  z-index: 2;
}
.calendar-yearlist ul,
.calendar-monthlist ul {
  margin-left: 15px;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
}
.calendar-yearlist li,
.calendar-monthlist li {
  margin-right: 15px;
}
.calendar-yearlist li:hover,
.calendar-monthlist li:hover {
  background-color: #eee;
}
.active-year,
.active-month {
  color: #da3e3d;
}
.calendar-select-year span,
.calendar-select-month span {
  position: relative;
  display: block;
  height: 100%;
}
.calendar-select-year span p,
.calendar-select-month span p {
  margin-right: 16px;
  height: 100%;
  text-align: center;
  font-size: 14px;
  vertical-align: top;
}
.calendar-select-year span i,
.calendar-select-month span i {
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 7px;
  font-size: 16px;
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
.calendar-days {
  padding: 10px 0;
  border: 1px solid #eee;
  border-top: 0;
  background-color: #fff;
  color: #333;
  box-sizing: border-box;
}
.calendar-days li {
  display: inline-block;
  margin: 0px 1%;
  width: 12.28%;
  height: 30px;
  font-size: 14px;
  text-align: center;
}
.calendar-days span {
  display: block;
  margin: 0 auto;
  padding: 5px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  cursor: pointer;
}
.calendar-days span:hover {
  background-color: #eee;
}
.calendar-days .active-day span {
  color: #fff;
  background-color: #da3e3d;
}
.calendar-days .other-month span {
  color: #aaa;
}
</style>
