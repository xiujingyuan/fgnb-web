<template>
  <div class="app-container">
    <!--新增page-->
    <div style="margin-bottom: 10px">
      <el-button icon="el-icon-circle-plus-outline" @click="onClickAddPage" type="primary">添加page</el-button>
      <AddPageDialog ref="addPageDialog" @addPageSuccess="onAddPageSuccess" @addPageCategorySuccess="onAddPageCategorySuccess"></AddPageDialog>
    </div>

    <el-row>
      <!-- page分类 -->
      <el-col :span="3" style="max-height: 590px;overflow: auto">
        <CategoryList ref="CategoryList" :projectId="projectId" :categoryType="categoryType" @selectCategoryRow="onSelectCategoryRow"></CategoryList>
      </el-col>
      <!-- page列表 -->
      <el-col :span="21" style="max-height: 590px;overflow: auto">
        <el-table :data="pageList" border>
          <el-table-column property="createTime" align="center" label="创建时间"></el-table-column>
          <el-table-column property="pageName" align="center" label="page名"></el-table-column>
          <el-table-column property="description" align="center" label="描述"></el-table-column>
          <el-table-column label="page截图" align="center">
            <template scope="scope">
              <img v-if="scope.row.imgUrl" :src="scope.row.imgUrl" height="200px"/>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
          <el-table-column label="创建人" align="center" prop="creatorNickname"></el-table-column>
          <el-table-column label="更新人" align="center" prop="updatorNickname"></el-table-column>
          <el-table-column label="操作" width="300" align="center">
            <template scope="scope">
              <el-button size="small" type="primary" @click="modiPage(scope.row)">查看</el-button>
              <el-button size="small" type="danger" @click="removePage(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 只有当所有条目大于每页的条目 才需要显示分页控件 -->
        <div align="center" style="margin-top: 10px" v-if=" total > queryPageListForm.countPerPage">
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page="queryPageListForm.pageIndex"
            :total="pages*10"
            @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  import CategoryList from '@/views/common/CategoryList'
  import { deletePage,findByPageCategory } from '@/api/page'
  import AddPageDialog from './AddPageDialog'

  export default {

    components:{
      CategoryList: CategoryList,
      AddPageDialog: AddPageDialog
    },

    data () {
      return {
        projectId: localStorage.getItem("projectId")?parseInt(localStorage.getItem("projectId")):null,

        //1为page分类类型
        categoryType: 1,

        pageList:[],
        queryPageListForm:{
          pageIndex:1,
          countPerPage:5,
          projectId:null,
          categoryId:null
        },

        //一共有几页
        pages:null,
        //所有page数
        total:0
      }
    },
    methods:{
      //添加page分类成功
      onAddPageCategorySuccess(){
        //刷新分类
        this.$refs.CategoryList.requestGetCategoriesByProjectIdAndCategoryType()
      },
      //添加page成功
      onAddPageSuccess(){
        //刷新pagelist数据
        this.requestPageListByPageCategory()
      },
      onClickAddPage(){
        this.$refs.addPageDialog.dialogVisible = true
      },
      //点击分页
      handleCurrentChange(val){
        this.queryPageListForm.pageIndex = val;
        this.requestPageListByPageCategory()
      },
      //点击分类item
      onSelectCategoryRow(row){
        this.queryPageListForm.projectId = row.projectId
        this.queryPageListForm.categoryId = row.categoryId
        //切换分类 把页码重置为1
        this.queryPageListForm.pageIndex = 1
        this.requestPageListByPageCategory()
      },

      //请求获取pagelist
      requestPageListByPageCategory(){
        findByPageCategory(this.queryPageListForm).then(resp=>{
          this.pageList = resp.data.data
          this.total = resp.data.total
          this.pages = resp.data.pages
        })
      },
      //修改page
      modiPage(row) {
        //携带pageId跳转到新的页面
        this.$router.push({ name: 'EditPage',params: {pageId: row.pageId} })
      },

      //删除page
      removePage(row) {
        this.$confirm('确认删除？').then(_=>{
          //确认删除
          deletePage(row.pageId).then(resp=>{
            //删除成功
            this.$notify.success(resp.msg)
            //刷新数据
            this.requestPageListByPageCategory()
          })
        })
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
