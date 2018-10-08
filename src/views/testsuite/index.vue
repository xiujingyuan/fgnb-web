<template>
  <div class="app-container">
    <div>
      <el-button icon="el-icon-circle-plus-outline" type="primary" @click="makeAddTestSuiteDialogVisible">新增测试集</el-button>
    </div>
    <!--点击新增/修改测试集 弹出的窗口-->
    <div>
      <SaveTestSuiteDialog ref="addTestSuiteDialog" :projectId ="projectId" :dialogTitle="addTestSuiteDialogTitle" :isAdd="true" @saveTestSuiteSuccess="requestTestSuiteList()"></SaveTestSuiteDialog>
      <SaveTestSuiteDialog ref="updateTestSuiteDialog" :projectId ="projectId" :dialogTitle="updateTestSuiteDialogTitle" :isAdd="false" @saveTestSuiteSuccess="requestTestSuiteList()"></SaveTestSuiteDialog>
    </div>
    <!-- 测试集列表 -->
    <div style="margin-top: 10px">
      <el-table :data="testSuiteList" highlight-current-row border>
        <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
        <el-table-column label="测试集名" align="center" prop="testSuiteName"></el-table-column>
        <el-table-column label="描述" align="center" prop="description"></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
        <el-table-column label="创建人" align="center" prop="creatorNickname"></el-table-column>
        <el-table-column label="更新人" align="center" prop="updatorNickname"></el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template scope="scope">
            <el-button size="small" type="primary" @click="makeUpdateTestSuiteDialogVisible(scope.row)">修改</el-button>
            <el-button size="small" type="danger" @click="deleteTestSuite(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

  import SaveTestSuiteDialog from './SaveTestSuiteDialog'

  import {findTestSuitesByProjectId,deleteTestSuite,getTestSuiteDetailInfoByTestSuiteId} from '@/api/testSuite'

  export default {
    components:{
      SaveTestSuiteDialog
    },
    data () {
      return {
        addTestSuiteDialogTitle: '新增测试集',
        updateTestSuiteDialogTitle: '修改测试集',
        projectId: localStorage.getItem("projectId")?parseInt(localStorage.getItem("projectId")):null,
        testSuiteList:[],
      }
    },
    methods:{
      //新增测试集dialog显示
      makeAddTestSuiteDialogVisible(){
        this.$refs.addTestSuiteDialog.dialogVisible = true
      },
      //请求测试集列表数据
      requestTestSuiteList(){
        findTestSuitesByProjectId(this.projectId).then(resp=>{
          this.testSuiteList = resp.data
        })
      },
      //删除TestSuite
      deleteTestSuite(item){
        this.$confirm('删除该测试集？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTestSuite(item.testSuiteId).then(resp=>{
            //删除成功
            this.$notify.success(resp.msg)
            //重新请求刷新数据
            this.requestTestSuiteList()
          })
        })
      },
      //打开修改测试集窗口
      makeUpdateTestSuiteDialogVisible(item){
        //根据testSuiteId查出testsuite的详细信息
        getTestSuiteDetailInfoByTestSuiteId(item.testSuiteId).then(resp=>{
          //copy一份数据 可以保证修改的同时不改变table行数据
          let _item = JSON.parse(JSON.stringify(resp.data))
          this.$refs.updateTestSuiteDialog.saveTestSuiteForm = _item
          this.$refs.updateTestSuiteDialog.dialogVisible = true
        })
      },
    },
    created(){
      this.requestTestSuiteList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
