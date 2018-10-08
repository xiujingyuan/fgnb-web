<template>
  <div class="app-container">
    <div>
      <el-select v-model="queryListForm.status" placeholder="执行状态" clearable>
        <el-option label="执行中" :value="0"></el-option>
        <el-option label="执行完成" :value="1"></el-option>
      </el-select>
      <el-select v-model="queryListForm.creatorUid" @visible-change="selectCommitter" placeholder="提交人" clearable>
        <el-option v-for="user in userList" :label="user.nickname" :value="user.userId"></el-option>
      </el-select>
      <el-button type="primary" @click="query">查询</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table :data="testTaskList" border>
        <el-table-column label="开始时间" prop="startTime" align="center"></el-table-column>
        <el-table-column label="结束时间" prop="endTime" align="center"></el-table-column>
        <el-table-column label="测试任务" prop="testTaskName" align="center"></el-table-column>
        <el-table-column label="任务描述" prop="description" align="center"></el-table-column>
        <el-table-column label="测试计划" prop="testPlanName" align="center"></el-table-column>
        <el-table-column label="用例分发策略" align="center">
          <template scope="scope">
            {{ runMode(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="执行状态" align="center">
          <template scope="scope">
            <el-tag :type="statusTagType(scope.row)" v-html="statusText(scope.row)"></el-tag>
          </template>
        </el-table-column>
        <el-table-column label="提交人" prop="creatorName" align="center"></el-table-column>
        <el-table-column label="测试报告" align="center">
          <template scope="scope">
            <!--测试完成才显示-->
            <div v-if="scope.row.status === 1"><el-button type="success" size="mini" @click="goToReportPage(scope.row)">查看</el-button></div>
          </template>
        </el-table-column>
      </el-table>
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


  import {queryList} from '@/api/testTask'
  import {queryUserList} from '@/api/user'

  let projectId =  localStorage.getItem("projectId")?parseInt(localStorage.getItem("projectId")):null

  export default {
    data() {
      return {
        queryListForm:{
          pageIndex:1,
          countPerPage:10,
          projectId: projectId
        },
        //一共有几页
        pages:null,
        //所有page数
        total:0,

        testTaskList:[],
        userList:[]
      };
    },
    computed:{
      runMode() {
        return function (row) {
          if(row.runMode == 1){
            return '兼容模式'
          }else if(row.runMode == 2){
            return '高效模式'
          }else{
            return '-'
          }
        }
      },
      statusTagType() {
        return function (row) {
          //status 0：执行中 1：执行结束
          if(row.status === 0){
            return 'danger'
          }else if(row.status === 1){
            return 'success'
          }
        }
      },
      statusText(){
        return function (row) {
          if(row.status === 0){
            return '<i class="el-icon-loading"></i>执行中'
          }else if(row.status === 1){
            return '执行完成'
          }else{
            return '未知'
          }
        }
      },

    },
    methods: {
      selectCommitter(type){
        if(type){
          queryUserList().then(resp=>{
            this.userList = resp.data
          })
        }
      },
      query(){
        //把页码重置为1
        this.queryListForm.pageIndex = 1
        this.requestQueryList()
      },
      //跳转到报告页面
      goToReportPage(row){
        this.$router.push({ name: 'Report',params: {testTaskId:row.testTaskId} })
      },
      requestQueryList(){
        queryList(this.queryListForm).then(resp=>{
          this.testTaskList = resp.data.data
          this.total = resp.data.total
          this.pages = resp.data.pages
        })
      },
      //点击分页
      handleCurrentChange(val){
        console.log('点击页码',val)
        this.queryListForm.pageIndex = val;
        this.requestQueryList()
      },


    },
    created(){
      this.requestQueryList()
    }
  }
</script>
