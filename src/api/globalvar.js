import request from '@/utils/request'
import qs from 'qs'

export function addGlobalVar(data) {
  return request({
    method: 'POST',
    url: '/globalVar/add',
    data: data
  })
}

export function updateGlobalVar(data) {
  return request({
    method: 'POST',
    url: '/globalVar/update',
    data: data
  })
}

export function queryGlobalVarList(data) {
  return request({
    method: 'POST',
    url: '/globalVar/list',
    data: data
  })
}

export function deleteGlobalVar(globalVarId) {
  return request({
    method: 'GET',
    url: '/globalVar/delete',
    params: {
      globalVarId:globalVarId
    }
  })
}

export function findGlobalVarsByProjectId(projectId) {
  return request({
    method: 'GET',
    url: '/globalVar/findGlobalVarsByProjectId',
    params: {
      projectId:projectId
    }
  })
}

