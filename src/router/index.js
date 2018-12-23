import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path:'/deviceList',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'DeviceList',
        component: ()=> import('@/views/devicelist/index'),
        meta: { title: '远程真机', icon: 'deviceControl' }
      }
    ]
  },

  {
    path:'/project',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Project',
        component: ()=> import('@/views/project/index'),
        meta: { title: '项目', icon: 'project' }
      }
    ]
  },
  {
    path:'/globalVar',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'GlobalVar',
        component: ()=> import('@/views/globalvar/index'),
        meta: { title: '全局变量', icon: 'globalvar' }
      }
    ]
  },
  {
    path:'/page',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Page',
        component: ()=> import('@/views/page/index'),
        meta: { title: 'Page', icon: 'page' }
      }
    ]
  },

  {
    path:'/testCase',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'TestCase',
        component: ()=> import('@/views/testcase/index'),
        meta: { title: '测试用例', icon: 'testcase' }
      }
    ]
  },

  {
    path:'/testSuite',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'TestSuite',
        component: ()=> import('@/views/testsuite/index'),
        meta: { title: '测试集', icon: 'testsuite' }
      }
    ]
  },

  {
    path:'/testPlan',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'TestPlan',
        component: ()=> import('@/views/testplan/index'),
        meta: { title: '测试计划', icon: 'testplan' }
      }
    ]
  },

  {
    path:'/testTask',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'TestTask',
        component: ()=> import('@/views/testtask/index'),
        meta: { title: '测试任务', icon: 'testtask' }
      }
    ]
  },

  {
    path:'/agent',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Agent',
        component: ()=> import('@/views/agent/index'),
        meta: { title: 'Agent', icon: 'node' }
      }
    ]
  },

  {
    path:'/editPage/:pageId',
    component: Layout,
    hidden:true,
    children: [
      {
        path: 'index',
        name: 'EditPage',
        component: ()=> import('@/views/editpage/index'),
        meta: { title: 'EditPage', icon: 'page' }
      }
    ]
  },

  {
    path:'/deviceController',
    component: Layout,
    hidden:true,
    children: [
      {
        path: 'index',
        name: 'DeviceController',
        component: ()=> import('@/views/devicecontroller/index'),
        meta: { title: 'DeviceController', icon: 'page' }
      }
    ]
  },

  {
    path:'/report/:testTaskId',
    component: Layout,
    hidden:true,
    children: [
      {
        path: 'index',
        name: 'Report',
        component: ()=> import('@/views/report/index'),
        meta: { title: '测试报告', icon: 'page' }
      }
    ]
  },

  {
    path:'/androidDump',
    component: Layout,
    hidden:true,
    children: [
      {
        path: 'index',
        name: 'AndroidDump',
        component: ()=> import('@/views/androiddump/index'),
        meta: { title: 'AndroidDump', icon: 'page' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

