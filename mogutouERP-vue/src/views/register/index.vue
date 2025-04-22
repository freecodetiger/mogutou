<template>
  <div class="register-container">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" auto-complete="on" label-position="left">
      <h3 class="title">蘑菇头 - 注册</h3>
      <el-form-item prop="name">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="registerForm.name" name="name" type="text" auto-complete="on" placeholder="姓名" />
      </el-form-item>
      <el-form-item prop="tel">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="registerForm.tel" name="tel" type="tel" auto-complete="on" placeholder="账号（手机号）" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdType"
          v-model="registerForm.password"
          name="password"
          auto-complete="on"
          placeholder="密码"
          @keyup.enter.native="handleRegister" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-form-item prop="position">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="registerForm.position" name="position" type="text" auto-complete="on" placeholder="职位" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleRegister">
          注册
        </el-button>
      </el-form-item>
      <el-form-item>
        <router-link to="/login" class="login-link">已有账号？点击登录</router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { validateTel } from '@/utils/validate'
import { register } from '@/api/register'

export default {
  name: 'Register',
  data() {
    const validateName = (rule, value, callback) => {
      if (value.length < 2) {
        callback(new Error('姓名不能少于2个字符'))
      } else {
        callback()
      }
    }
    const validatetel = (rule, value, callback) => {
      if (!validateTel(value)) {
        callback(new Error('账号为11位手机号码'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    const validatePosition = (rule, value, callback) => {
      if (value.length < 2) {
        callback(new Error('职位不能少于2个字符'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        name: '',
        tel: '',
        password: '',
        position: ''
      },
      registerRules: {
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        tel: [{ required: true, trigger: 'blur', validator: validatetel }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        position: [{ required: true, trigger: 'blur', validator: validatePosition }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.registerForm.tel = this.registerForm.tel.toString()

          // 模拟注册成功
          setTimeout(() => {
            this.loading = false
            this.$message.success('注册成功，请登录')
            this.$router.push({ path: '/login' })
          }, 1000)
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.register-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.register-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .register-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .login-link {
    color: $light_gray;
    text-align: center;
    display: block;
    font-size: 14px;
    margin-top: 10px;
  }
}
</style>
