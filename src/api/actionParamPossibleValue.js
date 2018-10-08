import request from '@/utils/request'

export function findActionParamPossibleValuesByActionParamId(actionParamId) {
  return request({
    method: 'GET',
    url: '/actionParamPossibleValue/findByActionParamId',
    params: {
      actionParamId:actionParamId
    }
  })
}

