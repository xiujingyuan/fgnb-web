<template>
    <div>
      <el-button @click="addParam" size="mini" type="primary">添加参数</el-button>
      <el-table :data="actionParams" border style="margin-top: 8px">
        <el-table-column label="参数名" align="center">
          <template scope="scope">
            <el-input v-model="scope.row.actionParamName" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="参数描述" align="center">
          <template scope="scope">
            <el-input v-model="scope.row.description" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template scope="scope">
            <el-button @click="deleteParam(scope.$index)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
    export default {
      name: "ActionParamList",
      props:{
        isAdd:{
          type: Boolean,
          default: true
        }
      },
      data(){
        return {
          actionParams:[]
        }
      },
      watch:{
        actionParams: {
          handler(val) {
            this.$emit('actionParamListChange',val)
          },
          deep: true
        }
      },
      methods:{
        //添加参数
        addParam(){
          if(!this.isAdd){
            this.$notify.error('不能添加参数，因为添加参数可能会导致其他引用该action的步骤发生错误')
            return
          }
          this.actionParams.push({
            actionParamName:'',
            description:''
          })
        },
        //删除参数
        deleteParam(index){
          if(!this.isAdd){
            this.$notify.error('不能删除参数，因为删除参数可能会导致其他引用该action的步骤发生错误')
            return
          }
          this.actionParams.splice(index,1)
        }
      }
    }
</script>

<style scoped>

</style>
