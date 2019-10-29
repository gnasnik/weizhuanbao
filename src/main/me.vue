<template>
<div class="app">
  <div class="header-out">
  <div class="me-header">
    <div class="me-nav">我的</div>
    <div class="me-avatar">
      <van-uploader  :after-read="afterRead">
          <van-image round width="50px" height="50px" :src="this.role.Icon | defaultAvatar"/>
      </van-uploader>
      <div class="me-desc" @click="onEditName">
          <span class="me-nickname">{{this.role.NickName}}</span>
          <span class="me-id">ID：{{this.role.UserID}} <van-tag color="#FFD700">lv{{this.role.Level}}</van-tag></span>
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
    </div>
    </div> 
  </div>
  <div class="me-container">
    <div class="me-body">
      <van-cell title="账单" icon="orders-o"></van-cell>
      <van-cell title="钱包" icon="paid"></van-cell>
      <van-cell title="我的二维码" icon="qr" is-link to="/share"></van-cell>
    </div>

    <div class="me-body-2">
      <van-cell title="帮助中心" icon="question-o"></van-cell>
      <van-cell title="意见反馈" icon="records" is-link to="/feedback"></van-cell>
      <van-cell title="关于我们" icon="info-o"  is-link to="/about"></van-cell>
    </div>

    <div class="logout" @click="logout">退出登陆</div>

    <div class="bottom"></div>
  </div>

</div>
</template>

<script>
export default {
    data(){
        return {
           role:'',
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
      this.role = JSON.parse(localStorage.getItem('Role'))
    },
    methods:{
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
      strNumSize(tempNum){
        var stringNum = tempNum.toString()
        var index = stringNum.indexOf(".")
        var newNum = stringNum;
        if(index!=-1){
        newNum = stringNum.substring(0,index)
        }
        return newNum.length
      },
      unitConvert(num) {
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
      afterRead(file) {
            var self = this;
            this.$http.get('?c=7').then(resp=>{
                if (resp.status==200) {
                    var uuid = this.uuid()
                    var pic = file.content.replace(/^.*?,/, '');
                    var spl = file.file.name.split(".");
                    var key = Base64.encode(uuid+'.'+spl[spl.length-1]);
                    var mineType = Base64.encode(file.file.type);
                    this.$http.post("http://up-z2.qiniup.com/putb64/-1/key/"+key+'/mimeType/'+ mineType,pic,
                        {headers: {'Content-Type': 'application/octet-stream', 'Authorization': "UpToken "+resp.body.UpToken}}
                    ).then(resp => {
                      var icon = "http://pzjt57d8l.bkt.clouddn.com/"+ resp.data.key;
                      var up = {
                        Image:icon,
                      }
                      this.$http.post('?c=4',up,{headers:{'Content-Type':'application/json'}}).then(
                          resp => {
                              if (resp.status == 200 )  {
                                  // self.role.Icon = icon;
                                  localStorage.setItem('Role',JSON.stringify(resp.body.user));
                                  self.role = resp.body.user;
                              }
                          },
                          resp => {console.log(resp.body)}); 
                    },resp => {
                        console.log('上传失败',resp);
                    }).catch(function (error) {
                        console.log('上传失败',error)
                    });
                } 
            },resp=>{})
      },
      logout(){
        localStorage.removeItem('Token');
        localStorage.removeItem('Role');
        localStorage.removeItem('Timestamp');
        this.$router.push('/login');
      },
      onEditName(){
          this.$router.push({path:"/edit_name",query:{name:this.role.NickName}})
      }
    }
}
</script>


<style lang="scss" scoped>
  .header-out {
    // margin: 5px 5px;
  }
  .me-header{
    background: url("../images/bg_003.png");
    padding-bottom: 10px;
    // border-radius: 5px;

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

        .van-image {
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

        .me-id {
            font-size: 13px;
            text-align: start;
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
        line-height: 14px;
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