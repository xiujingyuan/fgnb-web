<template>
  <div class="app-container">
    <div>
      <el-button icon="el-icon-circle-plus-outline" type="primary" @click="makeAddProjectDialogVisible">新增项目</el-button>
    </div>
    <!--点击新增/修改项目 弹出的新增窗口-->
    <div>
      <addOrSaveProjectDialog ref="addProjectDialog" :dialogTitle="addProjectDialogTitle" :isAdd="true" @saveProjectSuccess="requestProjectList()"></addOrSaveProjectDialog>
      <addOrSaveProjectDialog ref="saveProjectDialog" :dialogTitle="updateProjectDialogTitle" :isAdd="false" @saveProjectSuccess="requestProjectList()"></addOrSaveProjectDialog>
    </div>

    <!--筛选-->
    <div style="margin-top: 10px">
      <!--项目类型-->
      <el-select v-model="queryListForm.projectType" placeholder="项目类型" @visible-change="getProjectTypes">
        <el-option v-for="projectType in projectTypes" :label="projectType.projectTypeName" :value="projectType.projectTypeId">
          <svg-icon style="vertical-align: middle" v-if="projectType.projectTypeId === 1" icon-class="android"></svg-icon>
          <svg-icon style="vertical-align: middle" v-else icon-class="ios"></svg-icon>
          <span>{{ projectType.projectTypeName }}</span>
        </el-option>
      </el-select>
      <!--项目名-->
      <el-select v-model="queryListForm.projectName" clearable placeholder="项目名" @visible-change="getProjectNames" filterable>
        <el-option v-for="item in projectNames" :value="item"></el-option>
      </el-select>
      <!--重置-->
      <el-button @click="clearSearch">重置</el-button>
    </div>
    <!-- 项目列表 -->
    <div style="margin-top: 10px">
      <el-table :data="projectList" highlight-current-row border>
        <el-table-column label="项目类型" align="center">
          <template scope="scope">
            <svg-icon v-if="scope.row.projectType === 1" icon-class="android"></svg-icon>
            <svg-icon v-else icon-class="ios"></svg-icon>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
        <el-table-column label="项目名称" align="center" prop="projectName"></el-table-column>
        <el-table-column label="项目描述" align="center" prop="description"></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
        <el-table-column label="创建人" align="center" prop="creatorNickname"></el-table-column>
        <el-table-column label="更新人" align="center" prop="updatorNickname"></el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template scope="scope">
            <el-button size="small" type="success" @click="selectProject(scope.row)">选择</el-button>
            <el-button size="small" type="primary" @click="makeUpdateProjectDialogVisible(scope.row)">修改</el-button>
            <el-button size="small" type="danger" @click="deleteProject(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 只有当所有条目大于每页的条目 才需要显示分页控件 -->
    <div align="center" style="margin-top: 10px" v-if=" total > queryListForm.countPerPage">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="queryListForm.pageIndex"
        :total="pages*10"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>

  import {queryProjectList,deleteProject,getProjectNames,getProjectTypes} from '@/api/project'

  import addOrSaveProjectDialog from './AddOrSaveProjectDialog'

  export default {
    components:{
      addOrSaveProjectDialog
    },
    data () {
      return {
        addProjectDialogTitle: '新增项目',
        updateProjectDialogTitle: '修改项目',

        //项目列表数据
        projectList:null,
        //一共有几页
        pages:null,
        //所有项目数
        total:0,
        //请求项目列表的form表单
        queryListForm:{
          pageIndex:1,
          countPerPage:10,
          projectName:null,
          projectType:null
        },
        //下拉所有项目名
        projectNames:[],

        //下拉select的projectTypes
        projectTypes:[]
      }
    },
    methods:{
      //选择项目
      selectProject(project){
        this.$confirm('选择该项目作为你的测试项目（确定后，需要重新登录）？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          localStorage.setItem("projectId",project.projectId)
          localStorage.setItem("projectName",project.projectName)
          this.$router.push({path:'/login'})
        })
      },
      //新增项目dialog显示
      makeAddProjectDialogVisible(){
        this.$refs.addProjectDialog.dialogVisible = true
      },
      //重置
      clearSearch(){
        this.queryListForm = {
          pageIndex:1,
          countPerPage:10,
          projectName:null,
          projectType:null
        }
      },
      getProjectTypes(type){
        if(type===true){
          getProjectTypes().then(resp=>{
            //获取成功
            this.projectTypes = resp.data
          })
        }
      },
      //获取项目名
      getProjectNames(type){
        //true 代表是下拉展开 此时请求获取项目名
        if(type===true){
          getProjectNames().then(resp=>{
            //获取成功
            this.projectNames = resp.data
            console.log('所有项目',this.projectNames)
          })
        }
      },
      //请求项目列表数据
      requestProjectList(){
        queryProjectList(this.queryListForm).then(resp=>{
          this.projectList = resp.data.data
          this.total = resp.data.total
          this.pages = resp.data.pages
        })
      },
      //点击分页
      handleCurrentChange(val){
        console.log('点击页码',val)
        this.queryListForm.pageIndex = val;
      },
      //删除项目
      deleteProject(item){
        this.$confirm('删除该项目？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProject(item.projectId).then(resp=>{
            //删除成功
            this.$notify.success(resp.msg)
            //重新请求刷新数据
            this.requestProjectList()
          })
        })
      },
      //打开修改项目窗口
      makeUpdateProjectDialogVisible(item){
        //copy一份数据 可以保证修改的同时不改变table行数据
        var _item = Object.assign({},item)
        this.$refs.saveProjectDialog.saveProjectForm = _item
        this.$refs.saveProjectDialog.dialogVisible = true
      },
    },
    //初始化 请求项目列表
    created(){
      this.requestProjectList()
    },
    watch:{
      queryListForm:{
        handler(){
          console.log('检测到请求form有变化')
          this.requestProjectList()
        },
        deep:true
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
