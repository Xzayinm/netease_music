<template>
  <ul class="top-nav">
    <li>
      <router-link to="/home">首页</router-link>
    </li>
    <li>
      <router-link to="/topic">榜单</router-link>
    </li>
    <li>
      <router-link to="/mine">我的</router-link>
    </li>
    <li>
      <router-link to="/search">搜索</router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Nav',
}
</script>

<style scoped>
.top-nav {
  display: flex;
  background: #fff;
}

.top-nav li {
  flex: 1;
  text-align: center;
  padding-top: 10px;
}
.top-nav li a {
  display: block;
  padding-bottom: 8px;
}
.top-nav li .active {
  border-bottom: 2px solid #ff0000;
}
</style>