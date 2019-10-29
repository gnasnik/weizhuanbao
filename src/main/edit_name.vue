<template>
<div class="app">
    <!-- 导航 -->
    <van-sticky>
        <van-nav-bar title="设置名字" left-arrow  @click-left="onClickLeft">
            <!-- <van-icon name="search" slot="right" /> -->
        </van-nav-bar>
    </van-sticky>

     <van-field v-model="value" clearable  :focus="true"/>
    
</div> 
</template>
 
 

<script>
export default {
    data(){
        return {
            focus:false,
            value:'',
        }
    },
    created(){
        this.value = this.$route.query.name;
        // this.focus();
    },
    methods:{
        onfocus(){
            return true
        },
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

</style>