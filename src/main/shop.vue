<template>
<div class="app">
    <!-- 导航 -->
    <van-sticky>
        <van-nav-bar title="微币商城" left-arrow  @click-left="onClickLeft"></van-nav-bar>
    </van-sticky>

    <van-card num="0" price="5000 微币" desc="5元现金红包"  title="5元现金红包" currency="" thumb="../src/images/redpacket.png">
        <div slot="footer">
            <van-button size="mini" disabled>售罄</van-button>
        </div>
    </van-card>
    
    <van-submit-bar :price="0" disabled button-text="提交订单" @submit="onSubmit"/>

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
        onSubmit(){},
    }
}
</script>
 
<style lang="scss" scoped>
    .app {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color:#f5f5f5;
    }
</style>