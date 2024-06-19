<template>
  <div class="collection-block">
    <div class="block-padding">
      <div class="title">
        <h3>{{MusicData.name}}</h3>
      </div>
      <div class="list clearfix">
        <router-link class="item"
                     v-for="(item,index) in MusicData.data"
                     :key="index"
                     :class="{'clear-padding':index % 3 !== 1}"
                     :to="`/player/${item.id}`">
          <div class="img-warpper">
            <img :src="item.picUrl">
          </div>
          <div class="main">
            {{item.name}}
          </div>
          <div class="gray">
            {{SpliceName(item.song.artists)}}
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { SpliceName } from '../../func'
export default {
  name: 'MusicListView',
  setup(props) {
    //获取传递的数据
    let MusicData = reactive(props.musicdata)

    return {
      MusicData,
      SpliceName,
    }
  },
  props: ['musicdata'],
}
</script>

<style scoped>
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
}

.list .item {
  float: left;
  width: 31.33%;
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