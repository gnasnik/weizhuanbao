<template>
  <div class="login-container">
    <van-image class="logo" width="15rem" height="15rem" fit="contain" src="../src/images/bg_login.png"/>
    <van-cell-group v-show="!isRegister">
    <van-field v-model="username" clearable label="手机号" left-icon="contact" placeholder="请输入手机号"/>
    <van-field v-model="password" type="password" label="密码" left-icon="bag-o" placeholder="请输入密码"/>
    </van-cell-group>

    <van-cell-group v-show="isRegister">
    <van-field v-model="username" clearable label="用户名" left-icon="contact" placeholder="请输入手机号"/>
    <van-field v-model="code" center clearable left-icon="bag-o" label="短信验证码" placeholder="请输入短信验证码">
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
    </van-field>
    <van-field v-model="password" type="password" label="密码" left-icon="bag-o" placeholder="请输入密码"/>
    </van-cell-group>

    <van-button color="#EC6E55" :disabled="isBtnLoading" @click="login()" :text="btnText"></van-button>
    <van-row>
    <van-col span="8" @click="isRegister=!isRegister"><span>{{regText}}</span></van-col>
    <van-col span="8"></van-col>
    <van-col span="8"><span>忘记密码？</span></van-col>
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
        code: '',
        isBtnLoading: false,
        isRegister:false,
      }
    },
    created () {
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
        // check code 
        this.$http.post('?c=1', {OpenId:this.username,Token:this.password},{headers:{'Content-Type':'application/json'}}).then(
         response => {
            if (response.status == 200 )  { 
                this.setSession(response.body.SessionID,response.body.Role);
                self.$router.push({path:"/home"}).catch(err => { console.log(err) })
            }
          },
          response => {
               this.$toast('服务器正忙，请稍后再试');
          });
      },
      setSession(token, role){
         localStorage.setItem("Token",token);
         localStorage.setItem('Role',JSON.stringify(role));
         localStorage.setItem("Timestamp",new Date().getTime()+23*60*60*1000);
      }
    }
}
</script>


<style lang="scss" scoped>
.login-container{
    display: flex;
    flex-direction: column;
}

.van-row {
    font-size: 12px;
}

.van-button {
    margin-top: 10px;
}

.wechat-login {
    text-align:end;
    padding: 0px 20px;
}

</style>