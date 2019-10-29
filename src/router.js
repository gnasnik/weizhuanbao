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
import editName from './main/edit_name.vue';

var router = new VueRouter({
    routes:[
        {path:"/", redirect:"/home"},
        {path:"/login",component:login, meta:{requireAuth:false,footShow: false}},
        {path:"/home", component:home, meta:{requireAuth:true,footShow: true}},
        {path:"/task", component:task, meta:{requireAuth:true,footShow: true}},
        {path:"/send", component:send, meta:{requireAuth:true,footShow: false}},
        {path:"/find", component:find, meta:{requireAuth:true,footShow: true}},
        {path:"/me", component:me, meta:{requireAuth:true,footShow: true}},
        {path:"/active",component:active,meta:{requireAuth:true,footShow: true}},
        {path:"/detail",component:detail},
        {path:"/review",component:review},
        {path:"/feedback",component:feedback},
        {path:"/about",component:about},
        {path:"/share",component:share},
        {path:'/edit_name',component:editName},
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