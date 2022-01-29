<template>
  <div class="login">
    <div class="title">申请注册</div>
    <form class="login__field" @submit.prevent="submitForm">
      <div class="input__wrapper">
        <label for="username">用户名*</label>
        <input v-model="username" class="input--style" type="text" name="username" placeholder="用户名" required id="username">
      </div>
      <div class="input__wrapper">
        <label for="password">密码*</label>
        <input v-model="password" class="input--style" type="password" name="password" placeholder="密码" required id="password">
      </div>
      <div class="input__wrapper">
        <label for="confirm">确认密码*</label>
        <input v-model="repassword" class="input--style" type="password" placeholder="确认密码" id="confirm" required>
      </div>
      <div class="input__wrapper">
        <label for="reg-code">输入注册码*</label>
        <input v-model="regCode" class="input--style" type="text" name="reg-code" placeholder="输入注册码" id="reg-code" required>
      </div>
      <FakeButton 
        btnType="submit"
        :loading="loader"
        btnText="注册" />
      <button class="btn btn--style" type="button" @click.prevent="gotoLogin">去登陆</button>
    </form>
    <div>{{errMsg}}</div>
  </div>
</template>

<script>
// @ is an alias to /src
import FakeButton from '@/components/Button.vue'
const axios = require('axios')
const domain = ''//'http://192.168.8.27'
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      repassword: '',
      regCode: '',
      loader: false,
      errMsg: ''
    }
  },
  components: {
    FakeButton
  },
  methods: {
    gotoLogin() {
      this.$router.push('./login/login-in')
    },
    submitForm() {
      
      const {username, password, regCode, repassword} = this
      console.log(username, password, regCode, repassword)
      if(password!==repassword) {
        this.errMsg = "重复密码错误"
        return false
      }
      if(!regCode) {
        this.errMsg = "请输入注册码"
        return false
      }
      if (username&&password&&regCode) {
        this.loader = true
        axios.post(`${domain}/user/registion`, {
          username,
          password,
          regCode
        }).then(response => {
          if(response.data) {
            const token = response.data
            localStorage.setItem('token', token)
            setTimeout(() => {
              this.$router.push('/record/list')
            }, 1000)
            this.errMsg ="注册成功，开始跳转"
            this.loader = false
          }
        }).catch(err => {
          console.log(err)
          this.errMsg ="注册失败"
          this.loader = false
        })
      } 
      
    },
  }
}
</script>
<style lang="scss" scoped>
.title{
  font-size: 18px;
  margin: 20px auto;
}
form {
  width: 327px;
  margin: auto;
}
.input__wrapper {
  text-align: left;
  margin: 15px;
  display: flex;
  flex-direction: column;
  label {
    color: #c39483;
  }
  input{
    width: 327px;
    height: 50px;
    margin-top: 5px;
    &:focus {
      border: 1px solid #8898df
    }
  }
  .input--style {
    border-radius: 5px;
    padding: 5px 10px;
    border: 1px solid #bebebe
  }
}

.btn {
  width: 120px;
  height: 50px;
  margin: 20px;
  cursor: pointer;
}
.btn--style {
  background: rgb(83, 151, 190);
  color: rgb(60, 75, 75);
  border: 1px solid #bebebe;
  border-radius: 5px;
  color: white
}
.submit--style {
  background: white;
  color: black;
}
</style>
