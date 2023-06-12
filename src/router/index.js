import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  //  一级路由
  {
    path: "/main",
    name: "Main",
    component: () => import("../views/Main.vue"),
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("../views/Home.vue"),
      },
      {
        path: "menu",
        name: "Menu",
        component: () => import("../views/Menu.vue"),
      },
      {
        path: "shopbag",
        name: "Shopbag",
        component: () => import("../views/Shopbag.vue"),
      },
      {
        path: "my",
        name: "My",
        component: () => import("../views/My.vue"),
      },

    ]
  },
  {
    path: "detail",
    name: "Detail",
    component: () => import("../views/Detail.vue"),
  },
  {
    path: "search",
    name: "Search",
    component: () => import("../views/Search.vue"),
  },
  {
    path: "login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "forgot",
    name: "ForGot",
    component: () => import("../views/ForGot.vue"),
  },
  {
    path: "account",
    name: "Account",
    component: () => import("../views/Account.vue"),
  },
  {
    path: "address",
    name: "Address",
    component: () => import("../views/Address.vue"),
  },
  {
    path: "like",
    name: "Like",
    component: () => import("../views/Like.vue"),
  },
  {
    path: "order",
    name: "Order",
    component: () => import("../views/Order.vue"),
  },
  
  {
    path: "secure",
    name: "Secure",
    component: () => import("../views/Secure.vue"),
  },
  {
    path: "track",
    name: "Track",
    component: () => import("../views/Track.vue"),
  },
  {
    path: "newaddress",
    name: "NewAddress",
    component: () => import("../views/NewAddress.vue"),
  },
  {
    path: "pay",
    name: "Pay",
    component: () => import("../views/Pay.vue"),
  },
  
  //  路由重定向
  {
    path: "*",
    redirect: {
      name: "Home"
    }
  }

]

const router = new VueRouter({
  routes
})

export default router
