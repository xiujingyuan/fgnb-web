<template>
    <div>
      <el-table :data="testPlanList" border>
        <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
        <el-table-column label="测试计划" align="center" prop="testPlanName"></el-table-column>
        <el-table-column label="描述" align="center" prop="description"></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
        <el-table-column label="创建人" align="center" prop="creatorNickname"></el-table-column>
        <el-table-column label="更新人" align="center" prop="updatorNickname"></el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template scope="scope">
            <el-button size="small" type="success" @click="commitTestPlan(scope.row)">提交测试</el-button>
            <el-button size="small" type="primary" @click="clickUpdateBtn(scope.row)">修改</el-button>
            <el-button size="small" type="danger" @click="deleteTestPlan(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <CommitTestPlanDialog ref="CommitTestPlanDialog" :project-id="projectId" :test-plan-id="testPlanIdOfCommitTest"></CommitTestPlanDialog>
    </div>
</template>

<script>

  import { findTestPlansByProjectId,deleteTestPlan,findTestPlanInfoVoByTestPlanId} from '@/api/testPlan'
  import CommitTestPlanDialog from './CommitTestPlanDialog'

    export default {
      name: "GlobalVariableList",
      components:{
        CommitTestPlanDialog
      },
      props:{
        projectId: Number
      },
      data(){
        return {
          testPlanList:[],
          testPlanIdOfCommitTest:null
        }
      },
      methods:{
        //点击提交测试按钮
        commitTestPlan(row){
          this.testPlanIdOfCommitTest = row.testPlanId
          //根据测试计划id查出详细的信息
          findTestPlanInfoVoByTestPlanId(row.testPlanId).then(resp=>{
            this.$refs.CommitTestPlanDialog.testPlanInfo = resp.data
            this.$refs.CommitTestPlanDialog.dialogVisible = true
          })
        },
        //点击修改按钮
        clickUpdateBtn(row){
            this.$emit('updateTestPlanBtnClicked',row.testPlanId)
        },
        //根据项目id获取测试计划列表
        requestGetTestPlansByProjectId(){
          findTestPlansByProjectId(this.projectId).then(resp=>{
            this.testPlanList = resp.data
          })
        },
        //删除计划
        deleteTestPlan(row){
          this.$confirm('删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteTestPlan(row.testPlanId).then(resp=>{
              this.$notify.success(resp.msg)
              //刷新列表
              this.requestGetTestPlansByProjectId()
            })
          })
        }
      },
      created(){
        this.requestGetTestPlansByProjectId()
      }
    }
</script>

<style scoped>

</style>
