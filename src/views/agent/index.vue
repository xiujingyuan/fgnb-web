<template>
  <div class="app-container">
    agent
  </div>
</template>

<script>

  import {listOfOnline} from '@/api/agent'

export default {
  data(){
    return {
      agents:[]
    }
  },
  methods:{
    getOnlineAgents(){
      listOfOnline().then(resp=>{
      })
    }
  },
  created(){
    this.getOnlineAgents()
  }
}
</script>
