<template>
  <div v-if="loading">数据加载中...</div>
  <div v-if="!loading">
    <div v-if="loginStatus === false">
      <br />
      <select name="登陆方式" v-model.number="type">
        <option value="1" selected>电话号码+密码</option>
        <option value="2">电话号码+验证码</option>
        <option value="3">163邮箱+密码</option>
        <option value="4">二维码</option>
      </select>
      <br />
      <br />
      <div v-if="type === 1">
        <input type="number" v-model.number="cellphone" placeholder="请输入电话号码" />
        <br />
        <br />
        <input type="password" v-model="password" placeholder="请输入密码" />
      </div>
      <div v-if="type === 2">
        <input type="number" v-model.number="cellphone" placeholder="请输入电话号码" />
        <br />
        <br />
        <input type="number" v-model.number="captcha_code" placeholder="请输入验证码" />
        <button @click="send()" class="send" ref="send_code">发送验证码</button>
      </div>
      <div v-if="type === 3">
        <input type="email" v-model="email" placeholder="请输入网易邮箱账户" />
        <br />
        <br />
        <input type="password" v-model="password" placeholder="请输入密码" />
      </div>
      <div v-if="type === 4">
        <div v-if="!qrCodeImg">二维码加载中...</div>
        <div v-if="qrCodeImg">
          <img :src="qrCodeImg" />
          <br />
          <br />
          <h3 v-if="qrCodeStatus !== false">状态 : {{ qrCodeStatus }}</h3>
        </div>
      </div>
      <br />
      <button @click="login" class="login" v-if="type !== 4">登陆</button>
    </div>
    <div v-if="loginStatus === true">
      <br />
      用户名:{{ account.profile.nickname }} <br /><br />
      头像:<img :src="account.profile.avatarUrl" /> <br /><br />
      背景:<img :src="account.profile.backgroundUrl" /> <br /><br />
      <button @click="logout">退出登陆</button>
    </div>
  </div>
</template>

<script>
import { ref, inject, onMounted, reactive, watch } from 'vue'
export default {
  name: 'Mine',
  setup() {
    const api = inject('api')

    let type = ref(1)
    let loginStatus = ref(false)
    let loading = ref(true)

    let account = reactive({})

    //dom元素
    let send_code = ref(null)

    let cellphone = ref()
    let captcha_code = ref()
    let captcha_cd = ref()

    let email = ref()
    let password = ref()

    //发送验证码
    function send() {
      api
        .loginByPhoneBycode_send({
          phone: cellphone.value
        })
        .then((res) => {
          if (res.code === 200) {
            alert('验证码发送成功')
            captcha_cooldown()
          } else {
            alert('发送失败，请检查电话号码的填写')
          }
        })
    }

    function captcha_cooldown() {
      send_code.value.disabled = true
      let i = 120
      let stop = setInterval(() => {
        send_code.value.innerText = `下次还需${i}秒`
        i--
        if (i === -1) {
          clearInterval(stop)
          send_code.value.innerText = `发送验证码`
        }
      }, 1000)
    }

    //登陆
    function login() {
      if (type.value === 1) {
        //电话号码+密码
        api
          .loginByPhone({
            phone: cellphone.value,
            password: password.value
          })
          .then(
            (res) => {
              if (res.code === 200) {
                alert('登陆成功!')
                setTimeout(location.reload, 1000)
              } else {
                alert('登陆失败，请检查电话号码和密码的填写')
              }
            },
            () => {
              alert('登陆失败，请检查电话号码和密码的填写')
            }
          )
      } else if (type.value === 2) {
        //验证码登陆
        api
          .loginByPhoneBycode_check({
            phone: cellphone.value,
            captcha: captcha_code.value
          })
          .then(
            (res) => {
              if (res.code === 200) {
                //验证码正确
                api
                  .loginByPhone({
                    phone: cellphone.value,
                    captcha: captcha_code.value
                  })
                  .then((res) => {
                    if (res.code === 200) {
                      alert('登陆成功!')
                      location.reload()
                    } else {
                      alert('登陆失败，请检查电话号码和验证码的填写')
                    }
                  })
              } else {
                alert('验证码校验失败！请检查验证码填写！')
              }
            },
            () => {
              alert('验证码校验失败！请检查验证码填写！')
            }
          )
      } else if (type.value === 3) {
        //邮箱登陆
        api
          .loginByEmail({
            email: email.value,
            password: password.value
          })
          .then(
            (res) => {
              if (res.code === 200) {
                alert('登陆成功!')
                location.reload()
              } else {
                alert('发送失败，请检查电话号码和密码的填写')
              }
            },
            () => {
              alert('登陆失败，请检查邮箱和密码的填写')
            }
          )
      }
    }

    //二维码生成key
    let qrCodeKey = ref(null)
    //二维码生成
    let qrCodeImg = ref(false)
    //计时器id
    let qrCodeStop = ref(null)
    let qrCodeStatus = ref(false)

    //监视type情况，如果为二维码
    watch(type, (newValue) => {
      if (newValue === 4) {
        qrCode()
      } else {
        //停止轮询
        clearInterval(qrCodeStop.value)
      }
    })

    //生成二维码
    function qrCode() {
      api.loginByQRcodeGetKey().then((res) => {
        qrCodeKey.value = res.data.unikey
        //生成二维码并开启检测二维码状态
        api.loginByQRcodeGetQRcode({ key: qrCodeKey.value, qrimg: true }).then((res) => {
          qrCodeImg.value = res.data.qrimg
          clearInterval(qrCodeStop.value)
          qrCodeStop.value = setInterval(() => {
            api
              .loginByQRcodeCheckStatus({
                key: qrCodeKey.value
              })
              .then((res) => {
                if (res.code === 800) {
                  qrCodeStatus.value = '二维码已过期,3秒后自动刷新'
                  clearInterval(qrCodeStop.value)
                  setTimeout(() => {
                    qrCode()
                  }, 3000)
                } else if (res.code === 801) {
                  qrCodeStatus.value = '二维码等待扫码'
                } else if (res.code === 802) {
                  qrCodeStatus.value = '二维码等待授权'
                } else if (res.code === 803) {
                  qrCodeStatus.value = '二维码登陆成功,3秒后自动刷新'
                  clearInterval(qrCodeStop.value)
                  setTimeout(() => {
                    location.reload()
                  }, 3000)
                }
              })
          }, 1000)
        })
      })
    }

    //退出登陆
    function logout() {
      api.logout().then(() => {
        location.reload()
      })
    }

    //检测是否已经登录
    onMounted(() => {
      api.loginStatus().then(
        (res) => {
          loading.value = false
          //判断是否已经登陆
          if (String(res.data.account) !== 'null') {
            for (let item in res.data) {
              account[item] = res.data[item]
            }
            loginStatus.value = true
          }
        },
        () => {
          loading.value = false
        }
      )
    })

    return {
      account,
      loading,
      type,
      loginStatus,
      cellphone,
      captcha_code,
      captcha_cd,
      email,
      password,
      send_code,
      qrCode,
      qrCodeStop,
      qrCodeKey,
      qrCodeImg,
      qrCodeStatus,
      send,
      login,
      logout,
      captcha_cooldown
    }
  }
}
</script>

<style scoped>
input {
  border: 1px solid rebeccapurple;
  height: 30px;
}

button {
  height: 30px;
}

.login {
  width: 180px;
}

.send {
  margin-left: 5px;
  width: 100px;
}
</style>
