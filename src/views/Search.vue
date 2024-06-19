<template>
  <div class="search">
    <input type="text"
           v-model="keywords">
    <button @click="search">点击搜索</button>
    <div v-if="data.code === 200">
      <ul>
        <li>歌曲名</li>
        <li>歌手名</li>
      </ul>
      <ul v-for="(item,index) in data.result.songs"
          :key="index"
          :class="{white:index%2===0,whtie1:index%2!==0}">
        <router-link :to="`/player/${item.id}`"
                     target="_blank">
          <li>
            {{item.album.name}}
          </li>
          <li>
            {{SpliceName(item.artists)}}
          </li>
        </router-link>
      </ul>
      <div v-if="hasMore"
           ref="loadMore"
           class="more">正在努力加载中... (°ー°〃)</div>
      <div v-if="!hasMore"
           class="more">咱也是有底线的人~(#`O′)</div>
    </div>
  </div>
</template>

<script>
import { inject, reactive, ref } from 'vue'
import { SpliceName } from '../func/index'
export default {
  name: 'Search',
  setup() {
    const api = inject('api')
    let data = reactive({})
    let keywords = ref()
    let loading = ref(false)
    let hasMore = ref(false)

    let offset = ref(0)

    function search() {
      offset.value = 0
      searchHandle(offset.value)
    }

    function searchHandle(offsetValue) {
      //获取搜索结果
      api
        .search({
          keywords: keywords.value,
          limit: 50,
          offset: offsetValue,
        })
        .then((res) => {
          if (res.result.hasMore) {
            hasMore.value = true
          } else {
            hasMore.value = false
          }
          if (offsetValue === 0) {
            for (let item in res) {
              data[item] = res[item]
            }
          } else {
            data.code = res.code
            for (let item in res.result.songs) {
              data.result.songs.push(res.result.songs[item])
            }
          }
          offset.value += 50
        })
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
            searchHandle(offset.value)
          }
        }, 300)
      }
    })

    return {
      data,
      loading,
      keywords,
      hasMore,
      loadMore,
      offset,
      search,
      searchHandle,
      SpliceName,
    }
  },
}
</script>

<style scoped>
.search {
  margin-top: 5px;
}

input {
  border: 1px solid rebeccapurple;
  height: 30px;
  border-radius: 5px;
}

button {
  margin-left: 20px;
  height: 30px;
}

ul {
  position: relative;
  margin-top: 5px;
}

ul li {
  float: left;

  width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

ul li:last-child {
  position: absolute;
  left: 50%;
}

.white {
  background: white;
}

.whtie1 {
  background: rgb(250, 244, 244);
}

ul a {
  width: 100%;
  display: block;
  height: 20px;
}

.more {
  line-height: 30px;
  text-align: center;
  background: white;
}
</style>