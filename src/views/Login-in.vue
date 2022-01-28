<template>
  <div class="login">
    <div class="title">登录</div>
    <form class="login__field" @submit.prevent="submitForm">
      <div class="input__wrapper">
        <label for="username">用户名*</label>
        <input v-model="username" class="input--style" type="text" name="username" placeholder="用户名" required id="username">
      </div>
      <div class="input__wrapper">
        <label for="password">密码*</label>
        <input v-model="password" class="input--style" type="password" name="password" placeholder="密码" required id="password">
      </div>
      <button class="btn btn--style submit submit--style" type="submit">登录</button>
      <button class="btn btn--style" type="button" @click.prevent="gotoRegist">去注册</button>
    </form>
    <div class="error">{{errMsg}}</div>
  </div>
</template>

<script>
// @ is an alias to /src
const axios = require('axios')
const domain = ''//'http://192.168.8.27'
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      errMsg: ''
    }
  },
  components: {
    
  },
  methods: {
    gotoRegist() {
      this.$router.push('/login')
    },
    submitForm() {
      
      console.log('???')
      const {username, password} = this
      if (username&&password) {
        axios.post(`${domain}/user/login`, {
          username,
          password,
        }).then(response => {
          if(response.data) {
            const data= response.data
            if (data.msg) {
              this.errMsg = data.msg
            } else {
              localStorage.setItem('token', data)
              this.$router.push('/record/list')
            }
          }
        }).catch(err => console.log(err))
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
