import request from '@/utils/request'
import qs from "qs";

export function queryUserList() {
  return request({
    url: '/user/list',
    method: 'GET',
  })
}

export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: qs.stringify({
      username,
      password
    })
  })
}
