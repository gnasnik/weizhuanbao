<template>
<div class="app">
    <!-- 导航 -->
    <van-sticky>
        <van-nav-bar title="设置" left-arrow  @click-left="onClickLeft" right-text="确定" @click-right="onClickRight">
            <!-- <van-icon name="search" slot="right" /> -->
        </van-nav-bar>
    </van-sticky>

     <van-field v-model="role.NickName" clearable  :focus="true"/>
    
</div> 
</template>
 
 

<script>
export default {
    data(){
        return {
            focus:false,
            role:'',
        }
    },
    created(){
        this.role = JSON.parse(localStorage.getItem('Role'));
    },
    methods:{
        onfocus(){
            return true
        },
        onClickLeft(){
            this.$router.go(-1);
        },
        onClickRight(){
            var self = this;
            var up = {NickName:this.role.NickName};
            this.$http.post('?c=3',up,{headers:{'Content-Type':'application/json'}}).then(
                resp=>{
                    if ( resp.status == 200 )  {
                        localStorage.setItem('Role',JSON.stringify(resp.body.user));
                        self.$toast('修改成功')     
                        self.$router.go(-1);
                    }
                },
                resp=>{console.log(resp.body)})            
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