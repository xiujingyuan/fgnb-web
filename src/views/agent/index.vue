<template>
  <div class="app-container">
    <el-button style="margin-bottom: 5px" icon="el-icon-refresh" size="mini" @click="getOnlineAgents"></el-button>
    <el-table :data="agents" highlight-current-row border>
      <el-table-column label="状态" align="center" width="100">
        <template scope="scope">
          <div class="circle"></div>
        </template>
      </el-table-column>
      <el-table-column label="agent" align="center" width="200">
        <template scope="scope">
          {{ scope.row.agentIp + ":" + scope.row.agentPort }}
        </template>
      </el-table-column>
      <el-table-column label="调试web" align="center" width="150">
        <template scope="scope">
          <el-button @click="debugWeb(scope.row)" type="primary" size="mini">调试web</el-button>
        </template>
      </el-table-column>
      <el-table-column label="chromedriver端口" prop="chromeDriverPort" align="center" width="150"></el-table-column>
      <el-table-column label="设备" align="center">
        <template scope="scope">
          <el-table :data="scope.row.devices" size="mini">
            <el-table-column label="设备名" prop="deviceName" align="center"></el-table-column>
            <el-table-column label="设备id" prop="deviceId" align="center"></el-table-column>
            <el-table-column label="设备状态" align="center">
              <template scope="scope1">
                {{ scope1.row.status === 1 ? "在线闲置":"使用中" }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

  import {listOfOnline} from '@/api/agent'

export default {
  data(){
    return {
      agents:[]
    }
  },
  methods:{
    getOnlineAgents(){
      listOfOnline().then(resp=>{
        this.agents = resp.data
      })
    },
    debugWeb(row){
      localStorage.agentIp = row.agentIp
      localStorage.port = row.chromeDriverPort
      this.$notify.success('选择'+row.agentIp+'调试web')
    }
  },
  created(){
    this.getOnlineAgents()
  }
}
</script>

<style scoped>
  .circle {
    margin: 0 auto;
    width: 10px;
    height: 10px;
    background-color:#42b983;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
  }
</style>
