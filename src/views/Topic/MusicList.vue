<template>
  <template v-for="item in MusicLists" :key="item.id">
    <MusicListView :musicdata="item" v-if="item.length > 0"></MusicListView>
  </template>
</template>

<script>
import { reactive, inject } from 'vue'
import MusicListView from './MusicListView.vue'
export default {
  name: 'MusicList',
  setup() {
    //接口
    let api = inject('api')

    //获取热歌榜单数据
    let MusicLists = reactive([])
    let count = 0
    api.getMusicTopList({}).then((res) => {
      for (let key in res) {
        if (key === 'list') {
          res[key] = res[key].slice(0, 3)
          for (let key2 in res[key]) {
            //设定需要的数据
            let obj = reactive({})
            for (let key3 in res[key][key2]) {
              if (key3 === 'name') {
                //收集name
                obj[key3] = res[key][key2][key3]
              } else if (key3 === 'id') {
                //获取乐曲数据/歌单id
                obj[key3] = res[key][key2][key3]
                obj.length = 0
                //防止请求服务器速度过快!
                setTimeout(() => {
                  api
                    .getMusicList({
                      id: res[key][key2][key3],
                      limit: 6,
                      offset: 0
                    })
                    .then((res) => {
                      for (let item in res) {
                        obj.length++
                        obj[item] = res[item]
                      }
                    })
                }, 500 * count)
                count++
              }
            }
            MusicLists.push(obj)
          }
        }
      }
    })

    return {
      MusicLists
    }
  },
  components: {
    MusicListView
  }
}
</script>

<style></style>
