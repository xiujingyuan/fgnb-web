<template>
  <div class="app-container">

    <!--筛选-->
    <div style="margin-top: 10px">
      <!--项目类型-->
      <el-select v-model="queryListForm.deviceType" placeholder="设备类型" @visible-change="getDeviceTypes">
        <el-option v-for="deviceType in deviceTypes" :label="deviceType.deviceTypeName" :value="deviceType.deviceTypeId">
          <svg-icon style="vertical-align: middle" v-if="deviceType.deviceTypeId === 1" icon-class="android"></svg-icon>
          <svg-icon style="vertical-align: middle" v-else icon-class="ios"></svg-icon>
          <span>{{ deviceType.deviceTypeName }}</span>
        </el-option>
      </el-select>
      <!--重置-->
      <el-button @click="clearSearch">重置</el-button>
    </div>

    <!--行-->
    <div style="margin-top: 10px" v-loading="loading">
      <el-row :gutter="20" v-for="i in Math.ceil(devices.length/countPerRow)">
        <!--列-->
        <el-col :span="6" v-for="device in devices.slice(i*countPerRow-countPerRow,i*countPerRow)">
          <el-card>
            <div slot="header">
              <span>{{ device.deviceName + '(' + device.deviceId + ')' }}</span>
            </div>
            <el-row :gutter="20">
              <el-col :span="12">
                <img width="100%" height="100%" :src="device.imgUrl">
              </el-col>
              <el-col :span="12">
                <div class="deviceinfo">安卓版本:<span class="deviceinfodetail">{{ device.systemVersion }}</span></div>
                <div class="deviceinfo">分辨率:<span class="deviceinfodetail">{{ device.resolution }}</span></div>
                <div class="deviceinfo">cpu:<span class="deviceinfodetail">{{ device.cpuInfo }}</span></div>
                <div class="deviceinfo">内存:<span class="deviceinfodetail">{{ device.memSize }}</span></div>
                <div class="deviceinfo">手机ip:<span class="deviceinfodetail">{{ device.phoneIp }}</span></div>
                <div class="deviceinfo">主机ip:<span class="deviceinfodetail">{{ device.agentIp }}</span></div>
              </el-col>
            </el-row>
            <el-row><div style="height: 5px"/></el-row>
            <el-row>
              <el-col :span="24">
                <el-button :type="btnType(device)" style="width: 100%" :disabled="isDisabled(device)" @click="jumpToDeviceControlPage(device)">{{ btnText(device) }}</el-button>
              </el-col>
            </el-row>
          </el-card>
          <div style="margin-bottom: 20px"/>
        </el-col>
      </el-row>
    </div>

    <!-- 分页 只有当所有条目大于每页的条目 才需要显示分页控件 -->
    <div align="center" style="margin-top: 10px" v-if=" total > queryListForm.countPerPage">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="queryListForm.pageIndex"
        :total="pages*10"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>

  </div>
</template>

<script>

  import {getDeviceList,deviceStart,getDeviceTypes} from '@/api/device'

  export default {
    watch:{
      queryListForm:{
        handler(){
          console.log('检测到请求form有变化')
          this.requestGetDeviceList()
        },
        deep:true
      }
    },
    data () {
      return {
        //筛选-设备类型
        deviceTypes:[],

        loading:true,
        devices:[],
        //一共有几页
        pages:null,
        //所有项目数
        total:0,
        countPerRow:4,//每行的个数

        queryListForm:{
          pageIndex:1,
          countPerPage:8,
          deviceType:null
        },
      }
    },
    methods:{
      //重置
      clearSearch(){
        this.queryListForm = {
          pageIndex:1,
          countPerPage:8,
          deviceType:null
        }
      },
      //点击分页
      handleCurrentChange(val){
        console.log('点击页码',val)
        this.queryListForm.pageIndex = val;
      },
      //获取设备类型
      getDeviceTypes(type){
        if(type===true){
          getDeviceTypes().then(resp=>{
            //获取成功
            this.deviceTypes = resp.data
          })
        }
      },
      //跳转到设备控制页面
      jumpToDeviceControlPage(device){

        var newWindows = window.open('','_blank','width=1920,height=1080')
        //先租用手机
        deviceStart(device.deviceId).then(resp=>{
          //租用成功
          //跳转到设备控制页面
          let routeData = this.$router.resolve({
            path:'/deviceController/index',
            query:{
              deviceId:device.deviceId,
              agentIp:device.agentIp
            }
          })
          newWindows.location.href = routeData.href
          //设备改为使用中
          device.status=2;
          //写入本地存储 这样就不用设置调试信息了
          localStorage.deviceId = device.deviceId
          localStorage.agentIp = device.agentIp
        }).catch(()=>{
          newWindows.close()
        })
      },
      //跳转按钮是否disable
      isDisabled(device){
        if(device.status !== 1){
          return true;
        }
        return false;
      },
      btnText(device){
        if(device.status === 1){
          return "立即使用"
        }else if(device.status===0){
          return "已离线"
        }else if(device.status===2){
          return (device.userName?("["+device.userName+"]"):'') + "使用中"
        }
      },
      btnType(device){
        if(device.status === 1){
          return "primary"
        }else if(device.status===0){
          return "info"
        }else if(device.status===2){
          return "danger"
        }
      },
      requestGetDeviceList(){
        //获取设备列表
        getDeviceList(this.queryListForm).then(resp=>{
          this.devices = resp.data.data
          this.total = resp.data.total
          this.pages = resp.data.pages
          console.log('devices',this.devices)
          this.loading = false;
        }).catch(()=>{
          this.loading = false;
        })
      }
    },
    created(){
      this.requestGetDeviceList()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .deviceinfodetail{
    color: #409EFF;
  }
  .deviceinfo{
    margin-bottom: 10px;
  }
  .el-card__header{
    background-color: aqua;
  }

</style>
