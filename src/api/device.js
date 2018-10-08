import request from '@/utils/request'

//获取手机列表
export function getDeviceList(device) {
  return request({
    method: 'POST',
    url: '/device/list',
    data: device
  })
}

export function getOnLineDeviceList(deviceType){
  return request({
    method: 'GET',
    url: '/device/onLineDeviceList',
    params:{
      deviceType:deviceType
    }
  })
}

export function deviceStart(deviceId) {
  return request({
    method: 'GET',
    url:'/device/start',
    params:{
      deviceId:deviceId
    }
  })
}

export function getDeviceTypes() {
  return request({
    method: 'GET',
    url:'/device/types'
  })
}

export function findByDeviceId(deviceId) {
  return request({
    method: 'GET',
    url:'/device/findById',
    params: {
      deviceId: deviceId
    }
  })
}

//根据项目Id 设备状态 查询设备列表
export function getDeviceListByProjectIdAndDeviceStatus(projectId,deviceStatus) {
  return request({
    method: 'GET',
    url:'/device/getDeviceListByProjectIdAndDeviceStatus',
    params: {
      projectId: projectId,
      deviceStatus:deviceStatus
    }
  })
}
