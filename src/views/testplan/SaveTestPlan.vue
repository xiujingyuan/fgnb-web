<template>
  <div>
    <el-form label-width="160px">
      <el-form-item label="测试计划名" :rules="[{required: true}]">
        <el-input v-model.trim="saveTestPlanForm.testPlanName" clearable></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model.trim="saveTestPlanForm.description" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="每台手机测试前">
        <el-select v-model="saveTestPlanForm.testPlanBeforeSuiteActionId" @visible-change="selectTestPlanAction" clearable>
          <el-option v-for="action in selectableActionList" :label="action.actionName" :value="action.actionId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="每条用例执行前">
        <el-select v-model="saveTestPlanForm.testPlanBeforeMethodActionId" @visible-change="selectTestPlanAction" clearable>
          <el-option v-for="action in selectableActionList" :label="action.actionName" :value="action.actionId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测试集" :rules="[{required: true}]">
        <el-select v-model="saveTestPlanForm.testPlanTestSuiteIds" @visible-change="selectTestSuite" multiple :rules="[{required: true}]">
          <el-option
            v-for="testSuite in selectableTestSuitList"
            :label="testSuite.testSuiteName"
            :value="testSuite.testSuiteId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="saveTestPlan" type="primary" :loading="saveBtnLoading">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  import {findActionByProjectIdAndActionType} from '@/api/action'
  import {findTestSuitesByProjectId} from '@/api/testSuite'
  import {addTestPlan,updateTestPlan,findTestPlanDetailInfoByTestPlanId} from '@/api/testPlan'

    export default {
      name: "SaveAction",
      props:{
        testPlanId:Number,
        projectId:Number,
        actionType:Number,
        isAdd:{
          type: Boolean,
          default: false
        }
      },
      watch:{
        testPlanId(){
          //计划列表点击了修改
          findTestPlanDetailInfoByTestPlanId(this.testPlanId).then(resp=>{
            //防止跳转过去没有显示actionName
            this.selectableActionList = resp.data.testPlanBeforeList
            //防止跳转过去没有显示testSuiteName
            this.selectableTestSuitList = resp.data.testPlanTestSuites
            this.saveTestPlanForm = resp.data
          })
        }
      },
      data(){
        return{
          saveBtnLoading:false,
          saveTestPlanForm:{
            projectId: this.projectId,
            testPlanTestSuiteIds:[]
          },
          selectableActionList:[],
          selectableTestSuitList:[],
        }
      },
      methods:{
        saveTestPlan(){
          this.saveBtnLoading = true
          if(this.isAdd){
            //添加
            addTestPlan(this.saveTestPlanForm).then(resp=>{
              this.$notify.success(resp.msg)
              this.$emit('saveTestPlanSuccess')
              this.saveBtnLoading = false
            }).catch(_=>{
              this.saveBtnLoading = false
            })
          }else{
            updateTestPlan(this.saveTestPlanForm).then(resp=>{
              this.$notify.success(resp.msg)
              this.$emit('saveTestPlanSuccess')
              this.saveBtnLoading = false
            }).catch(_=>{
              this.saveBtnLoading = false
            })
          }
        },
        //测试集合 select
        selectTestSuite(type){
          if(type){
            findTestSuitesByProjectId(this.projectId).then(resp=>{
              this.selectableTestSuitList = resp.data
            })
          }
        },
        //每台手机执行用例前/每条用例执行前 select
        selectTestPlanAction(type){
          if(type){
            findActionByProjectIdAndActionType(this.projectId,this.actionType).then(resp=>{
              this.selectableActionList = resp.data
            })
          }
        }
      }
    }
</script>
<style scoped>

</style>
