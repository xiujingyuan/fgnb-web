<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="1200px">
    <el-form :data="saveTestSuiteForm" label-width="80px">
      <el-form-item label="测试集名" class="content-center" :rules="[{required: true}]">
        <el-input v-model.trim="saveTestSuiteForm.testSuiteName" clearable style="width: 300px" ></el-input>
      </el-form-item>
      <el-form-item label="描述" class="content-center">
        <el-input type="textarea" v-model.trim="saveTestSuiteForm.description" clearable style="width: 300px" ></el-input>
      </el-form-item>
      <el-form-item label="测试用例" :rules="[{required: true}]">
        <el-transfer filterable filter-placeholder="关键字搜索"
                     v-model="saveTestSuiteForm.testSuiteTestCaseIds"
                     :titles="['所有用例', '已选用例']"
                     :data="testCaseList"></el-transfer>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="saveTestSuiteBtnLoading" @click="saveTestSuite">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>

  import {findActionByProjectIdAndActionType} from '@/api/action' //查出可供选择测试用例
  import {addTestSuite,updateTestSuite} from '@/api/testSuite'

  export default {
    props:{
      dialogTitle: String,
      isAdd: Boolean,
      projectId: Number
    },
    data() {
      return {
        dialogVisible: false,
        saveTestSuiteForm: {
          projectId: this.projectId,
          //穿梭框 已选择的测试用例
          testSuiteTestCaseIds:[]
        },
        saveTestSuiteBtnLoading:false,
        //穿梭框 可供选择的测试用例
        testCaseList:[],
      };
    },
    methods: {
      //新增 or 修改测试集
      saveTestSuite(){
        this.saveTestSuiteBtnLoading = true
        if(this.isAdd){
          //新增测试集
          addTestSuite(this.saveTestSuiteForm).then(resp=>{
            this.$notify.success(resp.msg)
            this.$emit('saveTestSuiteSuccess')
            //隐藏dialog
            this.dialogVisible = false
            this.saveTestSuiteBtnLoading = false
          }).catch(_=>{
            this.saveTestSuiteBtnLoading = false
          })
        }else{
          //修改测试集
          updateTestSuite(this.saveTestSuiteForm).then(resp=>{
            this.$notify.success(resp.msg)
            this.$emit('saveTestSuiteSuccess')
            //隐藏dialog
            this.dialogVisible = false
            this.saveTestSuiteBtnLoading = false
          }).catch(_=>{
            this.saveTestSuiteBtnLoading = false
          })
        }
      },
      requestGetTestCaseList(){
        findActionByProjectIdAndActionType(this.projectId,3).then(resp=>{
          let data = []
          resp.data.forEach(item=>{
            data.push({
              key: item.actionId,
              label: item.description? '【'+item.actionName +'】' +item.description:'【'+item.actionName+'】'
            })
          })
          this.testCaseList = data
        })
      }

    },
    created(){
      this.requestGetTestCaseList()
    }
  }
</script>

<style>
  .el-transfer-panel {
    width: 400px
  }
</style>
