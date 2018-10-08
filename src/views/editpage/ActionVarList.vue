<template>
    <div>
      <el-button @click="addVar" size="mini" type="primary">添加局部变量</el-button>
      <el-table :data="actionVars" border style="margin-top: 8px">
        <el-table-column label="变量名" align="center">
          <template scope="scope">
            <el-input v-model="scope.row.actionVarName" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="变量值" align="center">
          <template scope="scope">
            <el-input v-model="scope.row.actionVarValue" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="变量描述" align="center">
          <template scope="scope">
            <el-input v-model="scope.row.description" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="作为返回值" align="center">
            <template scope="scope">
              <el-radio :label="scope.row.actionVarName" v-model="returnValue">&nbsp</el-radio>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template scope="scope">
            <el-button @click="deleteActionVar(scope.$index)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
    export default {
      name: "ActionVarList",
      data(){
        return {
          returnValue:null,
          actionVars:[]
        }
      },
      watch:{
        actionVars: {
          handler(val) {
            this.$emit('actionVarListChange',val)
          },
          deep: true
        }
      },
      methods:{
        //添加局部变量
        addVar(){
          this.actionVars.push({
            actionVarName:'',
            actionVarValue:'',
            description:''
          })
        },
        //删除变量
        deleteActionVar(index){
          this.actionVars.splice(index,1)
        }
      }
    }
</script>

<style scoped>

</style>
