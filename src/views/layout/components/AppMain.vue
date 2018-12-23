<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <!-- <router-view :key="key"></router-view> -->
      <keep-alive>
        <router-view :key="key"></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      //不缓存页面
      if(this.$route.name === 'EditPage') {
        return new Date()
      }
      else if(this.$route.name === 'DeviceList'){
        return new Date()
      }
      else if(this.$route.name === 'AndroidDump'){
        return new Date()
      }
      else if(this.$route.name === 'Report'){
        return new Date()
      }
      else if(this.$route.name === 'TestTask'){
        return new Date()
      }
      else if(this.$route.name === 'Page'){
        return new Date()
      }
      else if(this.$route.name === 'Agent'){
        return new Date()
      }
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  /*min-height: calc(100vh - 50px);*/
  position: relative;
  overflow: hidden;
}
</style>
