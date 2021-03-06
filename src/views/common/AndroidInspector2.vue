<!--直接copy AndroidInspector以后优化-->
<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
  <div>
    <!--gutter 列的间距-->
    <el-row>
      <el-card align="center">
        <canvas :width="imgInfo.imgWidth" :height="imgInfo.imgHeight" style="width: 240px;position: absolute" id="canvas"></canvas>
        <img :src="imgInfo.downloadURL" style="width: 240px"/>
      </el-card>
    </el-row>
    <el-row>
      <el-card style="max-height: 300px;overflow: auto;margin-top: 5px">
        <el-alert
          title="点击即可复制到粘贴板"
          type="success">
        </el-alert>
        <ul style="list-style: none;word-break:break-all">
          <li style="border-bottom: 1px solid #eee" v-for="(value,key) in nodeDetail">
            <label style="width: 100px;display: inline-block;">{{ key }}</label>
            <div title="click to copy" style="display: inline;color: #678;cursor: pointer;" v-clipboard:copy="value" v-clipboard:success="onCopy">{{ value }}</div>
          </li>
        </ul>
      </el-card>
    </el-row>
    <el-row style="max-height: 300px;overflow: auto;margin-top: 5px">
      <el-card align="center">
        <el-tree :data="dumpData"
                 ref="tree"
                 :props="defaultProps"
                 v-loading="treeLoading"
                 highlight-current
                 @node-click="nodeClick"
                 :expand-on-click-node="false"
                 node-key="id"
                 :default-expanded-keys="currentExpandedKey">
        </el-tree>
      </el-card>
    </el-row>
  </div>
</template>

