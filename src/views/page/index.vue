<template>
  <div class="app-container">
    <!--新增page-->
    <el-card>
      <div slot="header">
        <span>添加page</span>
      </div>
      <el-steps align-center>
        <el-step title="步骤1" description="远程真机" icon="el-icon-mobile-phone"></el-step>
        <el-step title="步骤2" description="选择使用一台手机" icon="el-icon-mobile-phone"></el-step>
        <el-step title="步骤3" description="点击元素查看器跳转到相应的page页面" icon="el-icon-search"></el-step>
        <el-step title="步骤4" description="保存page" icon="el-icon-success"></el-step>
      </el-steps>
    </el-card>

    <el-card>
      <div slot="header">
        <span>page列表</span>
      </div>
      <el-row>
        <!-- page分类 -->
        <el-col :span="3" style="max-height: 590px;overflow: auto">
          <CategoryList :projectId="projectId" :categoryType="categoryType" @selectCategoryRow="onSelectCategoryRow"></CategoryList>
        </el-col>
        <!-- page列表 -->
        <el-col :span="21" style="max-height: 590px;overflow: auto">
          <el-table :data="pageList" border>
            <el-table-column property="createTime" align="center" label="创建时间"></el-table-column>
            <el-table-column property="pageName" align="center" label="page名"></el-table-column>
            <el-table-column property="description" align="center" label="描述"></el-table-column>
            <el-table-column label="page截图" align="center">
              <template scope="scope">
                <img :src="scope.row.imgUrl" height="200px"/>
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
    </el-card>
  </div>
</template>

<script>

  import CategoryList from '@/views/common/CategoryList'
  import { deletePage,findByPageCategory } from '@/api/page'

  export default {

    components:{
      CategoryList: CategoryList
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
