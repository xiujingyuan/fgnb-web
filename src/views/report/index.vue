<template>
  <div style="padding: 20px;font-size: 30px">
    <el-card>
      <span slot="header" style="font-weight: 900">
        概况
      </span>
      <el-table :data="tableData" border>
        <el-table-column label="项目类型" align="center">
          <template scope="scope">
            <svg-icon v-if="scope.row.projectType === 1" icon-class="android"></svg-icon>
            <svg-icon v-else-if="scope.row.projectType === 2" icon-class="ios"></svg-icon>
            <svg-icon v-else icon-class="web"></svg-icon>
          </template>
        </el-table-column>
        <el-table-column label="项目" prop="projectName" align="center"></el-table-column>
        <el-table-column label="测试任务" prop="testTaskName" align="center"></el-table-column>
        <el-table-column label="任务提交人" prop="creatorName" align="center"></el-table-column>
        <el-table-column label="开始时间" prop="startTime" align="center"></el-table-column>
        <el-table-column label="结束时间" prop="endTime" align="center"></el-table-column>
        <el-table-column label="通过用例数" prop="passCount" align="center"></el-table-column>
        <el-table-column label="失败用例数" prop="failCount" align="center"></el-table-column>
        <el-table-column label="跳过用例数" prop="skipCount" align="center"></el-table-column>
        <el-table-column label="通过率" prop="passPercent" align="center"></el-table-column>
      </el-table>
    </el-card>

    <el-card style="margin-top: 10px">
      <span slot="header" style="font-weight: 900">
        详细信息
      </span>
      <el-tabs>
        <div style="padding: 10px">
          <el-tab-pane v-for="deviceReportInfo in reportData.deviceReportInfos">
            <span slot="label">
              <i class="el-icon-mobile-phone"></i> {{ deviceReportInfo.deviceId }}
            </span>
            <div style="padding: 10px">
              <testcase :data="deviceReportInfo.deviceTestCaseInfos"></testcase>
            </div>
          </el-tab-pane>
        </div>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import {getReportData} from '@/api/testTaskReport'
  import testcase from "./testCase";

  export default {
    data() {
      return {
        testTaskId: this.$route.params.testTaskId,
        reportData:{},
        tableData:[],
      };
    },
    components:{
      testcase
    },
    methods: {
      beforeSuiteConvertToTestCase(beforeSuite){
        var arr = []
        arr.push(beforeSuite)
        return arr
      }
    },
    created(){
      getReportData(this.testTaskId).then(resp=>{
        this.reportData = resp.data
        this.tableData.push({
          projectName: this.reportData.projectName,
          projectType: this.reportData.projectType,
          testTaskName: this.reportData.testTaskName,
          creatorName: this.reportData.creatorName,
          startTime: this.reportData.startTime,
          endTime: this.reportData.endTime,
          passCount: this.reportData.passCount,
          failCount:this.reportData.failCount,
          skipCount: this.reportData.skipCount,
          passPercent: (Math.round(this.reportData.passCount / (this.reportData.passCount+this.reportData.failCount+this.reportData.skipCount) * 10000) / 100.00 + "%")
        })
      })
    }
  }
</script>
