<template>
  <div v-if="!loading">加载中...</div>
  <div class="player" v-if="loading">
    <div class="header">
      <div class="title">
        <router-link to="/">
          <i class="iconfont icon-shouye left"></i>
        </router-link>
        <div class="music-info">
          <p>{{ data2.songs[0].al.name }}</p>
          <p class="author">{{ SpliceName(data2.songs[0].ar) }}</p>
        </div>
        <router-link to="/search">
          <i class="iconfont icon-sousuo right"></i>
        </router-link>
      </div>
    </div>
    <div class="song-info">
      <div class="song-info-img">
        <img :src="data2.songs[0].al.picUrl" />
      </div>
      <div class="iconbox">
        <i class="iconfont icon-shoucang2 left" :class="{ ca: likeStatus }" @click="like"></i>
        <i class="box"></i>
        <i class="iconfont icon-xiazai right" @click="download"></i>
      </div>
    </div>
    <div class="song">
      <LRC :sid="id" ref="lrc" />
      <audio controls :src="data[0].url" ref="player"></audio>
    </div>
  </div>
</template>

<script>
import { ref, inject, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { SpliceName } from '../func/index'
import LRC from './LRC.vue'
export default {
  name: 'Player',
  setup() {
    const route = useRoute()
    const params = route.params
    const id = params.id

    console.log(id)

    const api = inject('api')

    let data = reactive({})
    let data2 = reactive({})
    let loading = ref(false)

    let player = ref(null)
    let lrc = ref(null)

    //添加事件
    let stop = setInterval(() => {
      if (player.value !== null) {
        player.value.addEventListener('timeupdate', currentTimeHandle)
        clearInterval(stop)
      }
    }, 1)

    function currentTimeHandle() {
      if (player.value !== null) {
        //传入当前播放毫秒
        lrc.value.currentTime = player.value.currentTime * 1000
      }
    }

    //获取歌曲信息
    api
      .getSongDetails({
        ids: id
      })
      .then(res => {
        for (let item in res) {
          data2[item] = res[item]
        }
        api
          .getSongUrl({
            id
          })
          .then(res => {
            for (let item in res.data) {
              data[item] = res.data[item]
            }
            loading.value = true
          })
      })

    //获取当前登陆状态
    let account = reactive({})
    let likeStatus = ref(false)
    onMounted(() => {
      api.loginStatus().then(res => {
        //判断是否已经登陆
        if (String(res.data.account) !== 'null') {
          let userid = res.data.account.id
          api
            .likelist({
              id: userid
            })
            .then(res => {
              res.ids.forEach(value => {
                if (value === parseInt(id)) {
                  likeStatus.value = true
                }
              })
            })
        }
      })
    })

    function like() {
      api
        .like({
          id,
          like: !likeStatus.value
        })
        .then(res => {
          if (res.code === 200) {
            if (likeStatus.value) {
              likeStatus.value = false
            } else {
              likeStatus.value = true
            }
          }
        })
    }

    function download() {
      window.open(player.value.currentSrc, '_self')
    }

    return {
      id,
      data,
      data2,
      lrc,
      account,
      player,
      loading,
      SpliceName,
      currentTimeHandle,
      likeStatus,
      like,
      download
    }
  },
  components: {
    LRC
  }
}
</script>

<style scoped>
.header {
  padding: 15px;
}

.music-info {
  flex: 1;
  font-size: 20px;
}

.title {
  display: flex;
  text-align: center;
}

.left {
  font-size: 30px;
}

.ca {
  color: red;
}

.right {
  font-size: 30px;
}

.song-info {
  padding: 15px;
}

.song-info-img {
  text-align: center;
}

.song-info-img img {
  border-radius: 5px;
  box-shadow: 0 0 10px 0 rgba(50, 50, 50, 0.31);
}

.song-lrc {
  margin-top: 10px;
  min-height: 50px;
}

.iconbox {
  display: flex;
  margin-top: 30px;
}

.iconbox .box {
  flex: 1;
}

.song {
  width: 100%;
  text-align: center;
}

.song audio {
  width: 80%;
}

.active {
  color: #222;
}

.author {
  font-size: 12px;
  color: #999;
}
</style>
