import request from '@/utils/request'
import qs from 'qs'
//新增action
export function addAction(data) {
  return request({
    method: 'POST',
    url: '/action/add',
    data: data
  })
}

//修改action
export function updateAction(data) {
  return request({
    method: 'POST',
    url: '/action/update',
    data: data
  })
}

//找出可供选择的action
export function findSelectableActions(projectId) {
  return request({
    method: 'GET',
    url: '/action/findSelectableActions',
    params:{
      projectId:projectId
    }
  })
}
//根据pageId查出关联的action
export function findActionsByPageId(pageId,pageIndex,countPerPage) {
  return request({
    method: 'GET',
    url: '/action/findActionsByPageId',
    params:{
      pageId:pageId,
      pageIndex:pageIndex,
      countPerPage:countPerPage
    }
  })
}

//查询actionList
export function getActionList(form) {
  return request({
    method: 'POST',
    url: '/action/list',
    data: form
  })
}

export function deleteAction(actionId) {
  return request({
    method: 'GET',
    url: '/action/delete',
    params:{
      actionId:actionId,
    }
  })
}

//查询action详细信息
export function getActionDetailInfoByActionId(actionId){
  return request({
    method: 'GET',
    url: '/action/getActionDetailInfoByActionId',
    params:{
      actionId:actionId
    }
  })
}

//调试action
export function debugAction(action) {
  return request({
    method: 'POST',
    url: '/action/debug',
    data: action
  })
}

export function findActionByProjectIdAndActionType(projectId,actionType) {
  return request({
    method: 'GET',
    url: '/action/findActionByProjectIdAndActionType',
    params:{
      projectId:projectId,
      actionType:actionType
    }
  })
}
export function findCreatorByProjectIdAndActionType(projectId,actionType) {
  return request({
    method: 'GET',
    url: '/action/findCreatorByProjectIdAndActionType',
    params:{
      projectId:projectId,
      actionType:actionType
    }
  })
}
export function findUpdatorByProjectIdAndActionType(projectId,actionType) {
  return request({
    method: 'GET',
    url: '/action/findUpdatorByProjectIdAndActionType',
    params:{
      projectId:projectId,
      actionType:actionType
    }
  })
}
