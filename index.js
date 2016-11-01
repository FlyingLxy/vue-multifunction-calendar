/**
 * @file 日历组件
 * @param { Date } Date - 当前日期的Date实例. 默认为 new Date()
 * @param { className } String - 外部容器自定义类名. 默认为: calendar
 * @param { calendarTitle } String - 日历上方当前选中日期左侧文字. 默认为： 当前日期
 * @param { startYear/endYear } String/Number - 可选的年份的范围. 默认为： 1901/2050
 * @param { change } CallBack - 日期变化触发回调. 传入参数: xxxx-xx-xx String类型
 * @author XiaoYu.Lang Email: webdeveloperfox@gmail.com
 */

const Calendar = require('./src/main.vue');

Calendar.install = function (Vue) {
  console.log(Calendar.name);
  Vue.component(Calendar.name, Calendar);
};

module.exports = Calendar;
