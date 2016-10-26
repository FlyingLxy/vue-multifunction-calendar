const Calendar = require('./src/main.vue');

Calendar.install = function (Vue) {
  console.log(Calendar.name);
  Vue.component(Calendar.name, Calendar);
};

module.exports = Calendar;
