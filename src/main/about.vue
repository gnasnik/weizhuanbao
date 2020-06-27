<template>
<div class="app">
    <!-- 导航 -->
    <van-sticky>
        <van-nav-bar title="关于我们" left-arrow  @click-left="onClickLeft">
            <!-- <van-icon name="search" slot="right" /> -->
        </van-nav-bar>
    </van-sticky>
    

    <div class="app-icon">
        <div>
            <van-image width="66" height="66" src="./src/images/logo.png"/>
            <div class="app-name">微赚宝 v0.1.0</div>
        </div>
    </div>
    
</div> 
</template>
 
 

<script>
export default {
    data(){
        return {
        }
    },
    methods:{
        onClickLeft(){
            this.$router.go(-1);
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

    .app-icon {
        display: flex;
        justify-content: center;
        font-size: 12px;
        color: gray;
        padding-top: 50px;
        padding-bottom: 50px;
        background-color: white;

        .app-name {
            margin: 10px 0px;
        }
    }
</style>