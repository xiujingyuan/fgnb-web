import request from '@/utils/request'

//开始提交测试任务
export function commitTestTask(form) {
  return request({
    method: 'POST',
    url: '/testTask/commit',
    data:form
  })
}

//查询列表
export function queryList(data) {
  return request({
    method: 'POST',
    url: '/testTask/list',
    data:data
  })
}


