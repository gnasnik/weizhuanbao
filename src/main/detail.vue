<template>
<div class="app">
    <!-- 导航 -->
    <van-nav-bar title="详情" left-text="返回" fixed left-arrow  @click-left="onClickLeft"></van-nav-bar>
    
    <div class="detail-header">
        <div class="title">{{item.Title}}</div>
        <div class="van-hairline--bottom"></div>
        <div class="user">
            <img  @click="preview([item.UserInfo.Icon])" :src="item.UserInfo.Icon | defaultAvatar" />
            <div>
                <span>{{ item.UserInfo.NickName }}</span>
                <span>ID: {{ item.UserInfo.UserID }}</span>
            </div>
            <van-icon name="arrow" color="grey"/>
        </div>
        <div class="van-hairline--bottom"></div>
    </div>
    <div class="detail-mission">
       <div class="main">
            <van-image src="../src/images/icon2.png" width="30" height="30"/><div class="price">x{{item.Price}}</div>
            <div class="checktime">最快{{ item.CheckTime}}分钟内验收</div>
       </div>
        <div class="mission-desc"> 
            <div>任务描述:</div>
            <div class="content">
                <div class="message">{{item.Description}}</div>
                <van-steps direction="vertical" :active="item.Steps?item.Steps.length:0">
                    <van-step v-for="(item,idx) in item.Steps" :key="item.ID">
                        <div>步骤{{idx+1}}</div>
                         <van-image width="100" height="100" v-show="item.Image" lazy-load :src="item.Image"/>
                        <div v-show="item.Description">{{item.Description}}</div>
                    </van-step>
                </van-steps>
            </div>
            <div>任务要求:</div>
            <div class="ask">
                <div v-if="item.Reviews">需要上传{{item.Reviews.length}}张图片</div>
                <van-image @click="preview(item.Reviews)" width="100" height="100" v-for="r in item.Reviews" :key="r" lazy-load :src="r"/>
                <div v-show="item.Content">需要提供文字信息，例如: {{item.Content}}</div>
            </div>
        
        </div>
    </div>
    <div class="uploader" v-if="item.Status == 1">
        <van-cell title="提交审核："/> 
       <div class="item">     
            <van-cell>
            <template slot="title">
                <div class="center">
                    <van-uploader :after-read="afterRead" name='check' v-model="list" :max-count="3"/>
                    <van-field v-model="content" label="审核文字" placeholder="填写需要提供的文本信息"  rows="1" autosize/>    
                </div>
            </template>
            </van-cell>
       </div>
    </div>
    <div class="show-submit" v-else>
        <van-cell title="已提交图片："/> 
        <div class="item">     
                <van-cell>
                <template slot="title">
                    <div class="center">
                        <van-image @click="preview(user_mission.Reviews)" v-for="img in user_mission.Reviews" :key="img" width="100" height="100" :src="img"/>
                        <van-field :value="user_mission.Content" disabled label="审核文字"  rows="1" autosize/>   
                    </div>
                </template>
                </van-cell>
        </div>
    </div>

    <div class="comments" v-if="item.Status != 1">
       <van-cell title="评价" is-link value="全部" />
       <div class="no-comment" v-show="!comments">暂无评论</div>
       <div class="item" v-for="comment in comments" :key="comment.ID">     
            <van-cell>
            <template slot="title">
                <div class="start"><img :src="comment.Role.Icon"></div>
                <div class="center">
                     <div class="nickname">{{comment.Role.NickName}}</div>
                     <div class="created">{{timeChange(comment.CreatedAt*1000)}}</div>
                     <div class="content">{{comment.Content?comment.Content:'该用户没有填写评价。'}}</div>
                </div>
                <div class="end"><van-rate :value="5" size="12px"/></div>
            </template>
            </van-cell>
       </div>
    </div>
    <div class="accept" v-show="showBtn()">
        <van-submit-bar  :loading="loading" :button-text="btnText()" @submit="onClickBtn"/>
    </div>


</div> 
</template>
 
 

