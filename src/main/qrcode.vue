<template>
<div class="app">
    <!-- 导航 -->
    <van-sticky>
        <van-nav-bar title="邀请有礼" left-arrow  @click-left="onClickLeft">
            <!-- <van-icon name="search" slot="right" /> -->
        </van-nav-bar>
    </van-sticky>

    <div class="imageWrapper" ref="imageWrapper">
         <img class="real_pic" crossorigin="anonymous" width="100%" :src="dataURL" />
         <div>
            <div class="top">
                <div class="tm">
                    <van-image class="avatar" round width="50px" height="50px" :src="this.role.Icon | defaultAvatar"/>
                    <!-- <div>{{this.role.NickName}}</div> -->
                    <div>
                        <div>
                            <span class="me-nickname">{{this.role.NickName}}</span> 
                            <van-image v-if="this.role.Gender==1" width="15" height="15" src="./src/images/male1.png" />
                            <van-image v-else-if="this.role.Gender==2" width="15" height="15" src="./src/images/female1.png" />
                        </div>
                    </div>
                    <div>邀请你加入</div>
                    <div class="out">
                        <div class="inner">微赚宝</div>
                    </div>
                    <div>每邀请一个新用户，将会各获得1000微币</div>
                </div>
            </div>
            <div class="bottom">
                <div class="bm">
                    <div id="qrcode"></div>  
                    <div>长按识别二维码进入</div>
                </div>
            </div>
         </div>

    </div>
    <div class="save"><van-icon name="down" /> 长按图片保存或分享给朋友</div>

</div> 
</template>
 
 

<script>
import QRCode from 'qrcodejs2';
import html2canvas from 'html2canvas';
export default {
    data(){
        return {
            role:'',
            list:[],
            dataURL: '',
        }
    },
    filters:{
        defaultAvatar(icon) {
          if (icon) {return icon}
          return '../src/images/default_avatar.jpg'
        }
    },
    created(){
      this.role = JSON.parse(localStorage.getItem('Role'))
    },
    mounted () {  //调用
        this.qrcode() ;
        this.toImage(); 
    },

    methods:{
        onClickLeft(){
            this.$router.go(-1);
        },
        qrcode () {  
            let qrcode = new QRCode('qrcode', {  
            width: 100, 
            height: 100, // 高度  [图片上传失败...(image-9ad77b-1525851843730)]          
            text: 'http://10.244.49.185:4200/#/login?invite='+ this.role.InviteCode, // 二维码内容  
            // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）  
            // background: '#f0f'             // foreground: '#ff0'  
            })  
            // console.log(qrcode)  
        } ,
        toImage() {
            html2canvas(this.$refs.imageWrapper,{
                backgroundColor: null,
                useCORS:true,
            }).then((canvas) => {
                let dataURL = canvas.toDataURL("image/png");
                this.dataURL = dataURL;
            });
        }
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
    .imageWrapper {
        margin: 5px 10px;
    }
    .top, .bottom {
        height: 200px;
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .top {
        background: url("../images/bg_005.png");
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        font-size: 14px;
        .avatar {
            background-color: white;    
        }
        .out{
            display: flex;
            width: 100%;
            justify-content: center;
        }
        .inner {
            width: 50px;
            background-color: orange;
            border-radius: 5px;
            padding: 2px 15px;
        }
        .tm {
            margin-top: 20px;
            text-align: center;
            color: white;
            div {
                margin-top: 5px;
            }
        }
    }

    .bottom {
        background-color: white;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        font-size: 10px;
        .bm {
            margin-top: 20px;
            color: gray;
        }
        #qrcode {
            margin-bottom: 15px;
        }
    }

    .save {
        margin-top: 10px;
        text-align: center;
        font-size: 12px;
        color: gray;
    }
</style>