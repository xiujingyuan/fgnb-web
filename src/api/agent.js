import request from '@/utils/request'

export function listOfOnline() {
  return request({
    url: '/agent/listOfOnline',
    method: 'GET',
  })
}
