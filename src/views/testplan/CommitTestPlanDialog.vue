<template>
  <div>
    <el-dialog title="提交测试任务" :visible.sync="dialogVisible" width="1200px">
      <el-row :gutter="5" style="height: 500px">
        <el-col :span="12" style="height: 100%">
          <el-card shadow="always" style="height: 100%;overflow: auto">
            <el-form label-width="120px">
              <el-form-item label="测试计划">
                {{ testPlanInfo.testPlanName }}
              </el-form-item>
              <el-form-item label="描述">
                {{ testPlanInfo.description }}
              </el-form-item>
              <el-form-item label="每台手机测试前">
                {{ testPlanInfo.testPlanBeforeSuiteActionName }}
              </el-form-item>
              <el-form-item label="每条用例执行前">
                {{ testPlanInfo.testPlanBeforeMethodActionName }}
              </el-form-item>
              <el-form-item label="测试用例">
                <el-tree :data="testPlanInfo.testCasesTreeData" default-expand-all></el-tree>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="12" style="height: 100%">
          <el-card style="height: 100%;overflow: auto">
            <el-form label-width="120px">
              <el-form-item label="测试任务名" :rules="[{required: true}]">
                <el-input v-model="commitTestTaskForm.testTaskName" style="width: 80%" clearable></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="commitTestTaskForm.description" style="width: 80%" clearable></el-input>
              </el-form-item>
              <el-form-item label="设备" :rules="[{required: true}]">
                <el-select
                  style="width: 80%"
                  clearable
                  filterable
                  v-model="commitTestTaskForm.testTaskDeviceIds"
                  multiple @visible-change="selectDevice">
                  <el-option v-for="device in selectableDeviceList" :label="device.deviceId" :value="device.deviceId">
                    <span style="float: left;margin-right: 10px">{{ device.deviceId }}</span>
                    <span style="float: left;margin-right: 10px">{{ device.deviceName }}</span>
                    <span style="float: left;margin-right: 10px">{{ device.memSize }}</span>
                    <span style="float: left;margin-right: 10px">{{ device.resolution }}</span>
                    <span style="float: left">{{ device.systemVersion }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="用例分发策略" :rules="[{required: true}]">
                <el-radio v-model="commitTestTaskForm.runMode" label="1">
                  兼容模式
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    content="所有设备并行执行同一份用例">
                    <i class="el-icon-question" slot="reference"></i>
                  </el-popover>
                </el-radio>
                <el-radio v-model="commitTestTaskForm.runMode" label="2">
                  高效模式
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    content="用例平均分配给所有设备并行执行">
                    <i class="el-icon-question" slot="reference"></i>
                  </el-popover>
                </el-radio>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="commitTestTaskLoading" @click="commitTestTask">提 交</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>

  import {getDeviceListByProjectIdAndDeviceStatus} from '@/api/device'
  import {commitTestTask} from '@/api/testTask'

  export default {
    props:{
      projectId: Number,
      testPlanId: Number,
    },
    watch:{
      //父组件传递过来的测试计划id
      testPlanId(val){
        this.commitTestTaskForm.testPlanId = val
      }
    },
    data() {
      return {
        dialogVisible: false,
        //测试计划信息
        testPlanInfo:{
          testPlanName:'',
          description:'',
          testPlanBeforeSuiteActionName:'',
          testPlanBeforeMethodActionName:'',
          testCasesTreeData:[]
        },
        //测试任务提交表单
        commitTestTaskForm:{
          projectId: this.projectId,
          testPlanId: null,
          testTaskName:'',
          description:'',
          runMode:'1',
          testTaskDeviceIds:[],
        },
        //可供选择的设备列表
        selectableDeviceList:[],
        //提交测试任务loading
        commitTestTaskLoading:false
      };
    },
    methods: {
      //选择设备
      selectDevice(type){
        if(type){
          //1代表闲置在线的设备
          getDeviceListByProjectIdAndDeviceStatus(this.projectId,1).then(resp=>{
            this.selectableDeviceList = resp.data
          })
        }
      },
      //提交测试任务
      commitTestTask(){
        this.commitTestTaskLoading = true
        commitTestTask(this.commitTestTaskForm).then(resp=>{
          this.$notify.success(resp.msg)
          this.commitTestTaskLoading = false
          this.dialogVisible = false
        }).catch(_=>{
          this.commitTestTaskLoading = false
        })
      }
    },
    created(){
    }
  }
</script>

<style >
  .el-card__body{
    height: 100%;
  }
</style>
