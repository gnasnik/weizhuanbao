<template>
<div class="app">
    <!-- 导航 -->
    <van-sticky>
        <van-nav-bar title="我的客服" left-arrow  @click-left="onClickLeft">
            <!-- <van-icon name="search" slot="right" /> -->
        </van-nav-bar>
    </van-sticky>

    <div class="wrapper">
        <van-cell title="添加微信号: umbra888" icon="../src/images/wx.png">
        </van-cell>
    </div>

    

</div> 
</template>
 
 

<script>
export default {
    data(){
        return {
            content:'',
            list:[],
        }
    },
    methods:{
        onClickLeft(){
            this.$router.go(-1);
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

</style>