<template>
<div>
    <!-- 导航 -->
    <van-sticky>
        <van-nav-bar title="悬赏大厅">
            <!-- <van-icon name="search" slot="right" /> -->
        </van-nav-bar>
    </van-sticky>


    <!-- 标签 -->
    <van-tabs v-model="currnet_tab" @change="onTabChange">
        <van-tab v-for="item in mission_types" :title="item.Name" :key="item.Id">
            <!-- 下拉刷新 -->
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-list @load="onLoad"  v-model="loading" :finished="finished" finished-text="没有更多了">
                <div class="list-item">
                    <van-cell v-for="item in list" :key="item.ID"  @click="onMissionList(item)" >
                    <img :src="item.UserInfo.Icon | defaultAvatar" />
                    <div class="item-list">
                        <div class="van-ellipsis" style="font-size:15px;">
                            {{item.Title}} 
                        </div>
                        <van-icon name="friends-o" size="15px"/>
                            {{item.Remain?item.Amount-item.Remain:item.Amount}} 人做过  剩余 {{item.Remain?item.Remain:0}} 份
                    </div>
                    <!-- <div class="media-price">￥{{item.Price/100}}</div> -->
                    <div class="media-price">
                        <div class="right">
                        <van-image width="30" height="30" src="../src/images/icon2.png"/><div>x{{item.Price}}</div></div>
                    </div>
                    </van-cell> 
                </div>
            </van-list>
            </van-pull-refresh>
        </van-tab>
    </van-tabs>

</div>
</template>

<script>
export default {
    data(){
        return {
            loading: false,   //是否处于加载状态
            finished: false,  //是否已加载完所有数据
            isLoading: false,   //是否处于下拉刷新状态
            mission_types:[],
            list:[],
            page:1,
            error:'',
            currnet_tab:0,
        }
    },
    filters:{
        defaultAvatar(icon) {
          if (icon) {return icon}
          return '../src/images/default_avatar.jpg'
        }
    },
    created(){
        this.missionTypes();
        this.missionsByType();
    },
    methods:{
        onLoad() {      //上拉加载     
            var self = this;
            this.page++;
            var args = {Type:this.currnet_tab, Page:this.page};
            this.$http.post('?c=15', args,{headers:{'Content-Type':'application/json'}}).then(
            resp => {
                if (resp.status == 200 )  {
                    if (resp.body.Missions) {
                        self.list = self.list.concat(resp.body.Missions);
                    }else{
                        self.finished = true;
                    }
                    self.loading = false;
                    // 数据全部加载完成
                    if (self.list.length >= resp.body.Total) {
                        self.finished = true;
                    }
                }
            },
            resp => {self.error = true;}); 
        },
         onRefresh() { // 下拉刷新
            this.missionsByType();
            this.isLoading = false;
            //this.$toast('刷新成功');
        },
        onMissionList(item) {
           localStorage.setItem('Mission',JSON.stringify(item))
           this.$router.push("/detail")
       },
       missionTypes(){
            const self = this;
            this.$http.get('?c=8',{}).then(rsp => {
                var tps = rsp.body.Types;
                tps.unshift({Id: 0,Name: "全部"})
                self.mission_types = tps;
            },rsp=>{
                console.log("get mission typs error", rsp)
            })  
       },
       missionsByType(tp,page){
            var self = this;
            var args = {Type:tp, Page:page};
            this.$http.post('?c=15', args,{headers:{'Content-Type':'application/json'}}).then(
            resp => {
                if (resp.status == 200 )  {
                    self.list = resp.body.Missions;
                }
            },
            resp => {console.log(resp.body)});             
       },
       onTabChange(value,title){
           this.missionsByType(value);
       },
    }
}
</script>


<style lang="scss">
.van-list {
    img{
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: inline-block;
    }

    .item-list {
        font-size: 12px;
        padding-left: 10px;
        color:#323233;
        width: 60%;
        display: inline-block;
    } 

    .media-price {
        display: inline-block;
        width: 20%; 
        color:#F8534F;
        font-size: 14px; 
    }
    .right {
        display: flex;
        line-height: 30px;
    }
}
</style>