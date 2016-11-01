<script>
/**
 * @file 日历组件
 * @param { Date } Date - 当前日期的Date实例. 默认为 new Date()
 * @param { className } String - 外部容器自定义类名. 默认为: calendar
 * @param { calendarTitle } String - 日历上方当前选中日期左侧文字. 默认为： 当前日期
 * @param { startYear/endYear } String/Number - 可选的年份的范围. 默认为： 1901/2050
 * @param { change } CallBack - 日期变化触发回调. 传入参数: xxxx-xx-xx String类型
 * @author langxiaoyu@autohome.com
 */

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
        // 开始时间/结束时间
        startYear: {
            type: [String, Number],
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
            type: [String, Number],
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
        dateChange: function () {
            return  `${this.currentYear}-${this.currentMonth}-${this.currentDate}`;
        }
    },
    watch: {
        dateChange: function (value) {
            this.$emit('change',this.dateChange);
        },
        date: function (value) {
            this.initDate(value);
        }
    },
    methods: {
        // 初始化日期
        initDate: function (cur) {
            var d = cur || new Date();
            // 获取当前年，月，日，星期
            this.currentDate = d.getDate();
            this.currentMonth = d.getMonth() + 1;
            this.currentYear = d.getFullYear();
            this.currentDay = d.getDay() || 7;
            this.days.length = 0;
            // 获取本月1号是周几
            var _currentDate = 1;
            var _key = `${this.currentYear}-${this.currentMonth}`;
            var _str = this.formatDate(this.currentYear, this.currentMonth, _currentDate);
            var _currentDay = new Date(_str).getDay() || 7;
            // 判断cache中是否存储了当前年月的日期
            if (this.cache[_key]) {
                this.days = [].concat(this.cache[_key]);
                return;
            }
            // 获取本月1号是周几，推出来前面的日期
            for (var i = _currentDay - 1; i >= 0; i--) {
                var _d = new Date(_str);
                var _j = _d.getDate() - i;
                _d.setDate(_j);
                this.days.push(_d);
            }
            // 推算1号之后的日期
            for (var i = 1; i <= 42 - _currentDay; i++) {
                var _d = new Date(_str);
                var _j = _d.getDate() + i;
                _d.setDate(_j);
                this.days.push(_d);
            }
            // 缓存
            this.cache[`${this.currentYear}-${this.currentMonth}`] = [].concat(this.days);
        },
        // 上一个月
        pre: function () {
            // 如果是1月则修改年份
            if (this.currentMonth > 1) {
                // 获取上个月最后一天
                var date = this.newDate(this.currentYear, this.currentMonth, this.currentDate);
                date.setDate(0);
                var lastDate = date.getDate();
                // 如果上个月最后一天是 30 号， 当前选择的是当前月的 31 号
                // 那么切换到上个月后选中当前月的最后一天
                if (lastDate < this.currentDate) {
                    this.initDate(this.newDate(this.currentYear, this.currentMonth - 1, lastDate));
                }else {
                    this.initDate(this.newDate(this.currentYear, this.currentMonth - 1, this.currentDate));
                }
            }else {
                this.initDate(this.newDate(this.currentYear - 1, 12, this.currentDate));
            }
        },
        next: function () {
            if (this.currentMonth < 12) {
                // 获取下一个月的最后一天
                var date = this.newDate(this.currentYear, this.currentMonth + 2, this.currentDate);
                date.setDate(0);
                var lastDate = date.getDate();
                // 同pre一个道理
                if (lastDate < this.currentDate) {
                    this.initDate(this.newDate(this.currentYear, this.currentMonth + 1, lastDate));
                }else {
                    this.initDate(this.newDate(this.currentYear, this.currentMonth + 1, this.currentDate));
                }
            }else {
                this.initDate(this.newDate(this.currentYear + 1, 1, this.currentDate));
            }
        },
        dropdownShow: function (name) {
            // 年月下拉菜单显示和隐藏控制，一个显示，另一个关闭
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
            // 获取选中年份， 并隐藏下拉菜单
            this.currentYear = year;
            this.initDate(this.newDate(this.currentYear, this.currentMonth, this.currentDate));
            this.isYear = false;
        },
        selectedMonth: function (month) {
            // 获取选中月份，并隐藏下拉菜单
            this.currentMonth = month;
            // 获取选中月的最后一天
            var date = this.newDate(this.currentYear, this.currentMonth + 1, this.currentDate);
            date.setDate(0);
            var lastDate = date.getDate();
            if (lastDate < this.currentDate) {
                this.initDate(this.newDate(this.currentYear, this.currentMonth, lastDate));
            }
            else {
                this.initDate(this.newDate(this.currentYear, this.currentMonth, this.currentDate));
            }
            this.isMonth = false;
        },
        selectedDate: function (newDate) {
            // 获取选中天
            this.currentDate = newDate;
        },
        newDate: function (y,m,d) {
            // 根据 年，月，日， 生成date对象
            var _d = this.formatDate(y,m,d);
            return new Date(_d);
        },
        formatDate: function (y,m,d) {
            // 格式化年月日 xxxx-xx-xx
            m = m < 10 ? '0' + m : m;
            d = d < 10 ? '0' + d : d;
            return y + '-' + m + '-' + d;
        },
        calendarClickHandler: function (e) {
            // 点击空白处事件
            this.isYear= false;
            this.isMonth = false;
        }
    }
}
</script>

<template>
    <div :class="'calendar ' + className">
        <div class="calendar-date" v-text="`${calendarTitle} ${currentYear}-${currentMonth}-${currentDate}`"></div>
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
ul,ol,li,p,h1,h2,h3,h4,h5,h6 {
    margin: 0;
    padding: 0;
}
.calendar {
    max-width: 600px;
    min-width: 180px;
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
    font-weight: bold;
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
    line-height: 20px;
    border-radius: 10px;
    font-size: 14px;
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
    line-height: 20px;
    font-size: 14px;
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
    height: 26px;
    line-height: 26px;
    font-size: 14px;
    text-align: center;
}
</style>
