# vue-calendar
git: git: github.com/FlyingLxy/vue-multifunction-calendar
> version: 1.0.4
> Support vue2.0 , simple calendar.

### Install
> npm install vue-multifunction-calendar --save

### Option
- **date** Date: Date instance. Default: new Date()
- **className** String: Custom class. Default: 'calendar'
- **calendarTitle** String: Title description. Default: '当前日期'
- **startYear** String/Number: Start year range. Default: 1901
- **endYear** String/Number: End year range. Default: 2050
- **isShow** Boolean: Show trigger. Default: true
- **change** CallBack: Date change callBack. **param**: String 'xxxx-xx-xx'

### Example
```javascript
// xx.vue
// script
<script>
import calendar from 'vue-multifunction-calendar';
export default {
    data() {
        return {
            data: new Date()
            isShow: true
        }
    },
    methods: {
        dateHandler: function (date) {
            console.log(date) // '2000-01-01'
            this.isShow = false;
            //...code
        }
    }
}
</script>

// template
<template>
    <calendar
        :className="myCalendar"
        :date="date"
	:isShow="isShow"
        calendarTitle="当前日期"
        startYear="2000"
        endYear="2050"
        @change="dateHandler"
        >
    </calendar>
</template>
```
