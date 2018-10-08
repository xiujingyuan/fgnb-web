import request from '@/utils/request'
//新增变量
export function getReportData(testTaskId) {
  return request({
    method: 'GET',
    url: '/testTaskReport/getReport',
    params:{
      testTaskId: testTaskId
    }
  })
}

