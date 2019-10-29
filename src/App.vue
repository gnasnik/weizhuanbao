<template>
    <div class="app">
        <!-- 中间内容 -->
        <div class="middleContainter">
                <router-view></router-view>
        </div>
        <van-tabbar v-model="active" route v-show="this.$route.meta.footShow">
          <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
          <van-tabbar-item icon="cash-on-deliver" to="/find">大厅</van-tabbar-item>
          <van-tabbar-item icon="cashier-o" to="/task">任务</van-tabbar-item>
          <!-- <van-tabbar-item icon="fire-o" to="/active">活动</van-tabbar-item> -->
          <van-tabbar-item icon="user-circle-o" to="/me">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>


<script>
export default {
 data:function(){
        return {
            active:'',
        }
    },
}
</script>


<style lang="scss" scoped>
    .v-enter,
    .v-leave-to {
        opacity: 0;
        transform: translateX(100%);
    }

    .v-enter-active,
    .v-leave-active{
        transition: all 0.6s ease;
    }

    .middleContainter {
        display: flex;
        flex-direction: column;
        height: 100%;
        margin-bottom: 50px;
    }
</style>