<template>
  <div>
    <el-dialog title="添加page" :visible.sync="dialogVisible" center width="500px">
      <el-form :model="addPageForm" label-width="100px">
        <el-form-item label="page名" :rules="[{required: true}]">
          <el-input v-model="addPageForm.pageName" clearable></el-input>
        </el-form-item>
        <el-form-item label="分类" :rules="[{required: true}]">
          <el-select v-model="addPageForm.categoryId" @visible-change="getCategoriesByProjectIdAndCategoryType" clearable filterable>
            <el-option v-for="category in pageCategories" :value="category.categoryId" :label="category.categoryName"></el-option>
          </el-select>
          <el-button @click="showAddPageCategoryDialog">+</el-button>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="addPageForm.description" clearable></el-input>
        </el-form-item>
        <el-form-item label="图片下载地址">
          <el-input v-model="addPageForm.imgUrl" clearable></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPage" :loading="addPageBtnLoading">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 添加page分类dialog -->
    <el-dialog title="添加page分类" :visible.sync="addPageCategoryDialogVisible" center width="500px">
      <el-form :data="savePageCategoryForm" label-width="80px">
        <el-form-item label="分类名" class="content-center" :rules="[{required: true}]">
          <el-input v-model.trim="savePageCategoryForm.categoryName" clearable style="width: 300px" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPageCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePageCategory">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

  import {addPage} from '@/api/page'
  import {getCategoriesByProjectIdAndCategoryType,addCategory} from '@/api/category'

  let categoryType =  1
  let projectId = localStorage.getItem("projectId")?parseInt(localStorage.getItem("projectId")):null

  export default {

    data() {
      return {
        dialogVisible: false,
        //添加page提交的数据
        addPageForm:{
          projectId: projectId
        },
        addPageBtnLoading:false,
        //page的分类
        pageCategories:[],
        //添加page所属分类的dialog
        addPageCategoryDialogVisible:false,
        savePageCategoryForm:{
          projectId: projectId,
          categoryType: categoryType
        },
      };
    },
    methods: {
      //保存page分类
      savePageCategory(){
        addCategory(this.savePageCategoryForm).then(resp=>{
          this.$notify.success(resp.msg)
          this.addPageCategoryDialogVisible = false
          this.$emit('addPageCategorySuccess')
        })
      },
      //添加page
      addPage(){
        this.addPageBtnLoading = true
        addPage(this.addPageForm).then(resp=>{
          this.$notify.success(resp.msg)
          this.addPageBtnLoading = false
          this.dialogVisible = false
          this.$emit('addPageSuccess')
        }).catch(()=>{
          this.addPageBtnLoading = false
        })
      },
      //点击显示添加分类弹窗
      showAddPageCategoryDialog(){
        this.addPageCategoryDialogVisible = true
      },
      getCategoriesByProjectIdAndCategoryType(type){
        if(type === true){
          //pageCategoryType == 1
          getCategoriesByProjectIdAndCategoryType(projectId,categoryType).then(resp=>{
            this.pageCategories = resp.data
          })
        }
      },

    },
    created(){
    }
  }
</script>
