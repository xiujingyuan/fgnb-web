<template>
    <div>
      <el-button @click="addActionStep" size="mini" type="primary">添加步骤</el-button>
      <el-table :data="actionSteps" border ref="actionStepTable" @selection-change="handleSelectionChange" style="margin-top: 8px">
        <el-table-column align="center"
          type="selection"
          width="30">
        </el-table-column>
        <el-table-column label="步骤" align="center" width="50">
          <template scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="步骤名" align="center" width="150">
          <template scope="scope">
            <el-input v-model="scope.row.actionStepName" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="Action" align="center" width="150">
          <template scope="scope">
            <el-select
              filterable
              clearable
              @visible-change="selectAction"
              @change="actionSelected($event,scope.row)"
              v-model="scope.row.stepActionId"
              style="width: 100%">
              <el-option v-for="action in selectableActions" :value="action.actionId" :label="action.actionName"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Action参数值" align="center">
          <template scope="scope">
            <el-table :data="scope.row.actionStepParamValues" border>
              <el-table-column property="actionParamName" label="参数名" align="center" width="100"></el-table-column>
              <el-table-column property="description" label="参数描述" align="center" width="100"></el-table-column>
              <el-table-column label="参数值" align="center">
                <template scope = "scope1">
                  <el-select
                    style="width: 100%"
                    filterable
                    clearable
                    allow-create
                    placeholder=" "
                    @visible-change="selectActionParamValue($event,scope1.row)"
                    v-model="scope1.row.actionParamValue">
                    <el-option v-for="value in selectableActionParamValues" :value="value" :label="value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="赋值" align="center" width="100">
          <template scope="scope">
            <el-select v-model="scope.row.evaluation" clearable placeholder=" ">
              <el-option v-for="e in evaluations" :label="e.actionVarName" :value="e.actionVarName"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="190">
          <template scope="scope">
            <el-button size="mini" @click="moveUp(scope.$index)" :disabled="checkMoveUpNeedDisable(scope.$index)">↑</el-button>
            <el-button size="mini" @click="moveDown(scope.$index)" :disabled="checkMoveDownNeedDisable(scope.$index)">↓</el-button>
            <el-button size="mini" @click="deleteStep(scope.$index)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
   import {findSelectableActions} from '@/api/action'
   import {findActionParamsByActionId} from '@/api/actionParam'
   import {findActionParamPossibleValuesByActionParamId} from '@/api/actionParamPossibleValue'
    export default {
      name: "ActionStepList",
      props:{
        projectId: Number
      },
      data(){
        return {
          actionSteps:[],
          //选中的待调试步骤
          selectedSteps:[],
          //可供选择的action
          selectableActions:[],

          //以下为提示用户输入
          //局部变量
          evaluations:[],
          //全局变量
          globalVars:[],
          //action参数
          actionParams:[],
          //action参数可能的值
          actionParamPossibleValues: [],
        }
      },
      computed:{
        //可供选择的步骤action参数值
        selectableActionParamValues:function () {
          let values = []
          //step action可能值
          if(this.actionParamPossibleValues != null && this.actionParamPossibleValues.length >0){
            this.actionParamPossibleValues.forEach(item=>{
              values.push(item)
            })
          }
          //局部变量
          if(this.evaluations != null  && this.evaluations.length > 0){
            this.evaluations.forEach(item=>{
              values.push('@{'+item.actionVarName+'}')
            })
          }
          //全局变量
          if(this.globalVars!=null && this.globalVars.length > 0){
            this.globalVars.forEach(item=>{
              values.push('${'+item.globalVarName+'}')
            })
          }
          //action参数
          if(this.actionParams!=null && this.actionParams.length > 0){
            this.actionParams.forEach(item=>{
              values.push('#{'+item.actionParamName+'}')
            })
          }

          return values
        }
      },
      methods:{
        //点击action参数值
        selectActionParamValue(type,row){
          if(type){
            //找出该参数 对应的可能值
            findActionParamPossibleValuesByActionParamId(row.actionParamId).then(resp=>{
              let possibleVales = []
              resp.data.forEach(item => {
                possibleVales.push(item.actionParamPossibleValue)
              })
              this.actionParamPossibleValues = possibleVales
            })
          }
        },
        //检查向上箭头是否要置灰
        checkMoveUpNeedDisable(index){
          //第一个
          if(index==0){
            return true
          }
          return false
        },
        //检查向下箭头是否要置灰
        checkMoveDownNeedDisable(index){
          //最后一个
          if(index==this.actionSteps.length-1){
            return true
          }
          return false
        },
        moveUp(index){
          let temp = this.actionSteps[index];
          this.actionSteps[index] = this.actionSteps[index-1]
          this.actionSteps[index-1] = temp
          //触发vue更新数据
          this.actionSteps = this.actionSteps.splice(0,this.actionSteps.length)
        },
        moveDown(index){
          let temp = this.actionSteps[index+1]
          this.actionSteps[index+1] = this.actionSteps[index]
          this.actionSteps[index] = temp
          //触发vue更新数据
          this.actionSteps = this.actionSteps.splice(0,this.actionSteps.length)
        },
        deleteStep(index){
          this.actionSteps.splice(index,1)
        },
        addActionStep(){
          this.actionSteps.push({actionStepParamValues:[]})
        },
        //步骤勾选
        handleSelectionChange(val){
          let arr = this.actionSteps.filter(step => {
            return val.indexOf(step) !== -1
          })
          this.selectedSteps = arr
        },
        //点击select框
        selectAction(type){
          if(type){
            findSelectableActions(this.projectId).then(resp=>{
              this.selectableActions = resp.data
            })
          }
        },
        //选中一个action
        actionSelected(actionId,row){
          //根据选中的action查出action相关信息 提供给action参数值列
          findActionParamsByActionId(actionId).then(resp=>{
            row.actionStepParamValues = resp.data
          })
        }
      }
    }
</script>

<style scoped>

</style>
