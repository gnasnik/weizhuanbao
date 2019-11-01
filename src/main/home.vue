<template>
<div>
    <van-swipe :autoplay="3000" @change="onChange">
    <van-swipe-item v-for="(adv, index) in advertises" :key="index">
        <img v-lazy="adv.Image" />
    </van-swipe-item>
    </van-swipe>

    <!-- 消息通知内容 -->
    <van-notice-bar :text="notice" left-icon="volume-o"/>

    <!-- 中间导航 -->
    <van-grid clickable :column-num="2" :border="false" :square="false" gutter="2">
    <van-grid-item class="middle-box" text="发布任务" to="/send" />
    <van-grid-item class="middle-box" text="接单赚钱" to="/find" />
    </van-grid>

    <!--标签页 -->
    <van-tabs v-model="active" sticky animated @change="onTabChange">
    <van-tab v-for="tab in tab_list" :key="tab.name" :title="tab.title" :name="tab.name">
        <van-list>
            <div class="list-item">
                <van-cell v-for="(item ,index) in recent_list" :key="index"  @click="onMissionList(item)" >
                <img :src="item.UserInfo.Icon | defaultAvatar" />
                <div class="item-list">
                    <div class="van-ellipsis" style="font-size:15px;">
                        {{item.Title}}
                    </div>
                    <van-icon name="friends-o" size="15px"/>
                        <!-- {{item.Finished?item.Finished:0}} 人做过  剩余 {{item.Remain?item.Remain:0}} 份 -->
                        {{item.Remain?item.Amount-item.Remain:item.Amount}} 人做过  剩余 {{item.Remain?item.Remain:0}} 份
                </div>
                    <div class="media-price">
                        <div class="right">
                        <van-image width="30" height="30" src="../src/images/icon2.png"/><div>x{{item.Price}}</div></div>
                    </div>
                </van-cell> 
            </div>
        </van-list>
    </van-tab>
    </van-tabs>

</div>
</template>



<script>
export default {
    data(){
        return {
            active: 0,
            advertises:'',
            notice:'',
            list:[],
            tab_list:[{name:'recent',title:"最新发布"},{name:'weight',title:"精选推荐"},{name:'highpay',title:"奖励最高"}],
            recent_list:[],
        }
    },
    created(){
        this.$http.get('?c=5',{}).then(
        response => {
            if (response.status == 200 )  {
                this.advertises = response.body.Advertises;
                this.notice = response.body.Notice;   
            }
        },
        response => {console.log(response);});
        this.$http.post('?c=9',{Type:1}, {headers:{'Content-Type':'application/json'}}).then(
            response =>{
                if (response.status == 200 )  {
                    this.recent_list = response.body.Missions;
                }
            },
            response =>{
                console.log("get mission recommend missions",response)
            }
        )
    },
    filters:{
        defaultAvatar(icon) {
          if (icon) {return icon}
          return '../src/images/default_avatar.jpg'
        },
    },
    methods:{
        onChange(index) { 
            console.log('当前 Swipe 索引：' + index) 
        },
        onTabChange(name,title){
            var args = {}
            switch (name) {
                case 'recent':
                    args = {Type:1}
                    break;
                case 'weight':
                    args = {Type:2}
                    break;
                case 'highpay':
                    args = {Type:3}
                    break;
            }
            this.$http.post('?c=9',args,{headers:{'Content-Type':'application/json'}}).then(
            response =>{
                if (response.status == 200 )  {
                    this.recent_list = response.body.Missions;
                }
            },
            response =>{
                console.log("get mission recommend missions",response)
            }
            )
        },
       onMissionList(item) {
           localStorage.setItem('Mission',JSON.stringify(item))
           this.$router.push("/detail")
       }
    }
}
</script>

<style lang="scss" scoped>
.van-swipe{
    img{
        height: 150px;
        width: 100%;
    }
}

.van-grid {
    margin-top: 10px;
    margin-bottom: 10px;

    // vant 要修改样式要用深度模式，否则没有效果
    /deep/ .van-grid-item__content {
        background:url("../images/bg_002.png");
        border-radius: 4px;
    }

    /deep/ .van-grid-item__text {
        color: white;
        font-size: 16px;
    }
}

.van-list {
    img{
        border-radius: 50%;
        width: 30px;
        height: 30px;
    }
    .item-list {
        font-size: 12px;
        color:#323233;
    } 
    .media-price {
        color: #F8534F;
        font-size: 14px;
    }
    .right {
        display: flex;
        line-height: 30px;
    }
}

</style>