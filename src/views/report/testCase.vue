<template>
  <div>
    <el-collapse>
      <el-collapse-item v-for="item in data">
        <template slot="title">
          {{ item.testCaseName }}
          <el-tag v-if="item.status === 0" type="danger" size="small">失败</el-tag>
          <el-tag v-else-if="item.status === 1" type="success" size="small">成功</el-tag>
          <el-tag v-else-if="item.status === 2" type="warning" size="small">跳过</el-tag>
        </template>
        <div>
          <div style="padding: 10px">
            <div>
              <el-tag size="small" color="white" style="color: #606266">开始时间：{{ item.startTime }}</el-tag>
              <el-tag size="small" color="white" style="color: #606266">结束时间：{{ item.endTime }}</el-tag>
            </div>
            <div style="margin-top: 10px">
              <el-table :data="[item]" border>
                <el-table-column label="视频" align="center">
                  <template scope="scope">
                    <video :src="scope.row.videoUrl" width="300px" controls="controls">
                      浏览器不支持video标签
                    </video>
                  </template>
                </el-table-column>
                <el-table-column label="错误截图" align="center">
                  <template scope="scope">
                    <img :src="scope.row.imgUrl" style="width: 300px"/>
                  </template>
                </el-table-column>
                <el-table-column label="错误信息" align="center">
                  <template scope="scope">
                    <span style="color:red">{{ scope.row.errorInfo }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  export default {
    props:{
      data: Array
    },
    data() {
    },
    methods: {

    },
  }
</script>
