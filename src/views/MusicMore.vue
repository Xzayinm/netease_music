<template>
  <div class="header">
    <router-link to="/">&lt;</router-link>
    <h3>歌单详情</h3>
  </div>
  <div class="collection-block">
    <div class="block-padding">
      <div class="list">
        <router-link class="item"
                     v-for="(item,index) in data.songs"
                     :key="index"
                     :class="{'clear-padding':index % 3 !== 1}"
                     :to="`/player/${item.id}`"
                     target="_blank">
          <div class="img-warpper">
            <img :src="item.al.picUrl">
          </div>
          <div class="main">
            {{item.al.name}}
          </div>
          <div class="gray">
            {{SpliceName(item.ar)}}
          </div>
        </router-link>
      </div>
      <div ref="loadMore"
           class="more">正在努力加载中... (°ー°〃)</div>
    </div>
  </div>
</template>

<script>
import { inject, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { SpliceName } from '../func'
export default {
  name: 'MusicMore',
  setup() {
    //获取route的数据
    const route = useRoute()
    const params = route.params
    const id = params.id
    const api = inject('api')

    //歌单数据
    const data = reactive({})
    //上一次的数据
    let LastData = []
    //是否已经加载完成，拒绝请求
    let status = false
    let offsetValue = 0
    http(offsetValue)
    function http(offset) {
      if (!status) {
        api
          .getMusicList({
            id: id,
            limit: 15,
            offset: offset,
          })
          .then((res) => {
            if (offset === 0) {
              //第一次获取数据
              data.length = 0
              for (let item in res) {
                data.length++
                data[item] = res[item]
              }
            } else {
              //取出歌曲的id
              let tempData = []
              for (let item in res.songs) {
                tempData.push(res.songs[item].id)
              }
              if (JSON.stringify(tempData) == JSON.stringify(LastData)) {
                //数据重复，停止请求！
                if (loadMore.value !== null) {
                  status = true
                  loadMore.value.innerHTML = '咱也是有底线的人~(#`O′)'
                }
              } else {
                //累加数据
                for (let item in res) {
                  for (let item2 in res[item]) {
                    data[item].push(res[item][item2])
                  }
                }
              }
            }

            //保存当前歌单当前歌曲的id
            LastData = []
            for (let item in res.songs) {
              LastData.push(res.songs[item].id)
            }
            offsetValue++
          })
      }
    }

    //检查是否已经检查到最后的数据
    const winHeight = document.documentElement.clientHeight
    const loadMore = ref(null)
    let timer = null
    window.addEventListener('scroll', () => {
      //进行加载更多数据
      if (timer) {
        clearTimeout(timer)
      }
      if (loadMore.value !== null) {
        timer = setTimeout(() => {
          if (winHeight > loadMore.value.getBoundingClientRect().top) {
            //请求新数据
            http(offsetValue)
          }
        }, 300)
      }
    })

    return {
      data,
      LastData,
      loadMore,
      SpliceName,
    }
  },
}
</script>

<style scoped>
.more {
  text-align: center;
}

.header {
  width: 100%;
  background: white;
  text-align: center;
  overflow: hidden;
  clear: both;
}

.header a {
  font-size: 20px;
  color: red;
  display: block;
  float: left;
  line-height: 40px;
  position: relative;
  left: 20px;
}

.header h3 {
  display: inline-block;
  line-height: 40px;
}

.collection-block {
  background-color: #f8f8f8;
  padding: 5px 0;
}

.block-padding {
  padding: 10px 17px;
  background-color: #fff;
}

.title {
  display: flex;
  margin: 14px 0 18px;
}

.title h3 {
  flex: 1 1 0%;
  display: block;
  font-weight: 700;
  font-size: 20px;
}

.list {
  width: 100%;

  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.list .item {
  float: left;
  width: 30%;
  padding: 0 10px;
  margin-bottom: 10px;
}

.clear-padding {
  padding: 0 !important;
}

.main {
  margin-top: 4px;
  font-size: 12px;

  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.gray {
  font-size: 12px;
  color: #999;
  overflow: hidden;

  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.btn-more {
  font-size: 12px;
  text-align: right;
  color: #333;
}
</style>