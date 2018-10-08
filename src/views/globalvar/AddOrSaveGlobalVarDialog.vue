<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" center width="500px">
    <el-form :data="saveGlobalVarForm" label-width="100px">
      <el-form-item label="全局变量名" class="content-center" :rules="[{required: true}]">
        <el-input v-model.trim="saveGlobalVarForm.globalVarName" clearable style="width: 300px" ></el-input>
      </el-form-item>
      <el-form-item label="全局变量值" class="content-center" :rules="[{required: true}]">
        <el-input v-model.trim="saveGlobalVarForm.globalVarValue" clearable style="width: 300px" ></el-input>
      </el-form-item>
      <el-form-item label="描述" class="content-center">
        <el-input type="textarea" v-model.trim="saveGlobalVarForm.description" clearable style="width: 300px" ></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveGlobalVar">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>

  import {addGlobalVar,updateGlobalVar} from '@/api/globalvar'

  export default {
    props:{
      dialogTitle: String,
      isAdd: Boolean,
      projectId: Number
    },
    data() {
      return {
        dialogVisible: false,
        saveGlobalVarForm: {}
      };
    },
    methods: {
      //新增 or 修改全局变量
      saveGlobalVar(){
        if(this.isAdd){
          this.saveGlobalVarForm.projectId = this.projectId
          //新增全局变量
          addGlobalVar(this.saveGlobalVarForm).then(resp=>{
            //新增成功
            this.$notify.success(resp.msg)
            //通知父组件新增成功
            this.$emit('onAddOrSaveVarSuccess')
            //隐藏dialog
            this.dialogVisible = false
          })
        }else{
          this.saveGlobalVarForm.projectId = this.projectId
          //修改全局变量
          updateGlobalVar(this.saveGlobalVarForm).then(resp=>{
            //修改成功
            this.$notify.success(resp.msg)
            //通知父组件修改成功
            this.$emit('onAddOrSaveVarSuccess')
            //隐藏dialog
            this.dialogVisible = false
          })
        }
      }
    },
  }
</script>
