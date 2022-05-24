<script setup lang="ts">

import { onMounted, reactive, toRefs } from 'vue'
import {InteData,getData} from '../pageTs/index'
//引入组件
import List from './List.vue'
import ScrollCom from './ScrollCom.vue'

const data = reactive(new InteData())

//方法声明
const tabChange = (type:number)=>{
  data.type = type
}
const mapTypeChange = (mapType:number)=>{
  data.mapType = mapType
}

let page = 0
const getList = ()=>{
  if(page === data.areaTree.length -1) return
  page++
  data.showList.push(...data.areaTree[page])
}

const refresh = (fn:Function)=>{
  getData(data).then(()=>{
    page = 0
    fn()
  })
}

//hook调用
onMounted(()=>{
  getData(data)  
})
const {showList,chinaTotal,zjData,china , areaTree} = toRefs(data)


</script>

<template>
<!-- 头部数据展示部分 -->
  <div class="box">
    <div class="top_box">
      <img src="../assets/bg.png" class="bg_img">
      <div class="title-text">
        <h2>科学防护 共渡难关</h2>
        <h3>肺炎疫情实时动态播报</h3>
      </div>

      <div v-if="chinaTotal.total" class="cover_cards">
        <div class="cover_tab">
          <div :class="{active:data.type===1}" @click="tabChange(1)" >全国疫情数据(含港澳台)</div>
          <div :class="{active:data.type===2}" @click="tabChange(2)">浙江疫情数据</div>
        </div>

        <div v-show="data.type === 1" class="cover_info">
          <div>
            <h4>境外输入</h4>
            <p>{{chinaTotal.total.input}}</p>
            <p>
              <span>较昨日</span>
              <span>+{{chinaTotal.today.input}}</span>
            </p>
          </div>
          <div>
            <h4>无症状感染者</h4>
            <p>{{chinaTotal.extData.noSymptom}}</p>
            <p>
              <span>较昨日</span>
              <span>+{{chinaTotal.extData.incrNoSymptom}}</span>
            </p>
          </div>
          <div>
            <h4>现有确诊</h4>
            <p>{{chinaTotal.total.confirm - chinaTotal.today.dead - chinaTotal.today.heal}}</p>
            <p>
              <span>较昨日</span>
              <span>+{{chinaTotal.today.storeConfirm}}</span>
            </p>
          </div>
          <div>
            <h4>累计确诊</h4>
            <p>{{chinaTotal.total.confirm}}</p>
            <p>
              <span>较昨日</span>
              <span>+{{chinaTotal.today.confirm}}</span>
            </p>
          </div>
          <div>
            <h4>累计死亡</h4>
            <p>{{chinaTotal.total.dead}}</p>
            <p>
              <span>较昨日</span>
              <span>+{{chinaTotal.today.dead}}</span>
            </p>
          </div>
          <div>
            <h4>累计治愈</h4>
            <p>{{chinaTotal.total.heal}}</p>
            <p>
              <span>较昨日</span>
              <span>+{{chinaTotal.today.heal}}</span>
            </p>
          </div>
        </div>
        <div v-show="data.type === 2" class="cover_info">
          <div>
            <h4>累计确诊</h4>
            <p>{{zjData.total.confirm}}</p>
            <p>
              <span>较昨日</span>
              <span>+{{zjData.today.confirm}}</span>
            </p>
          </div>
          <div>
            <h4>累计死亡</h4>
            <p>{{zjData.total.dead}}</p>
            <p>
              <span>较昨日</span>
              <span>+{{zjData.today.dead}}</span>
            </p>
          </div>
          <div>
            <h4>累计治愈</h4>
            <p>{{zjData.total.heal}}</p>
            <p>
              <span>较昨日</span>
              <span>+{{zjData.today.heal}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- echarts部分 -->

    <!-- 疫情地图部分  -->
    <div class="data_map content">
      <h3>中国疫情</h3>
      <div class="map_box">
        <div
          id="map"
          v-show="data.mapType === 1"
        ></div>
        <div
          id="map2"
        ></div>
      </div>
      <div class="map_btn">
        <div @click="mapTypeChange(1)" :class="{active:data.mapType === 1}">
          现有确诊
        </div>
        <div @click="mapTypeChange(2)" :class="{active:data.mapType === 2}">
          累计确诊
        </div>
      </div>
    </div>

    <!-- 全国疫情新增趋势部分 -->
    <div class="data_line">
      <h3>全国疫情现有确诊新增趋势</h3>
      <div id="line"></div>
    </div>

    <!-- 列表部分 -->
    <div class="data_list">
      <h3>中国病例</h3>
      <List v-if="china.length > 0" :showChildren="true" :list="china" :msg="'中国病例'"></List>
    </div>
    <div class="data_list">
      <h3>世界病例</h3>
      <!-- 世界病例不使用递归取子数据 -->
      <ScrollCom :distance="100" :isScroll="true" @getList="getList" @refresh="refresh">
        <List v-if="areaTree.length > 0" :showChildren="false" :list="showList" :msg="'世界病例'"></List>
      </ScrollCom>
    </div>
  </div>
</template>

<style scoped lang="scss">


.top_box{
  position: relative;
  .bg_img{
    width: 100%;
    // height: 200px;
  }
  .title-text{
    position: absolute;
    top: 20px;
    left: 1rem;
    color: #fff;
  }

  .cover_cards{
    position: absolute;
    top: 140px;
    background: #fff;
    border-radius: 20px;
    width: calc(100% - 2rem);
    left: 1rem;
    overflow: hidden;
    box-shadow: 0 20px 20px rgb(0 0 0/10%);

    >div{
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      &.cover_tab{
        >div{
          width: 50%;
          background: #efefef;
          text-align: center;
          height: 40px;
          line-height: 40px;
          &.active{
          background: #fff;
          }
        }
      }

      &.cover_info{
        >div{
          width: 33%;
          text-align: center;
          margin: 10px 0px;
        }
      }
    }
  }
}
// 地图部分样式
.data_map,
.data_list {
  margin-top: 20px;
  overflow: hidden;
  h3{
    border-left: 8px solid #e10000;
    padding-left: 1em;
  }
}
.content{
}
.map_box{
  display: flex;
  width: 200%;
}
#line,
#line1,
#line2{
  height: 400px;
  width: 100%;
}

#map,
#map2{
  height: 400px;
  width: 100%;
}
#map{
  margin-right: 2rem;
}
.map_btn,
.line_btn{
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    width: 45%;
    height: 40px;
    line-height: 40px;
    border: 1px solide #d2d2d2;
    box-shadow: 0 5px 7px 1px rgb(0  0 0 / 5%);
    border-radius: 5px;
    text-align: center;
    &.active{
      border-color: #ce4733;
      background-color: #fef7f7;
      color: #ce2c1e;
    }
  }
}
.map_btn{
  margin-top: 50px;
}
.line_btn{
  >div{
    width: 30%;
    height: 55px;
    line-height: 25px;
    padding-top: 5px;
  }
}
.data_list{
  margin-top: 20px;
}
//折线图部分样式
.data_line{
  margin-top: 20px;
}

#line{
  margin-left: 10px;
}
</style>
