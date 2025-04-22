import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        // 模拟登录成功
        if (userInfo.tel === '11223344556' && userInfo.password === '11223344556') {
          // 生成模拟的token
          const token = 'mock-token-' + Date.now()
          setToken(token)
          commit('SET_TOKEN', token)
          resolve()
        } else {
          // 如果不是默认账号密码，尝试调用登录接口
          login(userInfo.tel, userInfo.password).then(response => {
            setToken(response.token)
            commit('SET_TOKEN', response.token)
            resolve()
          }).catch(error => {
            reject(error)
          })
        }
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        // 模拟获取用户信息
        setTimeout(() => {
          const data = {
            name: 'admin',
            roles: ['admin']
          }
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          resolve(data)
        }, 500)
      })
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve) => {
        // 模拟登出
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
