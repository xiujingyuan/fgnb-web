<template>
  <div class="app-container">
    <div>
      <el-button icon="el-icon-circle-plus-outline" type="primary" @click="makeAddGlobalVarDialogVisible">新增</el-button>
    </div>
    <!--点击新增/修改全局变量 弹出的新增窗口-->
    <div>
      <AddOrSaveGlobalVarDialog ref="addGlobalVarDialog"
                                :projectId="projectId"
                                :dialogTitle="addGlobalVarDialogTitle"
                                :isAdd="true"
                                @onAddOrSaveVarSuccess="onAddOrSaveVarSuccess()">
      </AddOrSaveGlobalVarDialog>
      <AddOrSaveGlobalVarDialog ref="saveGlobalVarDialog"
                                :projectId = "projectId"
                                :dialogTitle="updateGlobalVarDialogTitle"
                                :isAdd="false"
                                @onAddOrSaveVarSuccess="onAddOrSaveVarSuccess()">
      </AddOrSaveGlobalVarDialog>
    </div>
    <!-- 全局变量列表 -->
    <div style="margin-top: 10px">
      <el-table :data="globalVarList" highlight-current-row border>
        <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
        <el-table-column label="变量名" align="center" prop="globalVarName"></el-table-column>
        <el-table-column label="变量值" align="center" prop="globalVarValue"></el-table-column>
        <el-table-column label="描述" align="center" prop="description"></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
        <el-table-column label="创建人" align="center" prop="creatorNickname"></el-table-column>
        <el-table-column label="更新人" align="center" prop="updatorNickname"></el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template scope="scope">
            <el-button size="small" type="primary" @click="makeUpdateGlobalVarDialogVisible(scope.row)">修改</el-button>
            <el-button size="small" type="danger" @click="deleteGlobalVar(scope.row)">删除</el-button>
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

  import {queryGlobalVarList,deleteGlobalVar} from '@/api/globalvar'

  import AddOrSaveGlobalVarDialog from './AddOrSaveGlobalVarDialog'

  let pId = localStorage.getItem("projectId")?parseInt(localStorage.getItem("projectId")):null
  export default {
    components:{
      AddOrSaveGlobalVarDialog
    },
    data () {
      return {

        projectId: pId,

        addGlobalVarDialogTitle: '新增全局变量',
        updateGlobalVarDialogTitle: '修改全局变量',

        //全局变量数据
        globalVarList:[],
        //一共有几页
        pages:null,
        //所有项目数
        total:0,
        //请求全局变量列表的form表单
        queryListForm:{
          projectId: pId,
          pageIndex:1,
          countPerPage:10
        },
      }
    },
    methods:{
      //添加或修改变量成功
      onAddOrSaveVarSuccess(){
        //刷新列表
        this.requestGlobalVarList()
      },
      //新增全局变量dialog显示
      makeAddGlobalVarDialogVisible(){
        this.$refs.addGlobalVarDialog.dialogVisible = true
      },
      //请求全局变量列表数据
      requestGlobalVarList(){
        queryGlobalVarList(this.queryListForm).then(resp=>{
          this.globalVarList = resp.data.data
          this.total = resp.data.total
          this.pages = resp.data.pages
        })
      },
      //点击分页
      handleCurrentChange(val){
        console.log('点击页码',val)
        this.queryListForm.pageIndex = val;
      },
      //删除变量
      deleteGlobalVar(item){
        this.$confirm('删除该变量？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteGlobalVar(item.globalVarId).then(resp=>{
            //删除成功
            this.$notify.success(resp.msg)
            //重新请求刷新数据
            this.requestGlobalVarList()
          })
        })
      },
      //打开修改变量窗口
      makeUpdateGlobalVarDialogVisible(item){
        //copy一份数据 可以保证修改的同时不改变table行数据
        var _item = Object.assign({},item)
        this.$refs.saveGlobalVarDialog.saveGlobalVarForm = _item
        this.$refs.saveGlobalVarDialog.dialogVisible = true
      },
    },
    //初始化 请求全局变量列表
    created(){
      this.requestGlobalVarList()
    },
    watch:{
      queryListForm:{
        handler(){
          console.log('检测到请求form有变化')
          this.requestGlobalVarList()
        },
        deep:true
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
