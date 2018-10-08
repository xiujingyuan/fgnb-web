import request from '@/utils/request'
import qs from 'qs'
//新增page
export function addPage(form) {
  return request({
    method: 'POST',
    url: '/page/add',
    data: qs.stringify(form)
  })
}


//删除page
export function deletePage(pageId) {
  return request({
    method: 'GET',
    url: '/page/delete',
    params:{
      pageId: pageId
    }
  })
}
//根据pageId查询page
export function findPageById(pageId) {
  return request({
    method: 'GET',
    url: '/page/findPageById',
    params: {
      pageId: pageId
    }
  })
}
//修改page
export function savePage(form) {
  return request({
    method: 'POST',
    url: '/page/update',
    data: qs.stringify(form)
  })
}

//根据模块id 查出该项目下的所有apge
export function findByModuleId(moduleId) {
  return request({
    method: 'GET',
    url: '/page/findByModuleId',
    params: {
      moduleId:moduleId
    }
  })
}

//根据项目id 查出该项目下的所有apge
export function findByProjectId(projectId) {
  return request({
    method: 'GET',
    url: '/page/findByProjectId',
    params: {
      projectId:projectId
    }
  })
}

//根据page分类查找pageList
export function findByPageCategory(data) {
  return request({
    method: 'POST',
    url: '/page/findByPageCategory',
    data: data
  })
}


