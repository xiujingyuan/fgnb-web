<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-tabs type="border-card" v-model="activeTab">
          <el-tab-pane label="TestCase列表" name="TestCase列表">
            <ActionList ref="ActionList" :project-id="projectId" :action-type="3" @updateActionBtnClicked="updateActionBtnClicked" @copyActionBtnClicked="copyActionBtnClicked"></ActionList>
          </el-tab-pane>
          <!--name属性用于activeTab默认激活-->
          <el-tab-pane label="添加TestCase" name="添加TestCase">
            <!--action-type = 2是封装的action-->
            <SaveAction :project-id="projectId" :action-type="3" :actionId="actionIdOfCopy"  @saveActionSuccess="onSaveActionSuccess" @saveCategorySuccess="onSaveCategorySuccess" :is-add="true"></SaveAction>
          </el-tab-pane>
          <el-tab-pane label="修改TestCase" name="修改TestCase">
            <SaveAction :project-id="projectId" :action-type="3" :actionId="actionIdOfUpdate" @saveActionSuccess="onSaveActionSuccess" @saveCategorySuccess="onSaveCategorySuccess"></SaveAction>
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
        //默认激活 TestCase列表 tab
        activeTab:'TestCase列表',
        //待更新action的actionId
        actionIdOfUpdate:null,
        //待复制action的actionId
        actionIdOfCopy:null
      }
    },
    methods:{
      copyActionBtnClicked(actionId){
        //自动切换到添加TestCase页
        this.activeTab = '添加TestCase'
        this.actionIdOfCopy = actionId
      },
      //点击了修改PageAction按钮
      updateActionBtnClicked(actionId){
        //自动切换到修改TestCase页
        this.activeTab = '修改TestCase'
        this.actionIdOfUpdate = actionId
      },
      //保存Action成功
      onSaveActionSuccess(){
        //保存成功 刷新action列表
        this.$refs.ActionList.requestActionList()
      },
      //保存分类成功
      onSaveCategorySuccess(){
        //保存成功 刷新分类列表
        this.$refs.ActionList.freshCategoryList()
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
