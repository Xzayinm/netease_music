<template>
  <div v-if="loading">数据加载中...</div>
  <template v-if="!loading">
    <div v-if="loginStatus">
      <MusicListView :musicdata="RecommentSheet"></MusicListView>
      <MusicListView2 :musicdata="RecommentSong"></MusicListView2>
    </div>
    <div v-if="!loginStatus">
      请先到我的页面<router-link to="/mine"
                   class="login">登陆</router-link>
    </div>
  </template>
</template>

<script>
import { ref, reactive, inject, onMounted, watch } from 'vue'
import MusicListView from './MusicListView.vue'
import MusicListView2 from './MusicListView2.vue'
export default {
  name: 'MusicList',
  setup() {
    //接口
    let api = inject('api')

    //检测是否已经登录
    let loginStatus = ref(false)
    let loading = ref(true)
    let account = reactive({})
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

    //获取歌单推荐
    let RecommentSheet = reactive({ data: {} })
    let RecommentSong = reactive({ data: {} })
    watch(loginStatus, (newValue) => {
      if (newValue) {
        //推荐歌单
        api
          .personalized({
            limit: 6,
          })
          .then((res) => {
            for (let item in res.result) {
              RecommentSheet.data[item] = res.result[item]
            }
            RecommentSheet.name = '推荐歌单'
          })

        //推荐歌曲
        api
          .personalizedNewsong({
            limit: 6,
          })
          .then((res) => {
            for (let item in res.result) {
              RecommentSong.data[item] = res.result[item]
            }
            RecommentSong.name = '推荐新歌'
          })
      }
    })

    return {
      RecommentSheet,
      RecommentSong,
      loginStatus,
      loading,
      account,
    }
  },
  components: {
    MusicListView,
    MusicListView2,
  },
}
</script>

<style scoped>
.login {
  color: red;
}
</style>