import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const router = createRouter({
    // createWebHistory 路由模式路径不带#号(生产环境下不能直接访问项目，需要 nginx 转发)
    // createWebHashHistory 路由模式路径带#号
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/views/Home.vue'),
            children: [
                {
                    path: '/',
                    name: 'HomeDashboard',
                    component: () => import('@/views/contents/HomeDashboard.vue')
                },
                {
                    path: '/bill-list',
                    name: 'HomeBillList',
                    component: () => import('@/views/contents/HomeBillList.vue')
                },
                {
                    path: '/category-manager',
                    name: 'HomeCategoryManager',
                    component: () => import('@/views/contents/HomeCategoryManager.vue')
                },
                {
                    path: '/tutorial',
                    name: 'HomeExportTutorial',
                    component: () => import('@/views/contents/HomeExportTutorial.vue')
                }
            ]
        }
    ]
})


// 解决 vue 中路由跳转时，总是从新页面中间开始显示
// router.afterEach((to, from, next) => {
//     window.scrollTo({
//         top: 0,
//         behavior: 'smooth'
//     })
// })

export default router