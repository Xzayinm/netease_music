import { createRouter, createWebHashHistory } from 'vue-router'

//2. 路由配置
const routes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('../views/Layout'),
    children: [
      {
        path: '/',
        redirect: '/home'
      },
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/Home/')
      },
      {
        path: '/topic',
        name: 'Topic',
        component: () => import('../views/Topic/')
      },
      {
        path: '/search',
        name: 'Search',
        component: () => import('../views/Search')
      },
      {
        path: '/mine',
        name: 'Mine',
        component: () => import('../views/Mine')
      }
    ]
  },
  {
    //携带歌单id属性
    path: '/more/:id',
    name: 'More',
    component: () => import('../views/MusicMore.vue')
  },
  {
    //播放器
    path: '/player/:id',
    name: 'Player',
    component: () => import('../views/Player.vue')
  }
]

// 3. 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: 'active'
})

// 4. 导出router
export default router
