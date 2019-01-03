<template>
  <div v-loading="loading">
    <el-row :gutter="5">
      <el-col :span="12">
        <!--Action名与描述-->
        <el-form label-width="120px">
          <el-form-item label="Action名" :rules="[{required: true}]">
            <el-input v-model="saveActionForm.actionName"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="saveActionForm.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="saveAction" size="mini" type="primary" :loading="saveActionBtnLoading">保存</el-button>
            <el-button @click="debugAction" size="mini" type="success" :loading="debugActionBtnLoading">调试</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--全局变量-->
      <el-col :span="12">
        <div style="height: 200px;overflow: auto">
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
  </div>
</template>

<script>

  import ActionVarList from './ActionVarList'
  import GlobalVariableList from '../../editpage/GlobalVariableList'
  import ActionStepList from '../../editpage/ActionStepList'
  import {addAction,updateAction,getActionDetailInfoByActionId,debugAction} from '@/api/action'

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
              this.saveActionForm = resp.data
              this.$refs.ActionVarList.actionVars = this.saveActionForm.actionVars
              this.$refs.ActionVarList.returnValue = this.saveActionForm.returnValue
              this.$refs.ActionStepList.actionSteps = this.saveActionForm.actionSteps
              //这个防止从action列表跳转到修改action页面 选择action的el-select 只显示id不显示actionName
              this.saveActionForm.actionSteps.forEach(step=>{
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
          //列表点击修改 跳转到修改页的loading
          loading:false,
          saveActionBtnLoading:false,
          debugActionBtnLoading:false,
          saveActionForm: {
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
        //调试Action
        debugAction(){
          //copy一份action 防止修改到提交到服务器保存的action内容
          let action = JSON.parse(JSON.stringify(this.saveActionForm))
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
        saveAction(){

          this.saveActionBtnLoading = true
          try{
            this.saveActionForm.actionVars = this.$refs.ActionVarList.actionVars
            this.saveActionForm.actionSteps = this.$refs.ActionStepList.actionSteps
            if(this.saveActionForm.actionSteps && this.saveActionForm.actionSteps.length>0){
              //加上步骤号
              this.saveActionForm.actionSteps.forEach((item,index)=>{
                item.actionStepNumber = index + 1
              })
            }
            if(this.isAdd){
              //添加action
              addAction(this.saveActionForm).then(resp=>{
                this.$notify.success(resp.msg)
                this.saveActionBtnLoading = false
                //通知父类 更新成功
                this.$emit("saveActionSuccess")
              }).catch(e=>{
                this.saveActionBtnLoading = false
              })
            }else{
              //修改action
              updateAction(this.saveActionForm).then(resp=>{
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
