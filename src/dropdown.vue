<script>
  import '../font/iconfont.css';
  export default {
    name: 'calendar-dropdown',
    props: {
      className: {
        type: String
      },
      isShow: {
        type: Boolean,
        required: true
      },
      list: {
        type: Array,
        required: true
      },
      current: {
        type: Number,
        required: true
      }
    },
    methods: {
      selectedDropdown: function () {
        this.$emit('show', this.className);
        this.$nextTick(function () {
          let ref = this.className ? this.className + '-dropdown' : 'calendar-dropdown';
          let list = this.$refs[ref];
          let active = list.querySelector("li[class='active-years']");
          list.scrollTop = active.offsetTop - list.clientHeight/2 + active.clientHeight/2;
        });
      },
      selectedItem: function (item) {
        this.$emit('selected', item);
      }
    }
  }
</script>

<template>
  <span :class="className ? className + ' calendar-dropdown' : 'calendar-dropdown'">
    <span @click.stop="selectedDropdown">
      <p v-text="current"></p>
      <i class="iconfont icon-unfold"></i>
    </span>
    <div class="calendar-dropdown-list" v-show="isShow">
      <ul :ref="className ? className + '-dropdown' : 'calendar-dropdown'">
        <li
          :class="{'active-years': item === current}"
          :key="index"
          @click.stop.prevent="selectedItem(item)"
          v-for="(item, index) in list"
          v-text="item"
          >
        </li>
      </ul>
    </div>
  </span>
</template>

<style>
/* 下拉菜单按钮 */
.calendar-dropdown {
  display: inline-block;
  margin-left: 2%;
  margin-right: 2%;
  position: relative;
  width: 32.72%;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  vertical-align: top;
  border-radius: 10px;
  background-color: #fff;
  color: #da3e3d;
  cursor: pointer;
}
.calendar-dropdown span {
  position: relative;
  display: block;
  height: 100%;
}
.calendar-dropdown span p {
  margin-right: 16px;
  height: 100%;
  text-align: center;
  font-size: 14px;
  vertical-align: top;
}
.calendar-dropdown span i {
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 7px;
  font-size: 16px;
}

/* 下拉菜单列表 */
.calendar-dropdown-list {
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
.calendar-dropdown-list ul {
  margin-left: 15px;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
}
.calendar-dropdown-list li {
  margin-right: 15px;
}
.calendar-dropdown-list li:hover {
  background-color: #eee;
}

/* 选中item */
.active-years {
  color: #da3e3d;
}

</style>
