<template>
<div class="app">
  <div class="header-out">
  <div class="me-header">
    <div class="me-nav">我的</div>
    <div class="me-avatar">
      <!-- <van-uploader  :after-read="afterRead"> -->
      <van-image class="avatar" round width="50px" height="50px" :src="this.role.Icon | defaultAvatar"/>
      <!-- </van-uploader> -->
      <div class="me-desc" @click="onEditName">
          <div>
             <span class="me-nickname">{{this.role.NickName}}</span> 
             <van-image v-if="this.role.Gender==1" width="20" height="20" src="./src/images/male1.png" />
             <van-image v-else-if="this.role.Gender==2" width="20" height="20" src="./src/images/female1.png" />
          </div>
         
          <span v-if="role" class="me-id">ID：{{this.role.UserID}} <van-tag color="#FFD700">lv{{this.role.Level}}</van-tag></span>
          <div v-else @click.stop="clickLogin">登陆</div>
      </div>
      <div class="me-more" @click="onEditName"><van-icon name="arrow" size="20px"/></div>
    </div>
    <div class="me-info">
      <div>
          <div> {{this.role.Cash / 1000 | zeroDefault}} </div>
          <div class="unit"> 现金(元)</div>
      </div>
      <div>
          <div> {{unitConvert(this.role.Coins)}} </div>
          <div class="unit"> 微币(枚)  </div>
      </div>
      <div>
          <div>{{this.role.Profit / 1000 | zeroDefault}}</div>
          <div class="unit"> 总收入(元)</div>
      </div>
      <van-button v-show="role" round type="default" size="mini" style="line-height='22px'" @click="onSignIn" 
          :text="task_id!=0?'签到':'已签到'" :disabled="task_id==0"></van-button>
    </div>
    </div> 
  </div>
  <div class="me-container">
    <!-- <div class="mail">
        <van-cell title="消息" icon="envelop-o"></van-cell>
    </div> -->
    <div class="me-body">
      <van-cell title="账单" icon="orders-o" @click="notOpen"></van-cell>
      <van-cell title="钱包" icon="paid" @click="notOpen"></van-cell>
      <van-cell title="微币商城" icon="shop-o" is-link to="/shop"></van-cell>
      <van-cell v-show="role" title="我的二维码" icon="qr" is-link to="/share"></van-cell>
    </div>

    <div class="me-body-2">
      <!-- <van-cell title="帮助中心" icon="question-o"></van-cell> -->
      <van-cell title="我的客服" icon="service-o" is-link to="/service"></van-cell>
      <van-cell title="意见反馈" icon="records" is-link to="/feedback"></van-cell>
      <van-cell title="关于我们" icon="info-o"  is-link to="/about"></van-cell>
    </div>

    <div v-show="role" class="logout" @click="logout">退出登陆</div>

    <div class="bottom"></div>
  </div>

</div>
</template>

