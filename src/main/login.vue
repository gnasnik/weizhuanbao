<template>
  <div class="login-container">
    <div><van-image width="15rem" height="15rem" fit="contain" src="../src/images/bg_login.png"/></div>
    <van-cell-group v-show="!isRegister">
    <van-field v-model="username" clearable label="用户名" left-icon="contact" placeholder="请输入手机号"/>
    <van-field v-model="password" type="password" label="密码" left-icon="bag-o" placeholder="请输入密码"/>
    </van-cell-group>

    <van-cell-group v-show="isRegister">
    <van-field v-model="username" clearable label="用户名" left-icon="contact" placeholder="请输入手机号"/>
    <van-field v-model="verifyCode" center clearable left-icon="bag-o" label="验证码" placeholder="短信验证码">
        <van-button slot="button" size="small" type="primary" @click="sendCode" :disabled="disable_send" ref="verifyTime">发送验证码</van-button>
    </van-field>
    <van-field v-model="password" type="password" label="密码" left-icon="bag-o" placeholder="请输入6位密码"/>
    <van-field v-model="invite" label="邀请码" placeholder="可不填" left-icon="bag-o"/>
    </van-cell-group>

    <van-button color="#EC6E55" :disabled="isBtnLoading" @click="login()" :text="btnText"></van-button>
    <van-row>
    <van-col span="8" @click="isRegister=!isRegister"><span>{{regText}}</span></van-col>
    <van-col span="8"></van-col>
    <van-col span="8" @click="forgot"><span>忘记密码？</span></van-col>
    </van-row>

    <!-- <div class="wechat-login">
        <van-image width="25px" height="25px" fit="contain" src="./src/images/ic_wechat.png"/>
    </div> -->
  </div>
</template>


<script>

export default {
  data() {
      return {
        username: '',
        password: '',
        verifyCode: '',
        jobId:'',
        isBtnLoading: false,
        isRegister:false,
        invite: '',
        time: 59,
        disable_send:false,
      }
    },
    created () {
      if (this.$route.query.invite) {
        this.isRegister = true;
        this.invite = this.$route.query.invite;
      }
      if(JSON.parse( localStorage.getItem('user')) && JSON.parse( localStorage.getItem('user')).username){
        this.username = JSON.parse( localStorage.getItem('user')).username;
        this.password = JSON.parse( localStorage.getItem('user')).password;
      }
    },
    computed: {
      btnText() {
        if (this.isBtnLoading) return '登录中...';
        if (this.isRegister) return '立即注册'
        return '登录';
      },
      regText(){
        if (this.isRegister) return '已有账号'
        return '立即注册';
      }
    },
    methods: {
      login() {
        if (this.isRegister) {
          this.register()
          return 
        }
        const self = this;
        this.isBtnLoading = true
        if (!this.username || this.username.length < 11) {
           this.$toast('无效的手机号');
           this.isBtnLoading = false
          return;
        }
        if (!this.password) {
          this.$toast('请输入密码');
          this.isBtnLoading = false
          return;
        }
        this.$http.post('?c=2', {OpenId:this.username,Token:this.password},{headers:{'Content-Type':'application/json'}}).then(
         response => {
            if (response.status == 200 )  {
                this.setSession(response.body.SessionID,response.body.Role);
                self.$router.push({path:"/home"}).catch(err => { console.log(err) })
            }
          },
          response => {
             if (response.body.code == 131078){
               this.$toast('密码错误');
             }else if (response.body.code == 131075) {
               this.$toast('用户不存在');
            }else {
               this.$toast('服务器正忙，请稍后再试');
             }
          });
          this.isBtnLoading = false
      },
      register(){
        let self = this;
        if (!this.username || this.username.length < 11) {
           this.$toast('无效的手机号');
           this.isBtnLoading = false
          return;
        }
        if (!this.password) {
          this.$toast('请输入密码');
          this.isBtnLoading = false
          return;
        }
        if (!this.verifyCode) {
            this.$toast('请输入验证码');
            return;
        }
        var data = {
            OpenId:this.username,
            Token:this.password,
            VerifyCode: this.verifyCode,
            InviteCode:this.invite,
            JobID:this.jobId,
        }
        this.$http.post('?c=1', data ,{headers:{'Content-Type':'application/json'}}).then(
         response => {
            if (response.status == 200 )  { 
                this.setSession(response.body.SessionID,response.body.Role);
                self.$router.push({path:"/home"}).catch(err => { console.log(err) })
            }
          },
          response => {
            if (response.body.code == 131079) {
               this.$toast('无效的邀请码');
               return 
            }else if (response.body.code == 1048584) {
                this.$toast('无效的验证码');
                return 
            }else if (response.body.code == 131081) {
               this.$toast('账号已注册');
               return 
            }
             this.$toast('服务器正忙，请稍后再试');
          });
      },
      setSession(token, role){
         localStorage.setItem("Token",token);
         localStorage.setItem('Role',JSON.stringify(role));
         localStorage.setItem("Timestamp",new Date().getTime()+23*60*60*1000);
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
          resp => {console.log(resp);});
    },
    forgot(){
      this.$router.push("/reset");
    }
}}
</script>


<style lang="scss" scoped>
.login-container{
    display: flex;
    flex-direction: column;
    margin: 10px 20px;
    text-align: center;
}

.van-row {
    font-size: 12px;
    padding-top: 10px;
}

.van-button {
    margin-top: 10px;
}

.wechat-login {
    text-align:end;
    padding: 0px 20px;
}

</style>