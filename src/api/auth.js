import request from '@/utils/request'

export function loginStatus(data) {
    return request({
      url: '/admin/login/status',
      method: 'post',
      data
    })
  }