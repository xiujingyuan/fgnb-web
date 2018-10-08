import request from '@/utils/request'
import qs from 'qs'

//新增项目
export function addProject(form) {
  return request({
    method: 'POST',
    url: '/project/add',
    data: qs.stringify(form)
  })
}
//修改项目
export function updateProject(form) {
  return request({
    method: 'POST',
    url: '/project/update',
    data: qs.stringify(form)
  })
}
//删除项目
export function deleteProject(id) {
  return request({
    method: 'GET',
    url: '/project/delete',
    params: {
      projectId: id
    }
  })
}
//查询项目列表
export function queryProjectList(form) {
  return request({
    method: 'GET',
    url: '/project/list',
    params: form
  })
}

//获取所有项目名
export function getProjectNames() {
  return request({
    method: 'GET',
    url: '/project/names',
  })
}

//获取Project表里有的项目类型
export function getProjectTypes() {
  return request({
    method: 'GET',
    url: '/project/types',
  })
}


