import request from '@/utils/request'
import qs from 'qs'
//新增action
export function findActionParamsByActionId(actionId) {
  return request({
    method: 'GET',
    url: '/actionParam/findByActionId',
    params: {
      actionId:actionId
    }
  })
}

