<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" center width="500px">
    <el-form :data="saveProjectForm" label-width="80px">
      <el-form-item label="项目名称" class="content-center" :rules="[{required: true}]">
        <el-input v-model.trim="saveProjectForm.projectName" clearable style="width: 300px" ></el-input>
      </el-form-item>
      <el-form-item label="项目类型" class="content-center" :rules="[{required: true}]">
        <el-radio-group v-model="saveProjectForm.projectType" style="width: 300px">
          <el-radio v-for="projectType in projectTypes" :label="projectType.projectTypeId" >{{ projectType.projectTypeName}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="项目描述" class="content-center">
        <el-input type="textarea" v-model.trim="saveProjectForm.description" clearable style="width: 300px" ></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveProject">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>

  import {addProject,updateProject,getProjectTypes} from '@/api/project'

  export default {
    props:{
      dialogTitle: String,
      isAdd: Boolean,
    },
    data() {
      return {
        projectTypes:[],
        dialogVisible: false,
        saveProjectForm: {}
      };
    },
    methods: {
      //新增 or 修改项目
      saveProject(){
        if(this.isAdd){
          //新增项目
          addProject(this.saveProjectForm).then(resp=>{
            //新增成功
            this.$notify.success(resp.msg)
            //通知父组件新增成功
            this.$emit('saveProjectSuccess')
            //隐藏dialog
            this.dialogVisible = false
          })
        }else{
          //修改项目
          updateProject(this.saveProjectForm).then(resp=>{
            //修改成功
            this.$notify.success(resp.msg)
            //通知父组件修改成功
            this.$emit('saveProjectSuccess')
            //隐藏dialog
            this.dialogVisible = false
          })
        }
      },

      //获取项目类型
      getProjectTypes(){
        getProjectTypes().then(resp=>{
          //获取成功
          this.projectTypes = resp.data
        })
      },
    },
    created(){
      this.getProjectTypes()
    }
  }
</script>
