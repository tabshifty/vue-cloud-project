<template>
  <div class="login">
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
      <button class="submit submit--style" type="submit">注册</button>
    </form>
  </div>
</template>

<script>
// @ is an alias to /src
const axios = require('axios')
const domain = 'http://192.168.8.27'
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      repassword: '',
      regCode: ''
    }
  },
  components: {
    
  },
  methods: {
    submitForm() {
      
      console.log('???')
      const {username, password, regCode, repassword} = this
      console.log(username, password, regCode, repassword)
      if(password!==repassword) return false
      if(!regCode) return false
      if (username&&password&&regCode) {
        axios.post(`${domain}/user/registion`, {
          username,
          password,
          regCode
        }).then(response => {
          console.log(response)
        }).catch(err => console.log(err))
      } 
      
    },
  }
}
</script>
<style lang="scss" scoped>
form {
  width: 327px;
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

.submit {
  width: 120px;
  height: 50px;
  cursor: pointer;
}
.submit--style {
  background: white;
  color: rgb(60, 75, 75);
  border: 1px solid #bebebe;
  border-radius: 5px;
}
</style>
