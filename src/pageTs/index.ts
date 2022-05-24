import type { IData } from "../type";
import axios from 'axios'
import * as echarts from 'echarts';
import chinaJson from '../assets/china.json'
type EChartsOption = echarts.EChartsOption;
//对属性进行约束
class InteData implements IData{
    name: string = '';
    areaTree: any[]= [];
    chinaDayList: any[]= [];
    chinaTotal: any = {};
    china: any= {};
    zjData: any;
    type: number = 1;
    mapType: number = 1;
    lineType: number = 1;
    lastUpdateTime: string = '';
    showList: any[] = [];
}

const getData = async (data:InteData)=>{
  //获取地图dom
  var mapDom:HTMLElement = document.getElementById('map')!
  var mapDom2:HTMLElement = document.getElementById('map2')!
  //获取折线图dom
  var lineDom = document.getElementById('line')!
  //对元素初始化
  var myMap = echarts.init(mapDom as HTMLElement)
  var myMap2 = echarts.init(mapDom2 as HTMLElement)
  var myline = echarts.init(lineDom as HTMLElement)

  //没数据时加载loading界面
  myMap.showLoading()
  myline.showLoading()
  //地图中现有确诊的配置
  var optionMap:EChartsOption = {
    tooltip:{ //提示框
      trigger: "item", //触发类型
      formatter: "现有确诊病例<br/>{b}: {c}" //提示漂浮内容
    },
    visualMap:[{
      type:'piecewise',
      show:true,
      splitNumber:4,
      pieces:[
        {min:15000},
        {min:900,max:15000},
        {min:310,max:900},
        {min:200,max:310},
        {min:0,max:200},
      ],
      align:'right',
      left:0,
      top:280,
      inRange:{
        color:['#ffc0b1','#9c0505']
      }
    }]
  }
  //地图中累计确诊的配置
  var optionMap2:EChartsOption = {
    tooltip:{ //提示框
      trigger: "item", //触发类型
      formatter: "累计确诊病例<br/>{b}: {c}" //提示漂浮内容
    },
    visualMap:[{
      type:'piecewise',
      show:true,
      splitNumber:4,
      pieces:[
        {min:15000},
        {min:900,max:15000},
        {min:310,max:900},
        {min:200,max:310},
        {min:0,max:200},
      ],
      align:'right',
      left:0,
      top:280,
      inRange:{
        color:['#ffc0b1','#9c0505']
      }
    }]
  }
  //地图配置中series属性
  var series = {
    type:'map',
    map:'china',
    colorBy: 'series',
    zoom: 1.2,
    top: 40,
    label:{
      show: true,
      color: '#333',
      fontSize:10
    },
    itemStyle:{
      borderColor:"green"//每个省份边界颜色
    },
    emphasis:{
      color:"#fff",
      itemStyle:{
        areaColor:"#83b5e7"
      }
    }

  }
  //折线图配置
  var optionLine:EChartsOption = {
    xAxis: {
      type: 'category'
    },
    yAxis: {
      type: 'value'
    },
    tooltip: {
      show:true,
      trigger:'axis',
      formatter: '{b} 日</br>新增确诊人数：{c}'
    }
  } 

  //实现对areaTree拆解
  const getPageList = ((list:any[])=>{
    const arr:Array<any[]>[] = []
    for(let i = 0 ; i < list.length; i+=30){
      arr.push(list.slice(i,i+30))
    }
    return arr
  })



  echarts.registerMap('china',(chinaJson as any))

  let res = await axios('/api/ug/api/wuhan/app/data/list-total?t=330415245809')
  
    console.log(res)
    data.areaTree = getPageList(res.data.data.areaTree)
    data.showList = data.areaTree[0]
    console.log(data.areaTree)
    data.chinaDayList = res.data.data.chinaDayList
    data.chinaTotal = res.data.data.chinaTotal
    //使用find方法来查找满足条件的第一个元素的值
    data.china = res.data.data.areaTree.find( (v:any) => v.id==='0').children
    data.zjData  = data.china.find( (v:any) => v.name === '浙江' )
    //存放现有确诊人数的数组
    let mapData:any[] = []
    //从data中取出地区名和现有确诊人数
    data.china.map((v:any)=>{
      mapData.push({
        name:v.name,
        value:v.total.confirm - v.total.dead - v.total.heal || 0
      })
    })
    //存放累计确诊人数
    let mapData2:any[] = []
    //从data中取出地区名和现有确诊人数
    data.china.map((v:any)=>{
      mapData2.push({
        name:v.name,
        value:v.total.confirm || 0
      })
    })
    //存放疫情新增人数趋势
    //取出日期
    let lineDataDate:any[] = []
    data.chinaDayList.map((v:any)=>{
      lineDataDate.push([v.date])
    })
    //取出数量
    let lineDataToday:any[] = []
    data.chinaDayList.map((v:any)=>{
      lineDataToday.push(v.today.confirm)
    })
    //取到数据时关闭loading页面
    myMap.hideLoading()
    myline.hideLoading()

    //设定配置
    myMap.setOption({//通过解构变为一个对象
      ...optionMap,
      series:{
        ...series,
        data:mapData
      }
    })

    myMap2.setOption({//通过解构变为一个对象
      ...optionMap2,
      series:{
        ...series,
        data:mapData2
      }
    })

    myline.setOption({
      ...optionLine,
      xAxis:{
        data: lineDataDate
      },
      series:[{
        data: lineDataToday,
        type: 'line'
      }]
    })


}

export{
    InteData,
    getData
}