<template>
<div class="app">
    <!-- 导航 -->
    <van-nav-bar title="意见反馈" fixed left-arrow  @click-left="onClickLeft"></van-nav-bar>

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
            this.$toast('感谢您的反馈与建议')
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
    .van-submit-bar__button {
        width: 100%;
    }
</style>