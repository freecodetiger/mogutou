import request from '@/utils/request'

export function login(tel, password) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      tel: tel,
      password: password // 使用明文密码
    }
  })
}

export function getInfo() {
  return request({
    url: '/user',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}
