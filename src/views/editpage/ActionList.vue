<template>
  <div>
    <el-table :data="actionList" border>
      <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
      <el-table-column label="PageAction名" align="center" prop="actionName"></el-table-column>
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
    <div align="center" style="margin-top: 10px" v-if=" total > countPerPage">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="pageIndex"
        :total="pages*10"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {findActionsByPageId,deleteAction} from '@/api/action'
    export default {
      name: "ActionList",
      props:{
        pageId: Number
      },
      data(){
        return {
          actionList:[],
          pageIndex:1,
          countPerPage:10,
          //一共有几页
          pages:null,
          //所有action数
          total:0
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
              this.requestFindActionsByPageId()
            })
          })
        },
        //根据pageId 请求获取action列表
        requestFindActionsByPageId(){
          findActionsByPageId(this.pageId,this.pageIndex,this.countPerPage).then(resp=>{
            this.actionList = resp.data.data
            this.total = resp.data.total
            this.pages = resp.data.pages
          })
        },
        //点击分页
        handleCurrentChange(val){
          console.log('点击页码',val)
          this.pageIndex = val;
          this.requestFindActionsByPageId()
        },
      },
      created(){
        this.requestFindActionsByPageId()
      }
    }
</script>

<style scoped>

</style>
