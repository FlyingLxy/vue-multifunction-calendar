# vue-calendar
- version: 1.0.2
- Support vue2.0 , simple calendar.

# attributes
date:  Date 类型, 设置日历当前日
```
<calendar :date="new Date()"><calendar>
```

className: String 类型, 设置外部容器类名
```
<calendar className="calendar"></calendar>
```

calendarTitle: String 类型, 设置日历上方的title
```
<calendar calendarTitle="当前日期"><calendar>
```

starYear: String、Number 类型, 设置日历可选范围的开始
```
<calendar starYear="1970"></calendar>
```

endYear: String、Number 类型， 设置日历可选范围的结束
```
<calendar endYear="2020"></calendar>
```

# method (callback)
click calendar day call callback(params)
params: String, '1970-01-01'
```
<calendar @dateChange="getSelectedDate"></calendar>
...vue
methods: {
    getSelectedDate: function(params) {
      params  // xxxx-xx-xx
      //....coding
    }
}
```

```
import 'calendar' from 'vue-multifunction-calendar';
```
