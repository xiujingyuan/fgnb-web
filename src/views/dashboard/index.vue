<template>
  <div class="dashboard-container">
    <h1>Welcome，{{ name }}</h1>
    <h2>
      当前项目:{{ currentProjectName }}
    </h2>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'name','token'
    ]),
    currentProjectName(){
      return localStorage.getItem("projectName")
    }
  },
  data(){
    return {
      // currentProjectName: null
    }
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
