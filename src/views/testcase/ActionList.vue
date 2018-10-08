<template>
  <div>
    <el-row>
      <el-select v-model="queryTestCaseListForm.actionId" placeholder="用例名" @visible-change="selectAction" clearable filterable>
        <el-option v-for="action in selectableActionList" :value="action.actionId" :label="action.actionName"></el-option>
      </el-select>
      <el-select v-model="queryTestCaseListForm.creatorUid" placeholder="创建人" @visible-change="selectCreator" clearable filterable>
        <el-option v-for="creator in selectableCreatorList" :value="creator.creatorUid" :label="creator.nickname"></el-option>
      </el-select>
      <el-select v-model="queryTestCaseListForm.updatorUid" placeholder="更新人" @visible-change="selectUpdator" clearable filterable>
        <el-option v-for="updator in selectableUpdatorList" :value="updator.updatorUid" :label="updator.nickname"></el-option>
      </el-select>
      <el-button type="primary" size="medium" @click="queryTestCaseList">查询</el-button>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-col :span="3">
        <div style="max-height: 745px;overflow: auto">
          <!--categoryType:2 为用例分类-->
          <CategoryList ref="CategoryList" :projectId="projectId" :categoryType="2" @selectCategoryRow="onSelectCategoryRow"></CategoryList>
        </div>
      </el-col>
      <el-col :span="21">
        <el-table :data="actionList" border>
          <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
          <el-table-column label="TestCase名" align="center" prop="actionName"></el-table-column>
          <el-table-column label="描述" align="center" prop="description"></el-table-column>
          <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
          <el-table-column label="创建人" align="center" prop="creatorNickname"></el-table-column>
          <el-table-column label="更新人" align="center" prop="updatorNickname"></el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template scope="scope">
              <el-button type="warning" size="mini" @click="onClickCopyActionBtn(scope.row)">复制</el-button>
              <el-button type="primary" size="mini" @click="onClickUpdateActionBtn(scope.row)">修改</el-button>
              <el-button type="danger" size="mini" @click="deleteAction(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 只有当所有条目大于每页的条目 才需要显示分页控件 -->
        <div align="center" style="margin-top: 10px" v-if=" total > queryTestCaseListForm.countPerPage">
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page="queryTestCaseListForm.pageIndex"
            :total="pages*10"
            @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import CategoryList from '../common/CategoryList'
  import {getActionList,deleteAction,findUpdatorByProjectIdAndActionType,findCreatorByProjectIdAndActionType,findActionByProjectIdAndActionType} from '@/api/action'
    export default {
      name: "ActionList",
      props:{
        projectId: Number,
        actionType:Number,
      },
      components:{
        CategoryList:CategoryList
      },
      data(){
        return {
          actionList:[],

          //一共有几页
          pages:null,
          //所有testcase数
          total:0,
          //查询测试用例列表
          queryTestCaseListForm:{
            pageIndex:1,
            countPerPage:12,
            actionType:this.actionType
          },
          selectableActionList:[],
          selectableCreatorList:[],
          selectableUpdatorList:[]
        }
      },
      methods:{
        //选择用例名
        selectAction(type){
          if(type){
            findActionByProjectIdAndActionType(this.projectId,this.actionType).then(resp=>{
              this.selectableActionList = resp.data
            })
          }
        },
        //选择创建人
        selectCreator(type){
          if(type){
            findCreatorByProjectIdAndActionType(this.projectId,this.actionType).then(resp=>{
              this.selectableCreatorList = resp.data
            })
          }
        },
        //选择更新人
        selectUpdator(type){
          if(type){
            findUpdatorByProjectIdAndActionType(this.projectId,this.actionType).then(resp=>{
              this.selectableUpdatorList = resp.data
            })
          }
        },
        //点击TestCase分类item
        onSelectCategoryRow(row){
          this.queryTestCaseListForm.projectId = this.projectId
          this.queryTestCaseListForm.categoryId = row.categoryId
          //切换分类 把页码重置为1
          this.queryTestCaseListForm.pageIndex = 1
          this.requestActionList()
        },
        //复制action
        onClickCopyActionBtn(row){
          //通知父组件 我点击了复制
          this.$emit("copyActionBtnClicked",row.actionId)
        },
        onClickUpdateActionBtn(row){
          //通知父组件 我点击了修改了
          this.$emit("updateActionBtnClicked",row.actionId)
        },
        deleteAction(row){
          this.$confirm('删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteAction(row.actionId).then(resp=>{
              this.$notify.success(resp.msg)
              //刷新
              this.requestActionList()
            })
          })
        },
        //请求获取testCase列表
        requestActionList(){
          getActionList(this.queryTestCaseListForm).then(resp=>{
            this.actionList = resp.data.data
            this.total = resp.data.total
            this.pages = resp.data.pages
          })
        },
        //点击分页
        handleCurrentChange(val){
          console.log('点击页码',val)
          this.queryTestCaseListForm.pageIndex = val;
          this.requestActionList()
        },
        //点击查询按钮
        queryTestCaseList(){
          this.queryTestCaseListForm.pageIndex = 1
          this.requestActionList()
        },
        //刷新action分类列表
        freshCategoryList(){
          this.$refs.CategoryList.requestGetCategoriesByProjectIdAndCategoryType()
        }
      }
    }
</script>

<style scoped>

</style>
