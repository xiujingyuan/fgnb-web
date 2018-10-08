<template>
  <div>
    <el-row>
      <el-col>
        <el-tabs type="border-card" v-model="activeTab">
          <el-tab-pane label="Action列表" name="Action列表">
            <ActionList ref="ActionList" :project-id="projectId" :action-type="4" @updateActionBtnClicked="updateActionBtnClicked" @copyActionBtnClicked="copyActionBtnClicked"></ActionList>
          </el-tab-pane>
          <!--name属性用于activeTab默认激活-->
          <el-tab-pane label="添加Action" name="添加Action">
            <!--action-type = 2是封装的action-->
            <SaveAction :project-id="projectId" :action-type="4" :actionId="actionIdOfCopy"  @saveActionSuccess="onSaveActionSuccess" :is-add="true"></SaveAction>
          </el-tab-pane>
          <el-tab-pane label="修改Action" name="修改Action">
            <SaveAction :project-id="projectId" :action-type="4" :actionId="actionIdOfUpdate" @saveActionSuccess="onSaveActionSuccess"></SaveAction>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>


  import SaveAction from './SaveAction'
  import ActionList from './ActionList'

  export default {
    components:{
      SaveAction:SaveAction,
      ActionList:ActionList
    },
    data () {
      return {
        projectId: localStorage.getItem("projectId")?parseInt(localStorage.getItem("projectId")):null,
        //默认激活 Action列表 tab
        activeTab:'Action列表',
        //待更新action的actionId
        actionIdOfUpdate:null,
        //待复制action的actionId
        actionIdOfCopy:null
      }
    },
    methods:{
      copyActionBtnClicked(actionId){
        //自动切换到添加Action页
        this.activeTab = '添加Action'
        this.actionIdOfCopy = actionId
      },
      //点击了修改按钮
      updateActionBtnClicked(actionId){
        //自动切换到修改Action页
        this.activeTab = '修改Action'
        this.actionIdOfUpdate = actionId
      },
      //保存Action成功
      onSaveActionSuccess(){
        //保存成功 刷新action列表
        this.$refs.ActionList.requestActionList()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
