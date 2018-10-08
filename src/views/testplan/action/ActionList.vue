<template>
  <div>
    <el-row style="margin-top: 10px">
      <el-col>
        <el-table :data="actionList" border>
          <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
          <el-table-column label="Action名" align="center" prop="actionName"></el-table-column>
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
        <div align="center" style="margin-top: 10px" v-if=" total > queryActionListForm.countPerPage">
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page="queryActionListForm.pageIndex"
            :total="pages*10"
            @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {getActionList,deleteAction} from '@/api/action'
    export default {
      name: "ActionList",
      props:{
        projectId: Number,
        actionType:Number,
      },
      data(){
        return {
          actionList:[],
          //一共有几页
          pages:null,
          //所有TestPlanAction数
          total:0,
          //查询Action列表
          queryActionListForm:{
            pageIndex:1,
            countPerPage:10,
            actionType:this.actionType
          }
        }
      },
      methods:{
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
        //请求获取Action列表
        requestActionList(){
          getActionList(this.queryActionListForm).then(resp=>{
            this.actionList = resp.data.data
            this.total = resp.data.total
            this.pages = resp.data.pages
          })
        },
        //点击分页
        handleCurrentChange(val){
          console.log('点击页码',val)
          this.queryActionListForm.pageIndex = val;
          this.requestActionList()
        }
      },
      created(){
        this.requestActionList()
      }
    }
</script>

<style scoped>

</style>
