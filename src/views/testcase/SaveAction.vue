<template>
  <div v-loading="loading">
    <el-row :gutter="5">
      <el-col :span="12">
        <!--TestCaseAction名与描述-->
        <el-form label-width="120px">
          <el-form-item label="TestCase名" :rules="[{required: true}]">
            <el-input v-model="saveTestCaseActionForm.actionName"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="saveTestCaseActionForm.description"></el-input>
          </el-form-item>
          <el-form-item label="分类" :rules="[{required: true}]">
            <el-select v-model="saveTestCaseActionForm.categoryId" @visible-change="getCategoriesByProjectIdAndCategoryType" clearable filterable>
              <el-option v-for="category in testCaseCategories" :value="category.categoryId" :label="category.categoryName"></el-option>
            </el-select>
            <el-button @click="addTestCaseCategoryDialogVisible = true">+</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="saveTestCaseAction" size="mini" type="primary" :loading="saveActionBtnLoading">保存</el-button>
            <el-button @click="debugAction" size="mini" type="success" :loading="debugActionBtnLoading">调试</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--全局变量-->
      <el-col :span="12">
        <div style="height: 220px;overflow: auto">
          <GlobalVariableList ref="GlobalVariableList" :project-id="projectId" @globalVarListChange="globalVarListChange"></GlobalVariableList>
        </div>
      </el-col>
    </el-row>
    <hr>
    <el-row >
      <!--actionVar-->
      <el-col>
        <div style="max-height: 300px;overflow: auto">
          <ActionVarList ref="ActionVarList" @actionVarListChange="actionVarListChange"></ActionVarList>
        </div>
      </el-col>
    </el-row>
    <hr>
    <el-row>
      <ActionStepList ref="ActionStepList" :project-id="projectId"></ActionStepList>
    </el-row>
    <!-- 添加testcase分类dialog -->
    <el-dialog title="添加TestCase分类" :visible.sync="addTestCaseCategoryDialogVisible" center width="500px">
      <el-form :data="saveTestCaseCategoryForm" label-width="80px">
        <el-form-item label="分类名" class="content-center" :rules="[{required: true}]">
          <el-input v-model.trim="saveTestCaseCategoryForm.categoryName" clearable style="width: 300px" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addTestCaseCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveTestCaseCategory">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import ActionVarList from './ActionVarList'
  import GlobalVariableList from '../editpage/GlobalVariableList'
  import ActionStepList from '../editpage/ActionStepList'
  import {addAction,updateAction,getActionDetailInfoByActionId,debugAction} from '@/api/action'
  //testcase分类
  import {addCategory,getCategoriesByProjectIdAndCategoryType} from '@/api/category'

    export default {
      name: "SaveAction",
      props:{
        projectId: Number,
        actionType:Number,
        actionId:Number,
        isAdd:{
          type: Boolean,
          default: false
        }
      },
      components:{
        ActionVarList:ActionVarList,
        GlobalVariableList:GlobalVariableList,
        ActionStepList:ActionStepList
      },
      watch:{
        //点击action列表的修改/复制 传递过来的actionId会变化
        actionId(){
          if(this.actionId){
            this.loading = true
            getActionDetailInfoByActionId(this.actionId).then(resp=>{
              this.saveTestCaseActionForm = resp.data
              //防止 跳转到修改TestCase页面 分类显示为id
              this.testCaseCategories = [{
                categoryId: this.saveTestCaseActionForm.categoryId,
                categoryName: this.saveTestCaseActionForm.categoryName
              }]
              this.$refs.ActionVarList.actionVars = this.saveTestCaseActionForm.actionVars
              this.$refs.ActionVarList.returnValue = this.saveTestCaseActionForm.returnValue
              this.$refs.ActionStepList.actionSteps = this.saveTestCaseActionForm.actionSteps
              //这个防止从action列表跳转到修改action页面 选择action的el-select 只显示id不显示actionName
              this.saveTestCaseActionForm.actionSteps.forEach(step=>{
                this.$refs.ActionStepList.selectableActions.push({
                  actionName: step.stepActionName,
                  actionId: step.stepActionId
                })
              })
              this.loading = false
            }).catch(_=>{
              this.loading=false
            })
          }
        }
      },
      data(){
        return{
          //添加测试用例分类 dialog显示
          addTestCaseCategoryDialogVisible:false,
          //保存测试用例分类 表单
          saveTestCaseCategoryForm:{
            projectId: this.projectId,
            categoryType: 2
          },
          //测试用例分类
          testCaseCategories:[],

          //列表点击修改 跳转到修改页的loading
          loading:false,
          saveActionBtnLoading:false,
          debugActionBtnLoading:false,
          saveTestCaseActionForm: {
            actionType: this.actionType,
            projectId: this.projectId
          }
        }
      },
      methods:{
        //globalVarList有变化
        globalVarListChange(globalVarList){
          //赋值给步骤的globalVar 用于智能提示用户输入
          this.$refs.ActionStepList.globalVars = globalVarList
        },
        //actionVarList有变化
        actionVarListChange(varList){
          //赋值给步骤的局部变量 用于智能提示用户输入
          this.$refs.ActionStepList.evaluations = varList
        },
        //点击测试用例分类select
        getCategoriesByProjectIdAndCategoryType(type){
          if(type === true){
            //pageCategoryType == 2 为测试用例的分类
            getCategoriesByProjectIdAndCategoryType(this.projectId,2).then(resp=>{
              this.testCaseCategories = resp.data
            })
          }
        },
        //保存TestCase分类
        saveTestCaseCategory(){
          addCategory(this.saveTestCaseCategoryForm).then(resp=>{
            this.$notify.success(resp.msg)
            this.addTestCaseCategoryDialogVisible = false
            //保存成功 通知Testcase列表更新测试用例分类
            this.$emit("saveCategorySuccess")
          })
        },
        //调试测试用例
        debugAction(){
          //copy一份action 防止修改到提交到服务器保存的action内容
          let action = JSON.parse(JSON.stringify(this.saveTestCaseActionForm))
          //选中的步骤
          action.actionSteps = this.$refs.ActionStepList.selectedSteps
          if(action.actionSteps.length<=0){
            this.$notify.error("至少要勾选1个步骤进行调试")
            return
          }
          //加上步骤号
          action.actionSteps.forEach((item,index)=>{
            item.actionStepNumber = index + 1
          })
          //全局变量
          action.globalVars = this.$refs.GlobalVariableList.globalVarList
          //变量
          action.actionVars = this.$refs.ActionVarList.actionVars
          console.log('Debug Action',action)
          //agentIp deviceId port
          let agentIp = localStorage.getItem("agentIp")
          let deviceId = localStorage.getItem("deviceId")
          let port = localStorage.getItem("port")
          action.agentIp = agentIp
          action.deviceId = deviceId
          action.port = port
          this.debugActionBtnLoading = true
          debugAction(action).then(resp=>{
            this.$notify.success(resp.msg)
            this.debugActionBtnLoading = false
          }).catch(_=>{
            this.debugActionBtnLoading = false
          })
        },
        //保存TestCaseAction
        saveTestCaseAction(){

          this.saveActionBtnLoading = true
          try{
            this.saveTestCaseActionForm.actionVars = this.$refs.ActionVarList.actionVars
            this.saveTestCaseActionForm.actionSteps = this.$refs.ActionStepList.actionSteps
            if(this.saveTestCaseActionForm.actionSteps && this.saveTestCaseActionForm.actionSteps.length>0){
              //加上步骤号
              this.saveTestCaseActionForm.actionSteps.forEach((item,index)=>{
                item.actionStepNumber = index + 1
              })
            }
            if(this.isAdd){
              //添加action
              addAction(this.saveTestCaseActionForm).then(resp=>{
                this.$notify.success(resp.msg)
                this.saveActionBtnLoading = false
                //通知父类 更新成功
                this.$emit("saveActionSuccess")
              }).catch(e=>{
                this.saveActionBtnLoading = false
              })
            }else{
              //修改action
              updateAction(this.saveTestCaseActionForm).then(resp=>{
                this.$notify.success(resp.msg)
                this.saveActionBtnLoading = false
                //通知父类 更新成功
                this.$emit("saveActionSuccess")
              }).catch(e=>{
                this.saveActionBtnLoading = false
              })
            }

          }catch (e) {
            this.saveActionBtnLoading = false
          }

        },
      }

    }
</script>

<style scoped>
  hr {
    border:0;
    background-color:#D6D6D6;
    height:1px;
  }

</style>
