<template>
<div class="app">
    <!-- 导航 -->
    <van-nav-bar title="详情" left-text="返回" left-arrow  @click-left="onClickLeft"></van-nav-bar>

    <div class="detail-header">
        <div class="title">{{item.Title}}</div>
        <div class="van-hairline--bottom"></div>
        <div class="user">
            <img :src="item.UserInfo.Icon | defaultAvatar" />
            <div>
                <span>{{ item.UserInfo.NickName }}</span>
                <span>ID: {{ item.UserInfo.UserID }}</span>
            </div>
        </div>
        <div class="van-hairline--bottom"></div>
    </div>
    <div class="show-submit">
        <van-cell title="已提交图片："/> 
        <div class="item">     
                <van-cell>
                <template slot="title">
                    <div class="center">
                        <van-image v-for="img in item.UserMission.Reviews" :key="img" width="100" height="100" :src="img"/>
                        <van-field :value="item.UserMission.Content" disabled label="提交文字"  rows="1" autosize/>   
                    </div>
                </template>
                </van-cell>
        </div>
    </div>

    <div class="end">
        <van-button type="default" @click="showRefuse">不通过</van-button>
        <van-button type="danger" @click="onConfirm">确认</van-button>
    </div>
    <div>

    </div>
    <div>
        <van-dialog v-model="show" title="任务不通过" show-cancel-button @confirm="onRefuse" :before-close="beforeClose">
                <van-field v-model="refuse_reason" type="textarea" placeholder="请填写不通过的原因" rows="1" autosize />
        </van-dialog>
    </div>
</div> 
</template>
 
 

<script>
export default {
    data(){
        return {
            show:false,
            refuse_reason:'',
            item:this.$route.query,
            list:[],
        }
    },
    filters:{
        defaultAvatar(icon) {
          if (icon) {return icon}
          return '../src/images/default_avatar.jpg'
        }
    },
    created(){
        if (this.item.Status > 1) {
            var self = this;
            var userId = 0;
            if (this.item.UserMission) {
                userId = this.item.UserMission.UserID;
            }
            var args = {MissionID:this.item.ID,UserID:userId};
            this.$http.post('?c=13',args,{headers:{'Content-Type':'application/json'}}).then(
                resp=>{
                    if ( resp.status == 200 )  {
                        self.user_mission = resp.body.UserMission;
                    }
                },
                resp=>{console.log(resp.body)}
            )
        }
    },
    methods:{
        onClickLeft(){
            this.$router.go(-1);
        },
        beforeClose(action,done){
            if (!this.refuse_reason && action == 'confirm') {
                return done(false);
            }
            this.refuse_reason = '';
            return done(true);
        },
        showRefuse(){
            this.show = true;
        },
        onRefuse(){
            if (!this.refuse_reason) {
                this.$toast('请填写不通过的原因');
                return
            }
            // 4 means mission not pass!!
            this.updateUserMission(4,this.refuse_reason);
        },
        onConfirm(){
            this.$dialog.confirm({
                title: '任务完成确认',
                message: '确认之后无法更改，确定要继续?'
                }).then(() => {
                // on confirm
                // 3 means sucess!!!
                    this.updateUserMission(3);
                }).catch(() => {
                // on cancel
            });
        },
        updateUserMission(status,reason){
            var self = this;
            var args = {
                MissionID: this.item.ID,
                UserID: this.item.UserMission.UserID,
                Status: status,
                Reason: reason,
            }
            this.$http.post('?c=17',args,{headers:{'Content-Type':'application/json'}}).then(
                resp=>{
                    if ( resp.status == 200 )  {
                        self.$toast('确认完成')
                        self.$router.go(-1);
                    }
                },
                resp=>{
                    console.log(resp.body)
                }
            )           
        }
    }
}
</script>

<style lang="scss" scoped>
    .title {
        padding:10px 10px;
        font-size: 15px;
    }
    img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
    }

    .user{ 
        padding: 15px 10px;
        display: flex;
        div {
            display: flex;
            flex-direction: column;
            font-size: 8px;
            flex: 1;
        }
        span{
            padding-left: 15px;
            flex: 3;
            color: grey;
        }
        .van-icon{
            line-height: 32px;
        }
    }
    .end {
       width: 100%;
       display: flex;
    //    margin: 10px 10px;
       
       button {
           padding-right: 10px;
           justify-content: space-between;
           flex: 1;
        }
    }
</style>