<template>
  <div class="app-container">
    <el-row :gutter="5">
      <el-col :span="17" style="height:850px;overflow: auto">
        <el-tabs type="border-card" v-model="activeTab">
          <!--name属性用于activeTab默认激活-->
          <el-tab-pane label="添加PageAction" name="添加PageAction">
            <!--action-type = 2是封装的action-->
            <SaveAction :project-id="projectId" :action-type="2" :page-id="pageId" :actionId="actionIdOfCopy" @saveActionSuccess="onSaveActionSuccess" :is-add="true"></SaveAction>
          </el-tab-pane>
          <el-tab-pane label="PageAction列表" name="PageAction列表">
            <ActionList ref="ActionList" :page-id="pageId" @updateActionBtnClicked="updateActionBtnClicked" @copyActionBtnClicked="copyActionBtnClicked"></ActionList>
          </el-tab-pane>
          <el-tab-pane label="修改PageAction" name="修改PageAction">
            <SaveAction :project-id="projectId" :action-type="2" :page-id="pageId" :actionId="actionIdOfUpdate" @saveActionSuccess="onSaveActionSuccess"></SaveAction>
          </el-tab-pane>
          <el-tab-pane label="修改page">
            <el-form :model="savePageForm" inline>
              <el-form-item label="page名" :rules="[{required: true}]">
                <el-input v-model="savePageForm.pageName" clearable></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="savePageForm.description" clearable></el-input>
              </el-form-item>
              <el-form-item label="图片下载地址" :rules="[{required: true}]">
                <el-input v-model="savePageForm.imgUrl" clearable></el-input>
              </el-form-item>
              <el-form-item label="图片宽" :rules="[{required: true}]">
                <el-input v-model="savePageForm.imgWidth" clearable></el-input>
              </el-form-item>
              <el-form-item label="图片高" :rules="[{required: true}]">
                <el-input v-model="savePageForm.imgHeight" clearable></el-input>
              </el-form-item>
              <el-form-item label="图片布局" :rules="[{required: true}]">
                <el-input v-model="savePageForm.windowHierarchyJson" clearable></el-input>
              </el-form-item>
              <el-form-item label="设备id">
                <el-input v-model="savePageForm.deviceId" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="savePage" type="primary" :loading="savePageLoading">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="7" style="height:850px;overflow: auto">
        <androidInspector2 :imgInfo="screenShotResp" :windowHierarchyJSON="windowHierarchyJSON"></androidInspector2>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  import androidInspector2 from '../common/AndroidInspector2'

  import SaveAction from './SaveAction'
  import ActionList from './ActionList'

  import {findPageById,savePage} from '@/api/page'

  export default {
    components:{
      androidInspector2:androidInspector2,
      SaveAction:SaveAction,
      ActionList:ActionList
    },
    data () {
      return {
        projectId: localStorage.getItem("projectId")?parseInt(localStorage.getItem("projectId")):null,

        pageId: parseInt(this.$route.params.pageId),
        //修改page的表单数据
        savePageForm:{},
        //传递给AndroidInspector组件的图片数据
        screenShotResp:{},
        //传递给AndroidInspector组件的json树数据
        windowHierarchyJSON:{},
        //点击保存page按钮的loading状态
        savePageLoading:false,
        //默认激活 添加pageAction tab
        activeTab:'添加PageAction',
        //待更新action的actionId
        actionIdOfUpdate:null,
        //待复制action的actionId
        actionIdOfCopy:null
      }
    },
    methods:{
      copyActionBtnClicked(actionId){
        //自动切换到添加pageAction页
        this.activeTab = '添加PageAction'
        this.actionIdOfCopy = actionId
      },
      //点击了修改PageAction按钮
      updateActionBtnClicked(actionId){
        //自动切换到pageAction页
        this.activeTab = '修改PageAction'
        this.actionIdOfUpdate = actionId
      },
      //保存Action成功
      onSaveActionSuccess(){
        //保存成功 刷新action列表
        this.$refs.ActionList.requestFindActionsByPageId()
      },
      //保存page
      savePage(){
        this.savePageLoading = true
        savePage(this.savePageForm).then(resp=>{
          this.$notify.success(resp.msg)
          this.savePageLoading = false
        }).catch(_=>{
          this.savePageLoading = false
        })
      },
    },
    created(){
      //根据pageId查出页面相关信息
      findPageById(this.pageId).then(resp=>{
        this.savePageForm = resp.data
        //传递给AndrpidInspector组件数据
        this.screenShotResp = {
          imgWidth: this.savePageForm.imgWidth,
          imgHeight: this.savePageForm.imgHeight,
          downloadURL: this.savePageForm.imgUrl
        }
        this.windowHierarchyJSON = JSON.parse(this.savePageForm.windowHierarchyJson)
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
