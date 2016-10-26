<script>
  export default {
    name: 'day',
    props: {
      days: {
        type: Array,
        required: true
      },
      currentYear: {
        type: Number,
        required: true
      },
      currentMonth: {
        type: Number,
        required: true
      },
      currentDate: {
        type: Number,
        required: true
      }
    },
    methods: {
      selectDay: function (day) {
        var sDate = day.getDate(),
            sMonth = day.getMonth() + 1,
            sYear = day.getFullYear();
        if (sDate === this.currentDate && sMonth === this.currentMonth && sYear === this.currentYear) {
          return;
        }
        if (sMonth !== this.currentMonth || sYear !== this.currentYear) {
          return;
        }
        this.$emit('selectedDate',sDate);
      }
    }
  }
</script>

<template>
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
</template>

<style>
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
