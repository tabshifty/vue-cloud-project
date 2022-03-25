<template>
  <div class="login">
    <!-- <div class="title">申请注册</div>
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
      <button class="btn btn--style submit submit--style" type="submit">注册</button>
      <button class="btn btn--style" type="button" @click.prevent="gotoLogin">去登陆</button>
    </form> -->
    <div class="form-wrapper">
      <h3>申请注册</h3>
      <form  @submit.prevent="submitForm">
        <div class="input-wrapper">
          <span class="icon-user">&#xe7d5;</span>
          <input v-model="username" type="text" name="username" required placeholder="用户名*" @keyup="validateUsername">
        </div>
        <div class="hint">
          <span :class="[`hint__normal`, {hint__error:!validation.username}]"><span></span>{{validation.usernamErrorMsg}}</span>
          <span class="hint__error"></span>
        </div>
        <div class="input-wrapper">
          <span class="icon-password">&#xe608;</span>
          <input v-model="password" type="password" name="password" required placeholder="密码*" @keyup="validatePassword">
        </div>
        <div class="hint">
          <span :class="[`hint__normal`, {hint__error:!validation.password}]"><span></span>{{validation.passwordErrorMsg}}</span>
          <span class="hint__error"></span>
        </div>
        <div class="input-wrapper">
          <span class="icon-password">&#xe608;</span>
          <input v-model="repassword" type="password" required placeholder="确认密码*" @keyup="validatePassword">
        </div>
        <div class="hint">
          <span :class="[`hint__normal`, {hint__error:!validation.username}]"><span></span>{{validation.repasswordErrorMsg}}</span>
          <span class="hint__error"></span>
        </div>
        <div class="input-wrapper">
          <span class="icon-invite">&#xe637;</span>
          <input v-model="regCode" type="text" required placeholder="邀请码*">
        </div>
        <div class="hint">
          <span :class="{hint__error:!validation.username}"><span></span>{{validation.regcodeErrorMsg}}</span>
          <span class="hint__error"></span>
        </div>
        <div class="submit-wrapper">
          <button type="submit" :disabled="disabled">
            <span>注册</span>
            <span v-if="disabled" class="loader"></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import debounce from 'debounce'
const axios = require('axios')
const domain = 'http://124.223.65.151'//'http://192.168.8.27'
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      repassword: '',
      regCode: '',
      validation: {
        username: true,
        password: true,
        repassword: true,
        regCode:true,
        usernamErrorMsg: '至少4位数字和字母组合',
        passwordErrorMsg: '至少8位数字和字母组合以及特殊字符',
        repasswordErrorMsg: '确认密码',
        regcodeErrorMsg: '',
      },
      disabled: false
    }
  },
  components: {
    
  },
  methods: {
    gotoLogin() {
      this.$router.push('/login/login-in')
    },
    validateUsername: debounce(function() {
      this.validation.username = !this.username&&/^(?=.*[a-z]).{6,10}$/g.test(this.username)
    },200),
    validatePassword: debounce(function() {
      this.validation.password = !this.password && /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/g.test(this.password)
    }),
    validateRepassword: debounce(function() {
      this.validation.password = !this.repassword && !this.password && this.password === this.repassword
    }),
    submitForm() {
      this.disabled = true
      const {username, password, regCode, repassword} = this
      if(password!==repassword) return false
      if(!regCode) return false
      if (username&&password&&regCode) {
        axios.post(`${domain}/user/registion`, {
          username,
          password,
          regCode
        }).then(response => {
          if(response.data) {
            const token = response.data
            localStorage.setItem('token', token)
            this.$router.push('/record/list')
            this.disabled = false
          }
        }).catch(err => {
          console.log(err)
          this.disabled = false
        })
      } 
      
    },
  }
}
</script>
<style lang="scss" scoped>
  .login {
    min-height: 100vh;
    padding: 0 25px;
    padding-top: 100px;
  }

  .form-wrapper {
    width: 100%;
    max-width: 500px;
    padding: 20px 30px;
    background-color: #E4EBF5;
    border-radius: 8px;
    text-align: center;
    margin: auto;
    box-shadow: 0.8rem 0.8rem 1.4rem #c8d0e7, -0.2rem -0.2rem 1.8rem #ffffff;
  }
  h3 {
    color: #9baacf;
    margin: 0;
    padding: 10px 0 30px 0;
  }
  .input-wrapper {
    display: flex;
    align-items: center;
    border: 1px solid #c8d0e7;
    border-radius: 10px;
    /* box-shadow: 0.3rem 0.3rem 0.6rem #c8d0e7, -0.2rem -0.2rem 0.5rem #ffffff; */
  }
  .hint {
    padding-left: .25rem;
    text-align: left;
    font-size: 12px;
    margin-top: 5px;
    margin-bottom: 10px;
    color: #9baacf;
    &__error {
      color: chocolate;
      span {
        // &#xe747;
        &::before {
          content: "\e747" !important;
        }
      }
    }
    &__normal >span {
      font-family: 'iconfont';
      &::before {
        content: "\e8ba";
      }
    }
  }
  .input-wrapper > span {
    font-family: 'iconfont';
    display: inline-block;
    font-size: 16px;
    padding: 0 10px;
    color: #9baacf;
  }
  input {
    color: #9baacf;
    box-sizing: border-box;
    border: none;
    width: 100%;
    height: 2.5rem;
    border-radius: 10px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    padding: .5rem 1rem;
    background-color: transparent;
    box-shadow: inset 0.2rem 0.2rem 0.5rem #c8d0e7, inset -0.2rem -0.2rem 0.5rem #ffffff;
    transition: box-shadow .3s ease;
    &:focus,&:hover,&:not(:placeholder-shown) {
      box-shadow: inset 0.1rem 0.1rem 0.2rem #c8d0e7, inset -0.1rem -0.1rem 0.2rem #ffffff;
    }
  }
  input:focus {
    outline: none;
    /* box-shadow: none; */
  }
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 2.5rem;
    background-color: transparent;
    border: none;
    margin-top: 20px;
    border-radius: 6px;
    box-shadow: 0.3rem 0.3rem 0.6rem #c8d0e7, -0.2rem -0.2rem 0.5rem #ffffff;
    cursor: pointer;
    text-transform: uppercase;
    color: #9baacf;
    transition: box-shadow .6s cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  button:focus {
    box-shadow: inset 0.15rem 0.15rem 0.45rem #c8d0e7, inset -0.1rem -0.1rem 0.4rem #ffffff;
    
  }
  button >span {
    margin-right: 10px;
  }
  .loader {
    margin-right: 0;
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 15px;
    border-top: 2px solid #c8d0e7;
    border-right: 2px solid transparent;
    animation: rotation 1s linear infinite both;
  }
  @keyframes rotation {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
