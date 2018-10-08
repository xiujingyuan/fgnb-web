<template>
  <div class="app-container">
    <el-row style="margin-bottom: 3px">
      <el-card>
        <svg-icon icon-class="android" style="vertical-align: middle;margin-right: 10px"></svg-icon>
        <el-button size="mini" type="primary" v-clipboard:copy="addPageForm.imgUrl" v-clipboard:success="copyImgURL">复制图片地址</el-button>
        <el-button size="mini" type="primary" v-clipboard:copy="addPageForm.windowHierarchyJson" v-clipboard:success="copyTreeData">复制布局树</el-button>
      </el-card>
    </el-row>

    <!-- inspector -->
    <div style="margin-bottom: 3px">
      <androidInspector :imgInfo="screenShotResp" :windowHierarchyJSON="windowHierarchyJSONObject" :treeLoading="treeLoading"></androidInspector>
    </div>

    <el-row>
      <!-- 添加到page -->
      <el-card>
        <el-form :data="addPageForm" label-width="80px" :inline="true" style="margin-top: 10px">
          <el-form-item label="page名" :rules="[{required: true}]">
            <el-input v-model.trim="addPageForm.pageName" clearable style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="分类" :rules="[{required: true}]">
            <el-select v-model="addPageForm.categoryId" @visible-change="getCategoriesByProjectIdAndCategoryType" clearable filterable>
              <el-option v-for="category in pageCategories" :value="category.categoryId" :label="category.categoryName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="showAddPageCategoryDialog">+</el-button>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model.trim="addPageForm.description" style="width: 300px" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button  @click="addPage" :loading="addPageBtnLoading" type="primary">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
    <!-- 添加page分类dialog -->
    <el-dialog title="添加page分类" :visible.sync="addPageCategoryDialogVisible" center width="500px">
      <el-form :data="savePageCategoryForm" label-width="80px">
        <el-form-item label="分类名" class="content-center" :rules="[{required: true}]">
          <el-input v-model.trim="savePageCategoryForm.categoryName" clearable style="width: 300px" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPageCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePageCategory">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import androidInspector from '../common/AndroidInspector'
  import {addPage} from '@/api/page'
  import {getCategoriesByProjectIdAndCategoryType,addCategory} from '@/api/category'

  let categoryType =  1
  let projectId = localStorage.getItem("projectId")?parseInt(localStorage.getItem("projectId")):null

  export default {

    components:{
      androidInspector:androidInspector
    },
    data () {
      return {

        //添加page提交的数据
        addPageForm:{
          deviceId:this.$route.query.deviceId,
          projectId: projectId
        },

        //新增page按钮loading
        addPageBtnLoading:false,
        //添加page所属分类的dialog
        addPageCategoryDialogVisible:false,
        savePageCategoryForm:{
          projectId: projectId,
          categoryType: categoryType
        },

        agentIp: this.$route.query.agentIp,
        agentPort:10002,
        request:null,
        //page的分类
        pageCategories:[],

        //传递给AndroidInspctor组件的数据
        screenShotResp:{},
        windowHierarchyJSONObject:{},
        treeLoading:true,
      }
    },
    methods:{
      //保存page分类
      savePageCategory(){
        addCategory(this.savePageCategoryForm).then(resp=>{
          this.$notify.success(resp.msg)
          this.addPageCategoryDialogVisible = false
        })
      },
      //点击显示添加分类弹窗
      showAddPageCategoryDialog(){
        this.addPageCategoryDialogVisible = true
      },
      //新增page
      addPage(){
        this.addPageBtnLoading = true
        addPage(this.addPageForm).then(resp=>{
          this.$notify.success(resp.msg)
          this.addPageBtnLoading = false
        }).catch(()=>{
          this.addPageBtnLoading = false
        })
      },
      getCategoriesByProjectIdAndCategoryType(type){
        if(type === true){
          //pageCategoryType == 1
          getCategoriesByProjectIdAndCategoryType(projectId,categoryType).then(resp=>{
            this.pageCategories = resp.data
          })
        }
      },

      initAgentRequest(){
        const conf = {
          baseURL: 'http://'+this.agentIp+':'+this.agentPort, // api的base_url
          timeout: 50000, // 请求超时时间
        }
        // 创建axios实例
        this.request = axios.create(conf)
      },
      requestGetScreenShot(){
        this.request({
          method: 'GET',
          url: '/inspector/android/screenshot',
          params:{
            deviceId:this.addPageForm.deviceId
          }
        }).then(resp=>{
          if(resp.data.status==='1'){
            this.screenShotResp = resp.data.data
            //图片的宽高
            this.addPageForm.imgHeight = this.screenShotResp.imgHeight;
            this.addPageForm.imgWidth = this.screenShotResp.imgWidth;
            //图片地址
            this.addPageForm.imgUrl = this.screenShotResp.downloadURL
          }else{
            this.$notify.error(resp.data.status)
          }
        }).catch(error=>{
          this.$notify.error("网络异常，获取截图失败")
        })
      },
      requestGetWindowHierarchyJSON(){
        //获取布局树
        this.request({
          method: 'GET',
          url: '/inspector/android/dump',
          params:{
            deviceId:this.addPageForm.deviceId
          }
        }).then(resp=>{
          if(resp.data){
            this.windowHierarchyJSONObject = resp.data
            this.addPageForm.windowHierarchyJson = JSON.stringify(this.windowHierarchyJSONObject)
            console.log("服务端返回的树信息:",resp.data)
          }else{
            this.$notify.error("获取布局失败")
          }
          this.treeLoading = false;
        }).catch(error=>{
          console.log(error)
          this.treeLoading = false;
          this.$notify.error("网络异常，获取布局失败，请刷新重试")
        })
      },
      //复制图片地址
      copyImgURL(e){
        if(e.text){
          this.$notify.success('图片地址复制成功')
        }
      },
      //复制布局树
      copyTreeData(e){
        if(e.text){
          this.$notify.success('布局树复制成功')
        }
      }
    },
    created(){
      //init request
      this.initAgentRequest();
      //获取截图
      this.requestGetScreenShot()
      //获取布局树
      this.requestGetWindowHierarchyJSON()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
