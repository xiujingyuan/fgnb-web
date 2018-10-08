import request from '@/utils/request'
import qs from 'qs'

export function addTestSuite(data){
  return request({
    method: 'POST',
    url: '/testSuite/add',
    data: data
  })
}

export function updateTestSuite(data){
  return request({
    method: 'POST',
    url: '/testSuite/update',
    data: data
  })
}

export function findTestSuitesByProjectId(projectId) {
  return request({
    method: 'GET',
    url: '/testSuite/findTestSuitesByProjectId',
    params:{
      projectId: projectId
    }
  })
}

export function deleteTestSuite(testSuiteId){
  return request({
    method: 'GET',
    url: '/testSuite/delete',
    params:{
      testSuiteId: testSuiteId
    }
  })
}

export function getTestSuiteDetailInfoByTestSuiteId(testSuiteId){
  return request({
    method: 'GET',
    url: '/testSuite/getTestSuiteDetailInfoByTestSuiteId',
    params:{
      testSuiteId: testSuiteId
    }
  })
}

