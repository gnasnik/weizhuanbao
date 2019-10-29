<template>
<div class="app">
    <!-- 导航 -->
    <van-sticky>
        <van-nav-bar title="意见反馈" left-arrow  @click-left="onClickLeft">
            <!-- <van-icon name="search" slot="right" /> -->
        </van-nav-bar>
    </van-sticky>

    <van-field v-model="content"   type="textarea" :autosize="{maxHeight: 300, minHeight: 200}" size="large" placeholder="请输入内容" />

    <van-submit-bar button-text="提交" @submit="onSubmit"/>
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
        },
        onSubmit(){

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
    .van-submit-bar__button {
        width: 100%;
    }
</style>