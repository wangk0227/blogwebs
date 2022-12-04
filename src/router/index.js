import {createRouter, createWebHistory} from 'vue-router'
import {get_token} from '../utlis/cookie'
import store from '../store'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'blog',
            component: () => import('../views/BlogIndexView.vue'),
            meta: {
                auth: false
            },
            redirect: '/article/home',
            // 嵌套路由的方式显示同级两个不同的组件
            children:[
                {
                    path: 'article/home',
                    name: 'BlogIndex',
                    component: () => import('../components/blog/BlogIndexView.vue'),
                    meta: {
                        auth: false
                    },
                },
                {
                    path: 'article/detail',
                    name: 'BlogArticleDetails',
                    component: () => import('../components/blog/BlogContentView.vue'),
                    meta: {
                        auth: false
                    },
                },

            ]
        },

        {
            path: 'bolg/login/',
            name: "Login",
            component: () => import('../views/LoginView.vue'),
            meta: {
                auth: false
            }
        },
        {
            path: 'bolg/',
            name: 'Admin',
            component: () => import('../views/AdminIndexView.vue'),
            redirect: '/adminHome/bolg/index',
            meta: {
                auth: true // 需要登录访问
            },
            children: [
                {
                    path: 'index',
                    name: 'AdminIndex',
                    component: () => import('../components/IndexView.vue'),
                    meta: {
                        auth: true // 需要登录访问
                    },
                },
                {
                    path: 'articles', // 文章
                    name: 'AdminArticles',
                    component: () => import('../components/ArticlesView.vue'),
                    meta: {
                        auth: true // 需要登录访问
                    },
                },
                {
                    path: 'links', // 链接
                    name: 'AdminLinks',
                    component: () => import('../components/LinkView.vue'),
                    meta: {
                        auth: true // 需要登录访问
                    },
                },

                {
                    path: 'category', // 分类
                    name: 'AdminCategory',
                    component: () => import('../components/CategoryView.vue'),
                    meta: {
                        auth: true // 需要登录访问
                    },
                },
                {
                    path: 'user', // 用户
                    name: 'AdminUser',
                    component: () => import('../components/UserView.vue'),
                    meta: {
                        auth: true // 需要登录访问
                    },
                },
                {
                    path: 'contents', // 网站信息
                    name: 'AdminContents',
                    component: () => import('../components/BlogContentsView.vue'),
                    meta: {
                        auth: true // 需要登录访问
                    },
                },
                {
                    path: 'messages', // 文章留言
                    name: 'AdminMessages',
                    component: () => import('../components/ArticlesMessagesView.vue'),
                    meta: {
                        auth: true // 需要登录访问
                    },
                },
                {
                    path: 'add_articles',//添加和查看修改还文章
                    name: 'Add_AdminCategory',
                    component: () => import('../components/articleviews/Add_ArticleView.vue'),
                    meta: {
                        auth: true // 需要登录访问
                    },
                },
                {
                    path: 'update_articles',//添加和查看修改还文章
                    name: 'Update_AdminCategory',
                    component: () => import('../components/articleviews/Update_ArticleView.vue'),
                    meta: {
                        auth: true // 需要登录访问
                    },
                }
            ]
        },
        {
            path: "/:catchAll(.*)", // 通配符
            name: 'error_404',
            component: () => import('../views/404View.vue')
        },
        {
            path: "/403",
            name: 'error_403',
            component: () => import('../views/403View.vue')
        },
        {
            path: "/500",
            name: 'error_500',
            component: () => import('../views/500View.vue')
        }

    ]
})


router.beforeEach((to, from, next) => {
    let auth = to.meta.auth
    let token = store.state.token || get_token()
    let url_name = to.name
    if (auth) { // 当前全选是不是真
        if (token) { // 是真就需要判断当前用户是否登录
            next() // 放行
        } else { // 未登录 跳转登录页面
            next({
                name: 'Login'
            })
        }
    } else {
        if (url_name === 'Login') {
            if (token) {
                next({
                    name: 'Admin'
                })
            } else {
                next()
            }
        } else {
            next()
        }

    }

})
export default router
