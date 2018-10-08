import request from '@/utils/request'
import qs from 'qs'

export function addTestPlan(data) {
  return request({
    url: '/testPlan/add',
    method: 'POST',
    data: data
  })
}

export function updateTestPlan(data) {
  return request({
    url: '/testPlan/update',
    method: 'POST',
    data: data
  })
}

export function findTestPlansByProjectId(projectId) {
  return request({
    url: '/testPlan/findTestPlansByProjectId',
    method: 'GET',
    params:{
      projectId:projectId
    }
  })
}

export function deleteTestPlan(testPlanId) {
  return request({
    url: '/testPlan/delete',
    method: 'GET',
    params:{
      testPlanId:testPlanId
    }
  })
}

export function findTestPlanDetailInfoByTestPlanId(testPlanId) {
  return request({
    url: '/testPlan/findTestPlanDetailInfoByTestPlanId',
    method: 'GET',
    params:{
      testPlanId:testPlanId
    }
  })
}

export function findTestPlanInfoVoByTestPlanId(testPlanId) {
  return request({
    url: '/testPlan/findTestPlanInfoVoByTestPlanId',
    method: 'GET',
    params:{
      testPlanId:testPlanId
    }
  })
}