<script>
import { ImagePreview } from 'vant';
export default {
    data(){
        return {
            role:JSON.parse(localStorage.getItem('Role')),
            item:JSON.parse(localStorage.getItem('Mission')),
            list:[],
            images:[],
            content:'',
            user_mission:'',
            comments:[],
            loading:false,
        }
    },
    filters:{
        defaultAvatar(icon) {
          if (icon) {return icon}
          return '../src/images/default_avatar.jpg'
        }
    },
    created(){
        this.loadMissionComments();
        if (this.item.Status > 1 && this.role) {
            this.loadUserMissionPlain();
        }
    },
    methods:{
        preview(icon){
            ImagePreview(icon)
        },
        showBtn() {
            if (!this.role) {
                return true
            }
            if ( this.item.UserInfo.UserID == this.role.UserID || this.item.Status > 1 ) {
                return false
            }
            return true
        },
        btnText(){
            if (!this.item.Status) {
               return "接受任务"
            }
            return  "提交任务"
        },
        onClickLeft(){
            this.$router.go(-1);
        },
        uuid() {
            let s = [];
            let hexDigits = "0123456789abcdef";
            for (let i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
            s[8] = s[13] = s[18] = s[23] = "-";
            return s.join("");
        },
        afterRead(file,detail) {
            var self = this;
            this.loading = true;
            this.$http.get('?c=7').then(resp=>{
                if (resp.status==200) {
                    var pic = file.content.replace(/^.*?,/, '');
                    var spl = file.file.name.split(".");
                    var key = Base64.encode(this.uuid()+'.'+spl[spl.length-1]);
                    var mineType = Base64.encode(file.file.type);
                    this.$http.post("http://up-z2.qiniup.com/putb64/-1/key/"+key+'/mimeType/'+ mineType,pic,
                        {headers: {'Content-Type': 'application/octet-stream', 'Authorization': "UpToken "+resp.body.UpToken}}
                    ).then(resp => {
                        var image_url  = "http://pzjt57d8l.bkt.clouddn.com/"+ resp.data.key;
                        self.images.push(image_url);
                        this.loading = false;
                    },resp => {
                        self.$toast('上传失败，请重新上传');
                        this.loading = false;
                    }).catch(function (error) {
                        console.log('上传失败',error)
                    });
                    
                } 
            },resp=>{
                console.log(resp.body)
            }) 
        },
        loadUserMissionPlain(){
            var self = this;
            var userId = this.item.UserMission?this.item.UserMission.UserID:this.role.UserID;
            var args = {
                MissionID:this.item.ID,
                UserID:userId
            };
            this.$http.post('?c=13',args,{headers:{'Content-Type':'application/json'}}).then(
                resp=>{
                    if ( resp.status == 200 )  {
                        self.user_mission = resp.body.UserMission;
                    }
                },
                resp=>{console.log(resp.body)})
        },
        loadMissionComments(){
            var self = this;
            var cms = {
                MissionID:this.item.ID,
            };
            this.$http.post('?c=19',cms,{headers:{'Content-Type':'application/json'}}).then(
            resp => {
                self.comments = resp.body.Comments;
            },
            resp => {console.log(resp.body)});              
        },
        onClickBtn(){
            if (this.item.Status){
                return this.onSubmit()
            }
            return this.onAccept()
        },
        onSubmit(){
            var self = this;
            var args = {MissionID:self.item.ID,Content:self.content,Images:self.images}
            this.$http.post('?c=12',args,{headers:{'Content-Type':'application/json'}}).then(
                resp=>{
                    if ( resp.status == 200 )  {
                        self.$toast('提交成功')
                        self.item.Status = 2;
                        self.$router.go(-1);
                    }
                },
                resp=>{console.log(resp.body)})
        },
        onAccept(){
            if (!this.role) {
                this.$router.push("/login")
                return 
            }
            var self = this;
            this.$http.post('?c=10',{MissionID:self.item.ID},{headers:{'Content-Type':'application/json'}}).then(
                resp=>{
                    if ( resp.status == 200 )  {
                        self.$toast('任务领取成功，请在我的任务里查看')
                        self.item.Status = 1;
                        self.$router.go(-1);
                    }
                },
                resp=>{console.log(resp.body)})
        },
        formatDateTime(timeValue) {
            var date = new Date(timeValue);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
		},
        isYestday(timeValue) {
            var date = (new Date()); //当前时间
            var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨
            var yestday = new Date(today - 24 * 3600 * 1000).getTime();
            return timeValue < today && yestday <= timeValue;
        },
		isYear (timeValue) {
            var takeNewYear = this.formatDateTime(new Date()).substr(0,4); //当前时间的年份
            var takeTimeValue = this.formatDateTime(timeValue).substr(0,4); //传入时间的年份
            return takeTimeValue == takeNewYear;
        },
        timeChange(timeValue) {
            var timeNew = Date.parse(new Date()); //当前时间
            var timeDiffer = timeNew - (timeValue); //与当前时间误差
            var returnTime = '';
            if(timeDiffer <= 60000) { //一分钟内
                var returnTime = '刚刚';
            } else if(timeDiffer > 60000 && timeDiffer < 3600000) { //1小时内
                var returnTime = Math.floor(timeDiffer / 60000 )+ '分钟前';
            } else if(timeDiffer >= 3600000 && this.isYestday(timeValue) === false) { //今日
                var returnTime = this.formatDateTime(timeValue).substr(11,5);
            }else {
                var returnTime = this.formatDateTime(timeValue);
            }
            return returnTime;
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
        padding: 10px 10px;
        display: flex;
        div {
            display: flex;
            flex-direction: column;
            font-size: 12px;
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
    .detail-mission {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        padding: 15px 10px;

        .main {
            display: flex;
            padding: 0 10px 15px 0;
        }
        .price {
            font-size: 20px;
            color: #F8534F;
            flex: 1;
        }
        .checktime {
            font-size: 12px;
            color: gray;
            line-height: 26px;
        }
        .content{
            color: gray;
            font-size: 12px;
            .message{padding: 10px 10px}
            /deep/.van-step__title {
                color: gray;
                font-size: 12px;
            }
        }
        .ask {
            font-size: 12px;
            color: grey;
            padding:10px 10px;
        }
    }

    .comments {
        .no-comment {
            font-size: 14px;
            color: gray;
            padding: 10px 15px;
        }
        .van-cell__title {
            display: flex;
        }
        .center{
            padding: 0 10px;
            flex:1;
            .created {
                font-size: 2px;
                color: LightGrey;
            }
            .content {
                color: gray;
            }
        }
    }
    .van-submit-bar__button {
        width: 100%;
    }
</style>