<script>
export default {
    data(){
        return {
           role:'',
           task_id:0,
        }
    },
    filters:{
        zeroDefault(x) {
          if (x) {return x.toFixed(2)}
          return 0.00
        }, 
        defaultAvatar(icon) {
          if (icon) {return icon}
          return '../src/images/default_avatar.jpg'
        }
    },
    created(){
      this.userInfo();
      this.taskList();
    },
    methods:{
      strNumSize(tempNum){
        var stringNum = tempNum.toString();
        var index = stringNum.indexOf(".")
        var newNum = stringNum;
        if(index!=-1){
        newNum = stringNum.substring(0,index)
        }
        return newNum.length
      },
      unitConvert(num) {
        if (!num) {
          return '0';
        }
        var moneyUnits = ["", "万", "亿", "万亿"]
        var dividend = 10000;
        var curentNum = num;
        //转换数字
        var curentUnit = moneyUnits[0];
        //转换单位
        for (var i = 0; i <4; i++) {
          curentUnit = moneyUnits[i]
            if(this.strNumSize(curentNum)<5){
              break;
            }
          curentNum = curentNum / dividend
        }
        var m = curentNum + '' + curentUnit;
        // var m = {num: 0, unit: ""}
        // m.num = curentNum.toFixed(2)
        // m.unit = curentUnit;
        return m;
      },
      userInfo(){
          var up = {};
          this.$http.post('?c=3',up,{headers:{'Content-Type':'application/json'}}).then(
              resp=>{
                  if ( resp.status == 200 )  {
                      localStorage.setItem('Role',JSON.stringify(resp.body.user));
                      this.role = resp.body.user;
                  }
              },
              resp=>{console.log(resp.body)})   
      },
      taskList(){
          var self = this;
          var tag = {Tag:'WeekSigning'};
          this.$http.post('?c=21',tag,{headers:{'Content-Type':'application/json'}}).then(
          resp => {
              if (resp.status == 200 )  {
                  console.log(resp.body);
                  for (var i = 0; i< resp.body.TaskList.length; i++) {
                     var task = resp.body.TaskList[i];
                     if (!task.Finish) {
                         self.task_id = task.TaskID;
                     }
                  }
              }
          },
          resp => {console.log(resp);});
      },
      logout(){
        localStorage.removeItem('Token');
        localStorage.removeItem('Role');
        localStorage.removeItem('Timestamp');
        this.$router.push('/login');
      },
      onEditName(){
          if (!this.role){
            this.$router.push("/login");
            return 
          }
          this.$router.push({path:"/settings"})
      },
      notOpen(){
        this.$toast("暂未开放，敬请期待")
      },
      clickLogin(){
        this.$router.push("/login");
      },
      onSignIn(){
          var self = this;
          var sign = {TaskId:this.task_id};
          this.$http.post('?c=22',sign,{headers:{'Content-Type':'application/json'}}).then(
          resp => {
              if (resp.status == 200 )  {
                  console.log(resp.body);
                  var rewards = resp.body.Rewards[0];
                  if (rewards.ItemID == 1001) {
                     self.$toast({ title:'签到成功',message: '+' + rewards.Count  ,icon: '../src/images/icon2.png'})
                  }
                  self.role.Coins += rewards.Count;
              }
          },
          resp => {
            if(resp.body.code == 262146) {
              self.$toast('今天已签到');
            }
            console.log(resp);});
      }
    }
}
</script>


<style lang="scss" scoped>
  .header-out {
    // margin: 10px 10px;
  }
  .me-header{
    background: url("../images/bg_003.png");
    padding-bottom: 10px;
    // border-radius: 10px;

      .me-nav {
        display: flex;
        color: white;
        padding: 10px 10px;
        line-height: 18px;
      }
      .me-avatar {
        display: flex;
        color: white;
        font-size: 18px;
        padding: 10px 10px;
        text-align:center;
        line-height: 22px;

        .avatar {
          background-color: white;
        }

        .me-more {
          flex: 1;
          padding: 5px 5px;
          text-align: end;
        }
      }

      .me-desc{
        display: flex;
        flex-direction: column;
        padding-left: 10px;
        text-align: start;

        .me-id {
            font-size: 13px;
        }
        .van-tag {
          height: 12px;
          font-size: 10px;
          line-height: 10px;
        }
      }

      .van-icon-arrow {
        justify-content: center;
      }

      .me-info {
        display: flex;
        justify-content: flex-start;
        margin: 5px 20px;
        color: white;
        font-size: 13px;
        text-align: center;

        .unit{
          font-size: 12px;
          padding-top: 5px;
        }

        div {
          padding-right: 10px;
        }
      }

  }
    .me-container{
      .mail {
        margin-top: 10px;
        margin-bottom: 10px; 
      }
      .van-cell__left-icon {
        font-size: 18px;
        margin-right: 10px;
      }

      .van-icon-orders-o {
        color: blue; 
      }
      .van-icon-paid {
        color:slateblue;
      }
      .van-icon-qr {
        color:turquoise;
      }

      .van-icon-question-o {
        color:lightseagreen;
      }
      .van-icon-records {
        color:lightskyblue;;
      }

      .logout {
        width: 100%;
        background-color: white;
        text-align: center;
        margin-top: 10px;
        font-size: 15px;
        color: #FA6054;
        line-height: 20px;
        padding: 10px 0;
      }
    }

    .me-body {
      margin-bottom: 10px;
    }


    .app {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #f5f5f5;
    }


</style>