<script>
  import utils from 'xutil'
  import {
    getXPath,
    getXPathLite
  } from '@/utils/xpath'

  export default {
    props:{
      //图片信息
      imgInfo: Object,
      //布局数据
      windowHierarchyJSON:Object,
      treeLoading:Boolean
    },
    data () {
      return {
        //画布 盖在图片上方
        canvas:null,
        canvasCtx:null,
        //比例 手机屏幕宽度/画布像素宽度320px  如:1080/320
        scale:null,

        defaultProps:{
          children: 'nodes',
          label: 'class'
        },

        //右侧节点详细数据
        nodeDetail:{},
        dumpData:[],
        //当前选中的node
        selectedNode:{},
        //当前展开的key
        currentExpandedKey:[],

        //所有的节点
        allNodes:[],

        //树节点索引  从0开始 累加
        nodeIndex:0,
      }
    },
    watch:{
      imgInfo(){
        this.scale = (this.imgInfo.imgWidth)/240
        console.log('scale',this.scale)
      },
      windowHierarchyJSON(){
        //from macaca Inspector start https://github.com/macacajs/app-inspector/blob/master/lib/android.js
        var _ = utils.merge({}, utils);
        var origin = _.filter(this.windowHierarchyJSON.hierarchy.node, i => i !== null && typeof i === 'object' && i.package !== 'com.android.systemui');
        var data = this.adaptor(origin[0]);
        //from macaca Inspector end
        //树所有数据
        this.dumpData.push(data);
        console.log("服务端返回的树信息,经过处理后为:",this.dumpData)
      },
      //监听当前选中的node发生改变
      //点击截图或点击树节点 都将触发selectedNode变更
      selectedNode(curVal){
        console.log('检测到当前选择的节点发生变化',curVal)
        //1.重新绘制红色区域
        //清除上一次的红色区域
        this.canvasCtx.clearRect(0, 0, this.imgInfo.imgWidth, this.imgInfo.imgHeight);
        this.canvasCtx.fillStyle = 'red';
        //透明度
        this.canvasCtx.globalAlpha = 0.5;
        this.canvasCtx.fillRect.apply(this.canvasCtx, curVal.bounds);
        //2.网页中间部分选中树
        //展开树
        this.currentExpandedKey.splice(0,1,curVal.id)
        //当前选中
        this.$refs.tree.setCurrentKey(curVal.id)
        console.log("当前选中的node key:"+curVal.id)
        //3.改变右侧节点详细信息
        console.log("dumpData",this.dumpData)
        //使用macaca xpath计算方法
        this.selectedNode.xpath=getXPath(this.dumpData[0],this.getNodePath(this.dumpData[0],this.selectedNode.id))
        console.log("xpath",this.selectedNode.xpath)
        this.selectedNode.xpath_lite=getXPathLite(this.dumpData[0],this.getNodePath(this.dumpData[0],this.selectedNode.id))
        console.log("xpath_lite",this.selectedNode.xpath_lite)
        //copy对象
        let nodeDetail = Object.assign({},this.selectedNode)
        //去除id nodes
        delete nodeDetail.id
        delete nodeDetail.nodes

        this.nodeDetail = nodeDetail
      }
    },
    methods:{
      //点击复制到粘贴板
      onCopy(e){
        this.$notify.success("["+e.text+"]复制成功")
      },
      //获取当前节点在整个tree里的位置，计算xpath的时候需要传入，如：[0,0,1,1]
      getNodePath(tree,targetId){
        let nodePath = null
        function walk(node, path) {
          if(node.id === targetId){
            nodePath = path
          }
          if (node.nodes) {
            node.nodes.forEach((child, index) => {
              walk(child, path.concat([index]));
            });
          }
        }
        walk(tree,[])
        return nodePath
      },
      //树节点被点击
      nodeClick(data){
        console.log('点击树',data)
        this.selectedNode = data;
      },
      initCanvas(){
        this.canvas = document.getElementById("canvas")
        this.canvasCtx = this.canvas.getContext('2d')
      },
      //this method from macaca Inspector https://github.com/macacajs/app-inspector/blob/master/lib/android.js
      adaptor(node) {
        if (node.bounds) {
          const bounds = node.bounds.match(/[\d\.]+/g);

          // [ x, y, width, height]
          node.bounds = [
            ~~bounds[0],
            ~~bounds[1],
            bounds[2] - bounds[0],
            bounds[3] - bounds[1],
          ];
        }
        // not in macaca start
        //所有节点
        // 新增一个id 用于标识node
        node.id=this.nodeIndex
        this.nodeIndex++
        this.allNodes.push(node)
        // not in macaca end

        if (node.node) {
          node.nodes = node.node.length ? node.node : [node.node];
          node.nodes.forEach(this.adaptor);
          delete node.node;
        }
        return node;
      }
    },
    mounted(){
      //init canvas
      this.initCanvas();
      //点击左侧屏幕截图
      this.canvas.onmousedown = e => {
        console.log("canvas onmousedown e",e)
        console.log(this.scale)
        var deviceX = (e.clientX-this.canvas.getBoundingClientRect().left)*this.scale;
        var deviceY = (e.clientY-this.canvas.getBoundingClientRect().top)*this.scale;
        console.log("点击手机屏幕:"+deviceX+","+deviceY)

        //最小面积的节点
        let leastNode = {}
        //选出最小面积的节点
        this.allNodes.forEach(item=>{
          if(deviceX>=item.bounds[0] && deviceY>=item.bounds[1] && deviceX<=item.bounds[0]+item.bounds[2] && deviceY<=item.bounds[1]+item.bounds[3]) {
            if(leastNode.id){
              if(leastNode.bounds[2]*leastNode.bounds[3]>item.bounds[2]*item.bounds[3]){
                leastNode = item
              }
            }else{
              leastNode = item
            }
          }
        })
        this.selectedNode = leastNode
        console.log('最小面积的节点:',this.selectedNode)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  /*选中tree时候的背景色*/
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #8cc5ff;
  }
  .el-alert__title .el-tree-node__label{
    font-size:5px
  }

</style>
