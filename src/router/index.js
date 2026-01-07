// 注意：VueRouter 已在 index.html 中通过 CDN 全局引入
// 全局变量 window.VueRouter 已可用，且已自动调用 Vue.use(VueRouter)
// 因此这里不需要 import VueRouter，直接使用全局的 VueRouter

// 导入页面组件
const Layout = () => import('@/views/layout/Layout.vue')
const PositionPlanning = () => import('@/views/position-planning/PositionPlanning.vue')

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/position-planning',
    children: [
      {
        path: 'position-planning',
        name: "ATSTC_TCGL_PLANNING",
        component: PositionPlanning,
        meta: {
          title: '头寸规划',
          icon: 'el-icon-s-data'
        }
      }
      // 可以继续添加其他路由
      // {
      //   path: 'other-page',
      //   name: 'OtherPage',
      //   component: () => import('@/views/other-page/index.vue'),
      //   meta: {
      //     title: '其他页面',
      //     icon: 'el-icon-menu'
      //   }
      // }
    ]
  }
]

// 使用全局的 VueRouter（来自 CDN）
const router = new window.VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router

