<template>
  <div style="padding:20px">

    <el-card>
      <el-row>
        <!--左侧画布部分-->
        <el-col :span="leftSpan">
          <el-row>
            <!--左侧画布-->
            <el-row>
              <div align="center">
                <canvas id="canvas1"></canvas>
              </div>
            </el-row>
            <el-row>
              <div style="margin-top: 10px" align="center">
                <el-button @click="goMenu()" type="primary" size="mini">Menu</el-button>
                <el-button @click="goHome()" type="danger" size="mini">Home</el-button>
                <el-button @click="goBack()" type="success" size="mini">Back</el-button>
                <el-button @click="goPower()" type="danger" size="mini">Power</el-button>
                <el-button @click="dumpCurrentPage()" type="primary" size="mini" icon="el-icon-search"></el-button>
                <el-button @click="changeSimpleMode()" type="primary" size="mini">精简</el-button>
              </div>
            </el-row>
          </el-row>
        </el-col>
        <!--右侧部分-->
        <el-col :span="16" v-if="!simpleMode">
          <!--设备信息-->
          <el-row>
            <el-card>
              <el-table :data="deviceInfo" border style="width: 100%">
                <el-table-column prop="deviceId" label="序列号" align="center"></el-table-column>
                <el-table-column prop="deviceName" label="设备名称" align="center"></el-table-column>
                <el-table-column prop="memSize" label="内存大小" align="center"></el-table-column>
                <el-table-column prop="resolution" label="分辨率" align="center"></el-table-column>
                <el-table-column prop="systemVersion" label="安卓版本" align="center"></el-table-column>
                <el-table-column prop="phoneIp" label="手机ip" align="center"></el-table-column>
                <el-table-column prop="agentIp" label="主机ip" align="center"></el-table-column>
              </el-table>
            </el-card>
          </el-row>
          <!--minicap/touch/adbkit/uiautomator2信息-->
          <el-row style="margin-top: 20px">
            <el-card>
              <div style="margin-bottom: 10px"><el-tag type="success">minitouch</el-tag><span id="minitouch_msg"></span></div>
              <div style="margin-bottom: 10px"><el-tag type="warning">minicap</el-tag><span id="minicap_msg"></span></div>
              <div style="margin-bottom: 10px"><el-tag type="danger">uiautomator2 server</el-tag><span id="uiautomator2_msg"></span></div>
              <div><el-tag>adbkit</el-tag><span>{{ adbkitMsg }}</span></div>
            </el-card>
          </el-row>
          <!--安装APP-->
          <el-row style="margin-top: 20px">
            <el-card>
              <el-upload
                drag
                action="/"
                :on-change="onChange"
                :multiple="false"
                :auto-upload="false">
                <i class="el-icon-upload"></i>
                <div>将apk拖到此处，或<em>点击选择apk</em></div>
              </el-upload>
              <el-button style="margin-top: 15px" @click="installApp()" type="primary" :loading="installBtnLoading">{{installBtnText}}</el-button>
            </el-card>
          </el-row>
          <!--开启远程调试-->
          <el-row style="margin-top: 20px">
            <el-card>
              <el-button @click="startRemoteAdb" :type="remoteAdbBtnType">{{ remoteAdbText }}</el-button>
              <el-tag type="success" style="margin-left: 15px">{{ remotedebugDesc }}</el-tag>
            </el-card>
          </el-row>

        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>

  import {findByDeviceId} from '@/api/device'
  import { mapGetters } from 'vuex'

  export default {
    computed:{
      ...mapGetters([
        'name'
      ]),
    },
    data () {
      return {
        leftSpan:8,
        //精简模式
        simpleMode: false,

        remotedebugDesc:'开启远程调试后，你可以使用adb connect来连接调试设备',
        adbkitPort:-1,
        adbKitWs:null,
        remoteAdbBtnType:'primary',
        remoteAdbText: '开启远程调试',
        adbkitMsg:'',
        //是否已经adb远程调试
        isConnectedDebug:false,

        installBtnLoading:false,
        installBtnText:'安装APP',
        deviceId: this.$route.query.deviceId,
        agentIp: this.$route.query.agentIp,

        choosedFile:null,
        deviceInfo:[],

        canvas:null,
        minicapWebsocket:null,
        minitouchWebsocket:null,

        isMouseDown:false,

        menu:{
          udid:this.deviceId,
          operation: 'menu'
        },
        home:{
          udid:this.deviceId,
          operation: 'g'
        },
        back:{
          udid:this.deviceId,
          operation: 'b'
        },
        power:{
          udid:this.deviceId,
          operation: 'p'
        },
        touchDown:{
          udid:this.deviceId,
          operation: 'd',
          index: 0,
          pX: 0.5,
          pY: 0.5,
          pressure: 50
        },
        touchMove:{
          udid:this.deviceId,
          operation: 'm',
          index: 0,
          pX: 0.5,
          pY: 0.5,
          pressure: 50
        },
        touchUp:{
          'udid':this.deviceId,
          'operation': 'u',
          'index': 0
        }
      }
    },
    methods:{
      changeSimpleMode(){
        if(!this.simpleMode){
          this.leftSpan = 24
          //不是精简模式 改变窗口大小
          window.resizeTo(550, 950)
          //移动到右上角
          window.moveTo(window.screen.width,0)
        }else{
          this.leftSpan = 8
          window.resizeTo(1920,1080)
        }
        this.simpleMode = !this.simpleMode
      },
      //dump当前页面 打开一个新的浏览器窗口 获取布局
      dumpCurrentPage(){
        this.$router.push({ name: 'AndroidDump',query: {deviceId: this.deviceId,agentIp:this.agentIp} })
      },
      //开启远程adb
      startRemoteAdb(){
        if(!this.isConnectedDebug){
          this.adbKitWs = new WebSocket('ws://'+this.agentIp+':10002/remotedebug/'+this.deviceId)

          this.adbKitWs.onopen = function () {
            this.adbkitMsg = '已连接adbkit websocket'
          }

          this.adbKitWs.onmessage = (resp) => {
            if(resp.data.startsWith("开启手机远程调试成功")){
              this.adbkitPort = (resp.data.split(":")[1]).split(",")[0];
              this.remoteAdbText = '关闭远程调试'
              //正在调试中...
              this.isConnectedDebug = true
              this.remoteAdbBtnType = 'danger'
              this.remotedebugDesc = '你现在可以使用adb connect '+this.agentIp+":"+this.adbkitPort+"来远程调试设备";
            }
            this.adbkitMsg = resp.data;
          }

          this.adbKitWs.onclose = () => {
            this.adbkitMsg = 'adbkit websocket closed'
            this.remoteAdbText = '开启远程调试'
            this.remoteAdbBtnType = 'primary'
            this.remotedebugDesc = '开启远程调试后，你可以使用adb connect来连接调试设备'
          }
        }else{
          //正在调试中
          if(this.adbKitWs!=null){
            this.adbKitWs.send("关闭webkit socket")
            this.isConnectedDebug = false
          }
        }

      },
      //选择apk
      onChange(file){
        this.choosedFile = file;
      },
      //点击安装APP按钮
      installApp(){
        //是否选择了一个文件
        if(this.choosedFile==null){
          this.$notify.error('请选择一个app')
          return;
        }
        //选择的文件是否以apk结尾
        var app = this.choosedFile.raw;
        if(!app.name.endsWith('.apk')){
          this.$notify.error('请选择apk文件')
          return;
        }
        this.installBtnText = '安装中...'
        this.installBtnLoading = true;
        var ws = new WebSocket('ws://'+this.agentIp+':10002/upload/'+this.deviceId)
        ws.onopen =  () => {
          //分片发送apk文件 一次200M
          var slicesize = 200*1024*1024 //一片大小
          var start = 0
          var end = 0
          var sendCount = Math.ceil(app.size/slicesize) //发送的次数
          for(let i = 1;i<=sendCount;i++){
            if(i===sendCount){
              //最后一次
              end = app.size;
            }else{
              //不是最后一次
              end = start + slicesize
            }
            var reader = new FileReader()
            console.log(start+'->'+end)
            var oneslice = app.slice(start,end)
            reader.readAsArrayBuffer(oneslice)
            reader.onload = function(evt) {
              console.log(evt)
              var binaryString = evt.target.result;
              //发送文件
              ws.send(binaryString);
            }
            start = start + slicesize
          }
        }
        ws.onmessage = (resp) => {
          this.$notify.info(resp.data)
        }
        ws.onclose =  () => {
          this.installBtnText = '安装APP'
          this.installBtnLoading =false;
          this.$notify.info('apk socket close')
        }
      },
      //点击menu
      goMenu() {
        this.minitouchWebsocket.send(JSON.stringify(this.menu))
      },
      //点击home
      goHome() {
        this.minitouchWebsocket.send(JSON.stringify(this.home))
      },
      //点击back
      goBack() {
        this.minitouchWebsocket.send(JSON.stringify(this.back))
      },
      //点击power
      goPower(){
        this.minitouchWebsocket.send(JSON.stringify(this.power))
      },
      //在X轴 占的比例  比如点击画布水平中心 则返回0.5
      getX(event){
        var offx = event.offsetX;
        var canvasWidth = this.canvas.offsetWidth;
        return offx/canvasWidth
      },
      //在Y轴 占的比例  比如点击画布垂直中心 则返回0.5
      getY(event){
        var offy = event.offsetY;
        var canvasHeight = this.canvas.offsetHeight;
        return offy/canvasHeight
      }
    },
    created(){
      //获取设备信息
      findByDeviceId(this.deviceId).then(resp=>{
        this.deviceInfo.push(resp.data);
      })
    },
    mounted(){

      var loading = this.$loading({ fullscreen: true })

      var canvas = document.getElementById('canvas1')
      var minitouch_msg = document.getElementById("minitouch_msg")

      var minicap_msg = document.getElementById("minicap_msg")
      var uiautomator2_msg = document.getElementById("uiautomator2_msg")

      this.canvas = canvas;
      var g = canvas.getContext('2d')

      //uiautomator2 server
      var uiautomator2Websocket = new WebSocket("ws://"+this.agentIp+":10002/uiautomator2server/"+this.deviceId)
      uiautomator2Websocket.onmessage = (message)=>{
        if(message.data.indexOf('开启uiautomator2 server成功')!=-1){
          //开启UIautomator端口成功,将端口写入localStorage
          let msg = message.data
          let port = msg.substring(msg.indexOf('端口为:')+4,msg.indexOf(',sessionid'))
          localStorage.setItem("port",port)
        }
        uiautomator2_msg.innerHTML = message.data
      }
      uiautomator2Websocket.onclose = ()=> {
        uiautomator2_msg.innerHTML = "uiautomator2 websocket closed"
      }

      //minicap
      var BLANK_IMG =
        'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
      var minicapWebsocket = new WebSocket("ws://"+this.agentIp+":10002/minicap/"+this.deviceId+'/'+this.name)
      this.minicapWebsocket = minicapWebsocket

      minicapWebsocket.binaryType = 'blob'
      minicapWebsocket.onclose = function() {
        minicap_msg.innerHTML = 'minicap websocket closed'
        loading.close();
      }
      minicapWebsocket.onerror = function() {
        minicap_msg.innerHTML = 'minicap websocket error'
      }

      minicapWebsocket.onmessage = (message) => {
        if(typeof message.data === 'string'){
          minicap_msg.innerHTML = message.data
          //当收到信息’minicap图片数据处理中‘则认为加载完成 取消loading
          if(message.data.startsWith("minicap图片数据处理中")){
            loading.close()
          }else if(message.data.indexOf('稍后重试')!==-1){
            //当收到’稍后重试‘ 则弹窗提示，且弹窗无法被关闭
            loading.close()
            this.$alert(message.data,'warning',{
              showConfirmButton:false,
              showClose: false,
            })
          }
        }else{
          //图片二进制数据 实时显示
          var blob = new Blob([message.data], {type: 'image/jpeg'})
          var URL = window.URL || window.webkitURL
          var img = new Image()
          img.onload = function() {
            canvas.width = img.width
            canvas.height = img.height
            g.drawImage(img, 0, 0)
            img.onload = null
            img.src = BLANK_IMG
            img = null
            u = null
            blob = null
          }
          var u = URL.createObjectURL(blob)
          img.src = u
        }
      }
      minicapWebsocket.onopen = () => {
        minicap_msg.innerHTML = 'minicap onopen'
      }

      //minitouch
      var minitouchWebsocket = new WebSocket("ws://"+this.agentIp+":10002/minitouch/"+this.deviceId)
      this.minitouchWebsocket = minitouchWebsocket
      minitouchWebsocket.onmessage = function (message) {
        minitouch_msg.innerHTML = message.data
      }
      minitouchWebsocket.onclose = function () {
        minitouch_msg.innerHTML = "minitouch websocket closed"
      }
      minitouchWebsocket.onerror = function() {
        minitouch_msg.innerHTML = 'minitouch websocket error'
      }
      minitouchWebsocket.onopen = function () {
        minitouch_msg.innerHTML = 'minitouch onopen'
      }

      this.isMouseDown = false;
      var touchDown = this.touchDown;
      //当鼠标处于按下的状态 移出画布 这个时候体验不好，需要在移出的时候，将发送鼠标抬起事件  并将鼠标状态设为抬起
      canvas.onmouseleave = () => {
        //当鼠标按下状态 移出canvas时 提交touchup
        if(this.isMouseDown){
          minitouchWebsocket.send(JSON.stringify(this.touchUp))
          //将鼠标设为未按下状态
          this.isMouseDown = false;
        }
      }
      //当鼠标按下时，将按下的XY坐标发送给服务器处理，XY坐标为相对比例，如：0.5,0.5 则代表屏幕中心
      canvas.onmousedown =  (e) => {
        this.isMouseDown = true;
        touchDown.pX = this.getX(e);
        touchDown.pY = this.getY(e);
        minitouchWebsocket.send(JSON.stringify(touchDown))
      }
      //鼠标抬起
      canvas.onmouseup = ()=> {
        this.isMouseDown = false;
        minitouchWebsocket.send(JSON.stringify(this.touchUp))
      }
      var touchMove = this.touchMove
      //鼠标移动
      canvas.onmousemove = (e) => {
        //鼠标按下 才发送移动事件  防止在画布上移动鼠标 也发送移动事件
        if(this.isMouseDown){
          touchMove.pX = this.getX(e);
          touchMove.pY = this.getY(e);
          minitouchWebsocket.send(JSON.stringify(touchMove))
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
