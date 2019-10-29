import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import md5 from 'js-md5';
let base64 = require('js-base64').Base64;

Vue.prototype.$md5 = md5;
Vue.prototype.$base64 = base64;

Vue.use(VueRouter)
Vue.use(VueResource)

Vue.http.options.root = "http://localhost:8888/";
Vue.http.headers.common['Content-Type'] = 'application/json';

Vue.http.interceptors.push((request, next) => {
        request.headers.set('Token', localStorage.getItem('Token')); //setting request.headers
        next((response) => {
            return response
     })
})

import app from "./App.vue";
import router from "./router.js";

import { Image } from 'vant';
import { Button } from 'vant';
import { Cell, CellGroup } from 'vant';
import { Icon } from 'vant';
import { Field } from 'vant';
import { RadioGroup, Radio } from 'vant';
import { Uploader } from 'vant';
import { DropdownMenu, DropdownItem } from 'vant';
import { Loading } from 'vant';
import { PullRefresh } from 'vant';
import { Toast } from 'vant';
import { List } from 'vant';
import { NoticeBar } from 'vant';
import { Swipe, SwipeItem } from 'vant';
import { Grid, GridItem } from 'vant';
import { NavBar } from 'vant';
import { Tab, Tabs } from 'vant';
import {Tabbar, TabbarItem} from 'vant';
import {Row,Col} from 'vant';
import { Lazyload } from 'vant';
import { Tag } from 'vant';
import { Picker } from 'vant';
import { Popup } from 'vant';
import { Rate } from 'vant';
import { Step, Steps } from 'vant';
import { SubmitBar } from 'vant';
import { Circle } from 'vant';
import { Dialog } from 'vant';
import { Sticky } from 'vant';

Vue.use(Sticky);
Vue.use(Dialog);
Vue.use(Circle);
Vue.use(SubmitBar);
Vue.use(Step).use(Steps);
Vue.use(Rate);
Vue.use(Popup);
Vue.use(Picker)
Vue.use(Tag)
Vue.use(Lazyload);
Vue.use(Row).use(Col);
Vue.use(Tabbar).use(TabbarItem);
Vue.use(Tab).use(Tabs);
Vue.use(NavBar);
Vue.use(Grid).use(GridItem);
Vue.use(Swipe).use(SwipeItem);
Vue.use(NoticeBar);
Vue.use(List);
Vue.use(Toast);
Vue.use(PullRefresh)
Vue.use(Loading);
Vue.use(DropdownMenu).use(DropdownItem);
Vue.use(Uploader);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Field);
Vue.use(Icon);
Vue.use(Cell).use(CellGroup);
Vue.use(Button)
Vue.use(Image);

var vm = new Vue({
    router,
    el:"#app",
    data:{},
    methods:{},
    render: c => c(app),
})

