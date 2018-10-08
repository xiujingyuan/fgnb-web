<template>
  <div v-loading="loading">
    <el-row :gutter="5">
      <el-col :span="12">
        <!--pageAction名与描述-->
        <el-form label-width="120px">
          <el-form-item label="PageAction名" :rules="[{required: true}]">
            <el-input v-model="savePageActionForm.actionName"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="savePageActionForm.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="savePageAction" size="mini" type="primary" :loading="saveActionBtnLoading">保存</el-button>
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
    <el-row>
      <!--actionParam-->
      <div style="max-height: 300px;overflow: auto">
        <ActionParamList ref="ActionParamList" :is-add="isAdd" @actionParamListChange="actionParamListChange"></ActionParamList>
      </div>
    </el-row>
    <hr>
    <el-row>
      <!--actionVar-->
      <div style="max-height: 300px;overflow: auto">
        <ActionVarList ref="ActionVarList" @actionVarListChange="actionVarListChange"></ActionVarList>
      </div>
    </el-row>
    <hr>
    <el-row>
      <ActionStepList ref="ActionStepList" :project-id="projectId"></ActionStepList>
    </el-row>
  </div>
</template>

<script>

  import ActionVarList from './ActionVarList'
  import ActionParamList from './ActionParamList'
  import GlobalVariableList from './GlobalVariableList'
  import ActionStepList from './ActionStepList'
  import {addAction,updateAction,getActionDetailInfoByActionId,debugAction} from '@/api/action'


    export default {
      name: "SaveAction",
      props:{
        projectId: Number,
        actionType:Number,
        pageId: Number,
        actionId:Number,
        isAdd:{
          type: Boolean,
          default: false
        }
      },
      components:{
        ActionVarList:ActionVarList,
        GlobalVariableList:GlobalVariableList,
        ActionParamList:ActionParamList,
        ActionStepList:ActionStepList
      },
      watch:{
        //点击action列表的修改/复制  传递过来的actionId会变化
        actionId(){
          if(this.actionId){
            this.loading = true
            getActionDetailInfoByActionId(this.actionId).then(resp=>{
              this.savePageActionForm = resp.data
              this.$refs.ActionParamList.actionParams = this.savePageActionForm.actionParams
              this.$refs.ActionVarList.actionVars = this.savePageActionForm.actionVars
              this.$refs.ActionVarList.returnValue = this.savePageActionForm.returnValue
              this.$refs.ActionStepList.actionSteps = this.savePageActionForm.actionSteps
              //这个防止从action列表跳转到修改action页面 选择action的el-select 只显示id不显示actionName
              this.savePageActionForm.actionSteps.forEach(step=>{
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
          savePageActionForm: {
            actionType: this.actionType,
            pageId: this.pageId,
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
        //actionParamList有变化
        actionParamListChange(paramList){
          //赋值给步骤的Action参数 用于智能提示用户输入
          this.$refs.ActionStepList.actionParams = paramList
        },
        //actionVarList有变化
        actionVarListChange(varList){
          //赋值给步骤的局部变量 用于智能提示用户输入
          this.$refs.ActionStepList.evaluations = varList
        },
        //调试Action
        debugAction(){
          //copy一份action 防止修改到提交到服务器保存的action内容
          let action = JSON.parse(JSON.stringify(this.savePageActionForm))
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
          //参数
          action.actionParams = this.$refs.ActionParamList.actionParams
          //变量
          action.actionVars = this.$refs.ActionVarList.actionVars
          //返回值
          action.returnValue = this.$refs.ActionVarList.returnValue
          console.log('Debug Action',action)
          //agentIp deviceId uiautomaotor_server_port
          let agentIp = localStorage.getItem("agentIp")
          let deviceId = localStorage.getItem("deviceId")
          let uiautomatorServerPort = localStorage.getItem("uiautomator_server_port")
          action.agentIp = agentIp
          action.deviceId = deviceId
          action.uiautomatorServerPort = uiautomatorServerPort
          this.debugActionBtnLoading = true
          debugAction(action).then(resp=>{
            this.$notify.success(resp.msg)
            this.debugActionBtnLoading = false
          }).catch(_=>{
            this.debugActionBtnLoading = false
          })
        },
        //保存pageAction
        savePageAction(){

          this.saveActionBtnLoading = true
          try{
            this.savePageActionForm.actionParams = this.$refs.ActionParamList.actionParams
            this.savePageActionForm.actionVars = this.$refs.ActionVarList.actionVars
            this.savePageActionForm.actionSteps = this.$refs.ActionStepList.actionSteps
            if(this.savePageActionForm.actionSteps && this.savePageActionForm.actionSteps.length>0){
              //加上步骤号
              this.savePageActionForm.actionSteps.forEach((item,index)=>{
                item.actionStepNumber = index + 1
              })
            }
            this.savePageActionForm.returnValue = this.$refs.ActionVarList.returnValue
            if(this.isAdd){
              //添加action
              addAction(this.savePageActionForm).then(resp=>{
                this.$notify.success(resp.msg)
                this.saveActionBtnLoading = false
                //通知父类 更新成功
                this.$emit("saveActionSuccess")
              }).catch(e=>{
                this.saveActionBtnLoading = false
              })
            }else{
              //修改action
              updateAction(this.savePageActionForm).then(resp=>{
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
