<template>
<div class="app">
    <!-- 导航 -->
    <van-sticky>
        <van-nav-bar title="修改资料" left-arrow  @click-left="onClickLeft">
            <!-- <van-icon name="search" slot="right" /> -->
        </van-nav-bar>
    </van-sticky>

    <van-cell class="imgslot" title="头像" is-link to="">
          <template slot="right-icon">
            <van-uploader  :after-read="afterRead">
                <van-image class="avatar" round width="50px" height="50px" :src="this.role.Icon"/>
            </van-uploader>             
          </template>
    </van-cell>
    <van-cell title="名字" :value="role.NickName" is-link to="/edit"></van-cell>
    <van-cell title="姓别" :value="role.Gender | ToGender" is-link @click="showPicker=true"></van-cell>

    <van-popup v-model="showPicker" position="bottom">
    <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
    />
    </van-popup>
</div> 
</template>
 
 

<script>
export default {
    data(){
        return {
            role:'',
            showPicker:false,
            columns:['男','女'],
        }
    },
    created(){
        this.role = JSON.parse(localStorage.getItem('Role'));
    },
    filters:{
        ToGender(msg){
            if (msg == 1) {
                return '男';
            }else if (msg == 2) {
                return '女';
            }
            return '';
        }
    },
    methods:{
        onfocus(){
            return true
        },
        onClickLeft(){
            this.$router.go(-1);
        },
        onConfirm(value){
            if (value == '男') {
                this.role.Gender = 1;
            }else {
                this.role.Gender = 2;
            }
            this.showPicker = false;
            var self = this;
            var up = {Gender:this.role.Gender};
            this.$http.post('?c=3',up,{headers:{'Content-Type':'application/json'}}).then(
                resp=>{
                    if ( resp.status == 200 )  {
                        localStorage.setItem('Role',JSON.stringify(resp.body.user));
                    }
                },
                resp=>{console.log(resp.body)}) 
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