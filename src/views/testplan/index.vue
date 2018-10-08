<template>
  <div class="app-container">
    <el-row>
      <TestPlanBeforeAction></TestPlanBeforeAction>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-tabs type="border-card" v-model="activeTab">
        <el-tab-pane label="测试计划列表" name="测试计划列表">
          <TestPlanList ref="TestPlanList" :project-id="projectId" @updateTestPlanBtnClicked="updateTestPlanBtnClicked"></TestPlanList>
        </el-tab-pane>
        <el-tab-pane label="添加测试计划" name="添加测试计划">
          <SaveTestPlan :is-add="true" :project-id="projectId" :action-type="4" @saveTestPlanSuccess="saveTestPlanSuccess"></SaveTestPlan>
        </el-tab-pane>
        <el-tab-pane label="修改测试计划" name="修改测试计划">
          <SaveTestPlan :test-plan-id="testPlanIdOfUpdate" :is-add="false" :project-id="projectId"  :action-type="4" @saveTestPlanSuccess="saveTestPlanSuccess"></SaveTestPlan>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>

  import TestPlanBeforeAction from './action/TestPlanBeforeAction'
  import TestPlanList from './TestPlanList'
  import SaveTestPlan from './SaveTestPlan'

  export default {
    components:{
      TestPlanBeforeAction,
      SaveTestPlan,
      TestPlanList
    },
    data() {
      return {
        projectId: localStorage.getItem("projectId")?parseInt(localStorage.getItem("projectId")):null,
        //默认激活 测试计划列表 tab
        activeTab:'测试计划列表',
        //待更新的测试计划id
        testPlanIdOfUpdate:null
      }
    },
    methods: {
      //计划列表 点击了修改
      updateTestPlanBtnClicked(testPlanId){
        this.testPlanIdOfUpdate = testPlanId
        //切换到修改tab
        this.activeTab = '修改测试计划'
      },
      //保存测试计划成功
      saveTestPlanSuccess(){
        //刷新testplan列表
        this.$refs.TestPlanList.requestGetTestPlansByProjectId()
      }
    }
  }
</script>
