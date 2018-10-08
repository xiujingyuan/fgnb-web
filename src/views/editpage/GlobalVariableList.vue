<template>
    <div>
      <el-table :data="globalVarList" border>
        <el-table-column align="center" property="globalVarName" label="全局变量名"></el-table-column>
        <el-table-column align="center" property="globalVarValue" label="全局变量值"></el-table-column>
        <el-table-column align="center" property="description" label="描述"></el-table-column>
      </el-table>
    </div>
</template>

<script>

  import { findGlobalVarsByProjectId } from '@/api/globalvar'
    export default {
      name: "GlobalVariableList",
      props:{
        projectId: Number
      },
      watch:{
        globalVarList: {
          handler(val) {
            this.$emit('globalVarListChange',val)
          },
          deep: true
        }
      },
      data(){
        return {
          globalVarList:[],
        }
      },
      created(){
        findGlobalVarsByProjectId(this.projectId).then(resp=>{
          this.globalVarList = resp.data
        })
      }
    }
</script>

<style scoped>

</style>
