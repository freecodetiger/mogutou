import request from '@/utils/request'

export function register(data) {
  console.log('发送注册请求:', data);
  return request({
    url: '/register', // 注册接口路径
    method: 'post',
    data: {
      name: data.name,
      tel: data.tel,
      password: data.password,
      position: data.position
    }
  })
}
