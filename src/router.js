import VueRouter from 'vue-router';

import home from "./main/home.vue";
import task from "./main/task.vue";
import send from "./main/send.vue";
import find from "./main/find.vue";
import login from "./main/login.vue";
import me from "./main/me.vue";
import detail from './main/detail.vue';
import review from './main/review.vue';
import active from './main/active.vue';
import feedback from './main/feedback.vue';
import about from './main/about.vue';
import share from './main/qrcode.vue';
import settings from './main/settings.vue';
import service from './main/service.vue';
import shop from './main/shop.vue';
import edit from './main/edit.vue';

var router = new VueRouter({
    routes:[
        {path:"/", redirect:"/home"},
        {path:"/login",name:'login',component:login, meta:{requireAuth:false,footShow: false}},
        {path:"/home",name:'home', component:home, meta:{requireAuth:false,footShow: true}},
        {path:"/task", name:'task',component:task, meta:{requireAuth:false,footShow: true}},
        {path:"/send", name:'send',component:send, meta:{requireAuth:false,footShow: false}},
        {path:"/find", name:'find',component:find, meta:{requireAuth:false,footShow: true}},
        {path:"/me", name:'me',component:me, meta:{requireAuth:false,footShow: true}},
        {path:"/active",name:'active',component:active,meta:{requireAuth:true,footShow: true}},
        {path:"/detail", name:'detail',component:detail},
        {path:"/review",name:'review',component:review},
        {path:"/feedback",name:'feedback',component:feedback},
        {path:"/about",name:'about',component:about},
        {path:"/share",name:'share',component:share},
        {path:"/settings",name:'settings',component:settings},
        {path:"/service",name:'service',component:service},
        {path:"/shop",name:'shop',component:shop},
        {path:'/edit',name:'edit',component:edit},
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireAuth)){ // 判断该路由是否需要登录权限
      var userinfo = localStorage.getItem('Token');
      var timestamp = localStorage.getItem('Timestamp');
      var now = new Date().getTime();
      if (userinfo && timestamp > now) { // 判断当前的 token 是否存在
        next();
      }
      else {
        next({
          path: '/login',
          query: {redirect: to.fullPath} // 将要跳转路由的path作为参数，传递到登录页面
        })
      }
    }
    else {
      next();
    }
  })


export default router;