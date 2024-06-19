<template>
  <div class="lrcContainer">
    <div class="lrc"
         ref="lrc">
      <p class="lrc-p"
         v-for="(item,index) in LRC"
         :class="{'active':currentTime > keys[index] && currentTime < keys[index+1],'active1':index === 0 && currentTime === 0}"
         :index="index"
         :key="index">
        <span>{{item[1]}}</span>
      </p>
    </div>
  </div>
</template>

<script>
import { inject, ref } from 'vue'
export default {
  name: 'LRC',
  setup(props) {
    let id = ref(props.sid)
    let keys = ref([])
    let currentTime = ref(0)
    const api = inject('api')

    let now_index = ref(0)

    let LRC = ref({})
    //获取歌词
    api
      .lyric({
        id: id.value,
      })
      .then((res) => {
        LRC.value = filterLRC(res.lrc.lyric)
      })

    //解析歌词
    function filterLRC(value) {
      if (!value) return
      let lyric = value.split('\n')
      const reg = /\[\d*:\d*(\.|:)\d*]/g
      let data = []
      lyric.forEach((value) => {
        let timeArr = value.match(reg)
        //保证数据有效
        if (timeArr) {
          //获取歌词
          timeArr.push(value.replace(timeArr, ''))
          //时间转换
          let min = parseInt(timeArr[0].match(/\[\d*/i).toString().slice(1))
          let sec = parseInt(timeArr[0].match(/:\d*/i).toString().slice(1))
          let ms = parseInt(timeArr[0].match(/\.\d*/i).toString().slice(1))
          timeArr[0] = min * 60 * 1000 + sec * 1000 + ms
          data.push(timeArr)
          keys.value.push(timeArr[0])
        }
      })
      return data
    }

    let lrc = ref(null)
    let start = ref(true)

    //滚动歌词
    setInterval(() => {
      if (lrc.value !== null) {
        let p = document.getElementsByClassName('lrc-p')
        let active = document.getElementsByClassName('active')[0]
        if (active) {
          if (p.length >= 1) {
            p[p.length - 1].classList.remove('active1')
          }
          start.value = false
          //移动位置
          let num = (active.getAttribute('index') - 2) * -30
          lrc.value.style.top = num + 'px'
        } else {
          //如果不在列表中
          if (p.length >= 1 && !start.value) {
            p[p.length - 1].classList.add('active1')
            let num = (p[p.length - 1].getAttribute('index') - 2) * -30
            lrc.value.style.top = num + 'px'
          }
        }
      }
    })

    return {
      id,
      lrc,
      LRC,
      keys,
      start,
      filterLRC,
      now_index,
      currentTime,
    }
  },
  props: ['sid'],
}
</script>

<style scoped>
.active,
.active1 {
  color: red;
}

.lrcContainer {
  width: 100%;
  height: 150px;
  overflow: hidden;
  position: relative;
}

.lrc {
  width: 100%;
  position: absolute;
  top: 60px;
  transition: all 200ms;
}

.lrc-p {
  height: 30px;
  line-height: 30px;
}

.up30 {
  margin-top: -30px;
}
</style>