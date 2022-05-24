<script lang="ts" setup>
import { reactive, toRefs } from "@vue/reactivity";

const props = defineProps({
  distance:Number,
  isScroll:Boolean,
  endText:{
    type: String,
    default: '没有更多数据了'
  }
})

const data = {
  scrollEl: null,
  startText: '释放可刷新',
  scrollTop: 0,
  startY: 0,
  translateY: 0,
  touchStartTitleShow: false,
  touchEndTitleShow: false,
  isScroll:false
}
const Refdata = reactive({...data})

//对父组件进行传值
const emits = defineEmits(['getList','refresh'])
//松手事件
const touchendEvent = (e:any) => {
  let y = e.changedTouches[0].pageY
  //当屏幕在最顶部向上滑动时
  if(y > data.startY){
    data.translateY = 0
    data.startY = 0
    data.touchStartTitleShow = false
    data.touchEndTitleShow = false
    emits('refresh', () => { data.touchEndTitleShow = false})
    
  }
}
//手指滑动屏幕事件
const touchmoveEvent = (e:any) => {
  let y = e.targetTouches[0].pageY
  //当滑动往上并滚轮为0时候展示提示
  if(y > data.startY && data.scrollTop === 0) {
    data.touchStartTitleShow = true
    data.translateY = (y - data.startY) / 2
  } else {
    data.touchStartTitleShow = false
  }
}
//手指触碰屏幕事件
const touchstartEvent = (e:any) => {
  let y = e.targetTouches[0].pageY
  data.startY = y
}
//滚动事件
const scrollEvent = (e:any) => {
  data.scrollTop = e.srcElement.scrollTop
  if(!props.isScroll) return

  if(data.scrollTop + e.srcElement.offsetHeight > e.srcElement.scrollHeight - (props.distance as number)){
    emits('getList')
  }
}

const {
  scrollEl,
  startText,
  scrollTop,
  translateY,
  touchStartTitleShow,
  touchEndTitleShow,
  isScroll
} = toRefs(Refdata)
</script>

<template>
  <div class="box">
    <div class="scroll_box"
    ref="scrollEl"
    @scroll="scrollEvent"
    @touchend="touchendEvent"
    @touchmove="touchmoveEvent"
    @touchstart="touchstartEvent"
    :style="{ top : `${translateY}px`}"
    >
      <div class="loading_box" v-if="touchStartTitleShow">释放可刷新</div>
      <div class="loading_box" v-if="touchEndTitleShow">加载中</div>
      <slot></slot>
      <!-- 元素不存在或到底显示文字 -->
      <div class="end_text" v-if="!isScroll">{{endText}}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box{
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 90vh;
  .loading_box{
    position: absolute;
    top: 0;
    padding: 20px;
    text-align: center;
  }
}
.scroll_box{
  width: 100%;
  height: 90vh;
  overflow: auto;
  transition: all 0s ease 0s;
  position: absolute;
  right: 0;
  .end_text{
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #999;
  }
}
</style>