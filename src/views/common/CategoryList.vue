<template>
    <div>
      <el-table ref="categoryTable" :data="categoryList" highlight-current-row border @current-change="handleCurrentChange">
        <el-table-column property="categoryName" label="分类" align="center">
        </el-table-column>
      </el-table>
    </div>
</template>

<script>

  import {getCategoriesByProjectIdAndCategoryType} from '@/api/category'

  export default {
    name: "CategoryList",
    props:{
      categoryType: Number,
      projectId: Number
    },
    data(){
      return {
        categoryList:[]
      }
    },
    methods:{
      //点击分类item
      handleCurrentChange(row){
        this.$emit('selectCategoryRow',row)
      },
      requestGetCategoriesByProjectIdAndCategoryType(){
        getCategoriesByProjectIdAndCategoryType(this.projectId,this.categoryType).then(resp=>{
          this.categoryList = resp.data
          this.categoryList.splice(0,0,{
            categoryId: null,
            projectId:this.projectId,
            categoryName:'全部'
          })
        })
      }
    },
    created(){
      this.requestGetCategoriesByProjectIdAndCategoryType()
    },
    updated(){
      //默认选中第一个
      this.$refs.categoryTable.setCurrentRow(this.categoryList[0])
    }
  }
</script>

<style scoped>

</style>
