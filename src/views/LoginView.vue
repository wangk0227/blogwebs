<template>
  <div class="box">
    <div class="main">
      <div class="demo-login">
        <Title class="title" :level="2">博客后台登录</Title>
        <Login @on-submit="handleSubmit">
          <UserName name="username" :rules="usernameRule"/>
          <Password name="password" :rules="passwordRule"/>
          <Captcha v-if="captcha_show" class="demo-login-captcha" name="captcha" :count-down="0"
                   @on-get-captcha="handleGetCaptcha">
            <template #text>
              <img :src="captcha">
            </template>
          </Captcha>
          <Captcha v-else class="demo-login-captcha" name="captcha" :count-down="0">
            <template #text>
              <span>{{ captcha_countdown }}</span>
            </template>
          </Captcha>
          <Submit/>
        </Login>
      </div>
    </div>
  </div>
</template>

<script>
import {post_user_code, post_user_login, delete_user_code} from '../requestapi/user_api'
import {
  save_user_data,
  save_token,
} from '../utlis/cookie'
import {BASE_URL, pwd_md5} from '../utlis/config'

export default {
  data() {
    return {
      captcha: '',
      code: '',
      captcha_num: 0,
      captcha_show: true,
      captcha_countdown: 60,
      passwordRule: [
        {
          required: true, message: '密码不能为空！', trigger: 'change'
        },
        {
          min: 6, message: '密码不能少于6位！', trigger: 'change'
        }
      ],
      usernameRule: [
        {
          required: true, message: '账户不能为空！', trigger: 'change'
        },
        {
          min: 6, message: '账户不能少于6位！', trigger: 'change'
        }
      ]
    }
  },
  created() {
    post_user_code().then((response) => {
      let data = response.data
      if (data.code === 200) {
        this.code = data.captcha.toLowerCase()
        this.captcha = BASE_URL + data.url
      } else {
        this.$Message.error({content: data.error, duration: 3})
      }
    }).catch((error) => {
    }).finally(() => {
    })
  },
  methods: {
    handleSubmit(valid, {username, password, captcha}) {
      console.log( pwd_md5(password))
      if (valid) {
        const data = {'username': username, 'pwd': pwd_md5(password)} // 登录发送的账户通过md5加密
        if (captcha.toLowerCase() !== this.code.toLowerCase()) {
          this.$Message.error({content: '验证码错误!', duration: 3})
          this.handleGetCaptcha()
        } else {
          post_user_login(data).then(res => {
            const data = res.data
            this.$Message.success({content: data.data, duration: 3})
            save_token(data.token);
            save_user_data(JSON.stringify(data.user_data))
            this.$router.push({name: 'Admin'});
            this.deleteCaptcha() // 登录成功后删除全部的验证码图片
          }).catch(error => {
            this.$Message.error({content: error, duration: 3})
          }).finally(() => {
          })
        }
      }
    },
    handleGetCaptcha() {
      // 点击切换验证码
      post_user_code().then(res => {
        let data = res.data
        this.code = data.captcha
        this.captcha = BASE_URL + data.url
      }).catch((error) => {
        console.log(error)
        this.$Message.error({content: error, duration: 3})
      }).finally(() => {
        this.captcha_num += 1
      })
    },
    deleteCaptcha() { // 登录后清除全部的验证码图片
      delete_user_code().then(res => {
      }).catch(error => {
      }).finally(() => [])
    },
    countdown() {
      let captcha_time;
      if (this.captcha_countdown === 0) {
        this.captcha_show = true
        this.captcha_num = 0
        this.captcha_countdown = 60
        clearTimeout(captcha_time)
        return false
      } else {
        this.captcha_countdown -= 1
      }
      captcha_time = setTimeout(() => {
        this.countdown()
      }, 1000)
    }
  },
  watch: {
    captcha_num() {
      if (this.captcha_num >= 10) {
        this.captcha_show = false
      }
    },
    captcha_show() {
      if (!this.captcha_show) {
        this.countdown()
      }
    },

  }
}
</script>
<style scoped>
.box { /* div的CSS样式 */
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #409EFF;
}

.main {
  width: 550px;
  height: 550px;
  top: 10%;
  position: relative;
  margin: 0 auto !important;
  background-color: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  border-radius: 5px;
}

.title {
  text-align: center;

}

.demo-login {
  position: absolute;
  width: 400px;
  height: 300px;
  margin: auto;
  top: 0;
  bottom: 30px;
  left: 0;
  right: 0;
}

.demo-login-captcha .ivu-btn img {
  height: 28px;
  position: relative;
  top: 4px;
}
</style>