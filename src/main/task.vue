<template>
<div>
    <!-- 导航 -->
    <!-- <van-nav-bar> -->
    <van-sticky>
        <van-dropdown-menu active-color="#ee0a24">
            <van-dropdown-item v-model="currnet_menu" :options="menu" @change="onMenuChange" />
        </van-dropdown-menu>
    </van-sticky>

    <!-- </van-nav-bar> -->
    
    <van-tabs @change="onTabChange" v-model="tabv">
    <van-tab v-for="item in tab_list" v-model="tab" :title="item.title" :key="item.name">
        <van-list>
            <div class="list-item">
                <van-cell v-for="item in list" :key="item.ID"  @click="onMissionList(item)" >
                <img :src="item.UserInfo.Icon | defaultAvatar" />
                <div class="item-list">
                    <div class="van-ellipsis" style="font-size:15px;">{{item.Title}}</div>
                    <div>
                        <van-icon name="friends-o" size="15px"/>
                        {{item.Remain?item.Amount-item.Remain:item.Amount}} 人做过  剩余 {{item.Remain?item.Remain:0}} 份
                    </div>
                </div>
                    <van-button v-if="item.Status==3" plain hairline size="mini" round type="danger" 
                                @click.stop="onComment(item.ID)" :disabled="item.Comment" :text="item.Comment?'已评价':'评价'">
                    </van-button>
                    <!-- <div v-else-if="item.Status == 0" class="media-price">￥{{item.Price/100}}</div>                    -->
                    <van-circle size="40px" :stroke-width="80" :value="item.Amount-item.Remain" :rate="item.Amount" 
                                v-else-if="tabv==0&&currnet_menu==1" color="#EE0A24" layer-color="#ebedf0" 
                                :text="currnetRate(item.Remain?item.Amount-item.Remain:item.Amount,item.Amount)"/>
                </van-cell> 
            </div>
            <div>
                <van-dialog v-model="show" title="发表评价" show-cancel-button @confirm="onConfirm" @cancel="onCancel">
                      <div class="comments-rate">整体评价：<van-rate v-model="comment_rate" /></div>
                      <van-field v-model="comment_content" type="textarea" placeholder="任务与描述的相符吗？说说它的优点与不足的地方吧" rows="1" autosize />
                </van-dialog>
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
            show:false,
            list:[],
            tabv:0,
            tab:0,
            currnet_menu:0,
            menu:[
                { text: '我在做的', value: 0 },
                { text: '我发布的', value: 1 },
            ],
            publish_tab:[
                {name:1,title:"发布中"},
                {name:2,title:"待审"},
                // {name:3,title:"已完成"}
                ],
            take_tab:[
                // {name:0,title:"全部"},
                {name:1,title:"待办"},
                {name:2,title:"待审"},
                {name:3,title:"已完成"},
                {name:4,title:"未通过"},
                // {name:5,title:"已过期"},
            ],
            tab_list:[],
            comment_rate:0,
            comment_content:'',
            comment_mid:0,
        }
    }, 
    filters:{
        defaultAvatar(icon) {
          if (icon) {return icon}
          return '../src/images/default_avatar.jpg'
        }
    },
    created(){
        var menu = parseInt(localStorage.getItem('Task_Current'));
        if (!menu) {
            var value = 1;
            this.userTodoMission(value);
        }else {
            this.currnet_menu = menu;
            this.userPublishMission();
        }
    },
    methods:{
        currnetRate(cur,rate){
            if (cur==rate) {
                return '完成';
            }
            return (cur/rate*100).toFixed(0) + '%';
        },
        onMenuChange(value){
            localStorage.setItem('Task_Current',value);
            switch (value) {
                case 0:
                    this.userTodoMission(1);
                    break;
                case 1:
                    this.userPublishMission();
                    break;
            }
        },
       //  我做的任务
       userTodoMission(value){
            var self = this;
            this.tab_list = this.take_tab;
            this.$http.post('?c=11', {Type:value},{headers:{'Content-Type':'application/json'}}).then(
                resp => {
                    if (resp.status == 200 )  {
                        self.list = resp.body.Missions;
                    }
                },
                resp => {console.log(resp.body)});  
       },
       // 我发布的
       userPublishMission(value){
            var self = this;
            this.tab_list = this.publish_tab;
            this.$http.post('?c=14', {Type:value},{headers:{'Content-Type':'application/json'}}).then(
            resp => {
                if (resp.status == 200 )  {
                    self.list = resp.body.Missions;
                }
            },
            resp => {console.log(resp.body)});  
       },
       // 待审的任务
       userSubmitMission(){
            var self = this;
            this.tab_list = this.publish_tab;
            this.$http.get('?c=16').then(
            resp => {
                if (resp.status == 200 )  {
                    self.list = [];
                    if (!resp.body.UserMissionSet) {
                        return
                    }
                    for (var i = 0; i< resp.body.UserMissionSet.length; i++ ){
                        var m = resp.body.UserMissionSet[i].Mission;
                        m.UserMission = resp.body.UserMissionSet[i].UserMission;
                        self.list.push(m)
                    }
                }
            },
            resp => {console.log(resp.body)});  
       },
       onMissionList(item) {
           if (this.tabv == 1 && this.currnet_menu == 1) {
                this.$router.push({path:"/review",query:item})
                return 
           }
           this.$router.push({path:"/detail",query:item})
       },
       onTabChange(value,title){
            // 我在做的任务
            if (this.currnet_menu == 0) {
                this.userTodoMission(value+1);
                return
            }
            // 待审的任务
            if (this.currnet_menu == 1 && value == 1) {
                this.userSubmitMission();
                return 
            }
            // 发布的任务
            var tp = value==2 ? 3:0
            this.userPublishMission(value);
        },
        onComment(mid){
            this.comment_mid = mid;
            this.show = true;
        },
        onCancel(){
            this.comment_mid = 0;
            this.comment_rate = 0;
            this.comment_content = '';
        },
        onConfirm(){
            var self = this;
            var cms = {
                MissionID:this.comment_mid,
                Content: this.comment_content,
                Score:this.comment_rate,
            }
            this.$http.post('?c=18',cms,{headers:{'Content-Type':'application/json'}}).then(
            resp => {
                // 刷新已完成任务列表
                self.userTodoMission(3);
                self.$toast('评价成功');
            },
            resp => {console.log(resp.body)});  
            this.comment_rate = 0;
            this.comment_content = '';
            this.comment_mid = 0;
        },
    }
}
</script>


<style lang="scss">
    .van-circle__text{
        font-size: 8px;
    }
    .comments-rate {
        padding: 10px 15px;
        font-size: 14px;
    }
</style>