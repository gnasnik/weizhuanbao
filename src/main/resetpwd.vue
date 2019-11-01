<template>
<div class="app">
    <!-- 导航 -->
    <van-sticky>
        <van-nav-bar title="重置密码" left-arrow  @click-left="onClickLeft" right-text="确定" @click-right="onClickRight">
            <!-- <van-icon name="search" slot="right" /> -->
        </van-nav-bar>
    </van-sticky>

    <van-field v-model="username" clearable label="用户名" left-icon="contact" placeholder="请输入手机号"/>
    <van-field v-model="verifyCode" center clearable left-icon="bag-o" label="验证码" placeholder="短信验证码">
        <van-button slot="button" size="small" type="primary" @click="sendCode" :disabled="disable_send" ref="verifyTime">发送验证码</van-button>
    </van-field>
    <van-field v-model="password" type="password" label="密码" left-icon="bag-o" placeholder="请输入6位密码"/>

</div> 
</template>
 
 

<script>
export default {
    data(){
        return {
            username:'',
            password:'',
            verifyCode:'',
            verifyTime:'',
            time: 59,
            disable_send:false,
            jobId:'',
        }
    },
    methods:{
        onClickLeft(){
            this.$router.go(-1);
        },
        onClickRight(){
            var self = this;
            var up = {
                OpenID:this.username,
                Passwd:this.password,
                VerifyCode:this.verifyCode,
                JobID:this.jobId,
            };
            this.$http.post('?c=25',up,{headers:{'Content-Type':'application/json'}}).then(
                resp=>{
                    if ( resp.status == 200 )  {
                        self.$toast('修改成功')     
                        self.$router.go(-1);
                    }
                },
                resp=>{console.log(resp.body)})            
        },
      sendCode(){
        var self = this;
        if (!self.username || self.username.length < 11) {
           self.$toast('无效的手机号');
           return 
        }
        self.disable_send = true;
        self.$refs.verifyTime.innerHTML = self.time + " s";
        clearInterval(timerFunc)
        var timerFunc = setInterval(() => {
           self.time --
           self.$refs.verifyTime.innerHTML = self.time + " s";
           if (self.time <= 0) {
            self.$refs.verifyTime.innerHTML = "重新发送";
            self.disable_send = false
            self.time = 59
            clearInterval(timerFunc)
          }
        },1000)
        var sms = {Mobile:self.username};
        this.$http.post('?c=24',sms,{headers:{'Content-Type':'application/json'}}).then(
          resp => {
              if (resp.status == 200 )  {
                  self.$toast("验证码已发送");
                  self.jobId = resp.body.JobID;
              }},
          resp => {
            if (response.body.code == 1048584) {
                this.$toast('无效的验证码');
                return 
            }else if (response.body.code == 131075) {
               this.$toast('账号不存在');
               return 
            }
             this.$toast('服务器正忙，请稍后再试');
             console.log(resp);});
    },
    }
}
</script>

<style lang="scss" scoped>
    .app {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #f5f5f5;
    }
    .imgslot {
       .van-cell__title {
           line-height: 50px;
       }
    }
</style>