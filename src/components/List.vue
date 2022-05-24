<script name="List" setup lang="ts">
import { reactive } from "@vue/reactivity"
  //接收父组件传递的数据
  const props = defineProps({
    list:Object,
    showChildren:Boolean,
    msg:String
  })
  //存放数据
  const data = reactive({
    isScroll: true,
    page:0,
    showList: [],
    showChildren:''
  })
  const getShowChildren = (id:string)=>{
    data.showChildren === id ? (data.showChildren = '') :(data.showChildren = id)
  }

  // console.log(props.list)
</script>

<template>
  <div class="list_box">
    <div class="info_title info">
      <p>地区</p>
      <p>现有确诊</p>
      <p>确诊</p>
      <p>死亡</p>
      <p>治愈</p>
    </div>
    <div class="list" v-for="item in list" :key="item.id">
      <div class="p_box">
        <div class="info" @click="getShowChildren(item.id)">
          <p>{{item.name}}</p>
          <p>{{item.total.confirm - item.today.dead - item.today.heal}}</p>
          <p>
            <span>{{item.total.confirm}}</span>
            <span>较昨日{{item.today.confirm}}</span>
          </p>
          <p>{{item.total.dead}}</p>
          <p>{{item.total.heal}}</p>
        </div>

        <div v-if="showChildren">
          <div v-show="data.showChildren == item.id" class="children_box">
          <!-- 递归调用自组件 -->
          <List :list="item.children"></List>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.list_box{
  border: 1px solid #d1d1d1;
  margin: 1rem 0;
  .p_box{
    .children_box{
      margin-left: 1rem;
      .list_box{
        border: none;
      }
      .info_title{
        height: 30px;
        line-height: 30px;
      }
      p {
        &:nth-child(1){
          font-weight: 600;
          color: #999;
        }
      }
    }
  }
}
.info_title{
  font-weight: 600;
  color: #000;
  font-size: 16px;
  height: 50px;
  line-height: 50px;
  background: #d1d1d1;
}
.info{
  display: flex;
  justify-content: space-between;
  align-items: center;
  > p {
    width: 15%;
    text-align: center;
    white-space: nowrap;
    &:nth-child(1) {
      font-weight: 600;
      color: #000;
    }
    &:nth-child(2) {
      font-weight: 23%;
      color: red;
    }
    &:nth-child(3) {
      font-weight: 23%;
      span{
        display: block;
        &:last-child{
          color: #999;
        }
      }
    }
  }
}
.list{
  &:nth-of-type(odd){
    background-color: #f6f6f6;
  }
  .info{
    height: 60px;
    line-height: 60px;

    p {
      line-height: 20px;
    }
  }
}
</style>