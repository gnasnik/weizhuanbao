<template>
<div>
    <!-- 导航 -->
    <van-nav-bar title="发布任务" left-text="返回" left-arrow  @click-left="onClickLeft"></van-nav-bar>

    <!-- 选择任务类型 -->
    <van-cell title="选择任务类型" required is-link :value="mission_name"  @click="showMissionTag=!showMissionTag"/>
    <van-row gutter="20" v-show="showMissionTag">
    <van-col span="6" v-for="item in mission_types" :key="item.Id">
        <!-- <van-tag color="#f2826a" size="large" @click="onMissionSelected(item)">{{item.Name}}</van-tag> -->
        <div @click="onMissionSelected(item)">
            <van-image width="25" height="25" :src="item.Icon" />
            <div>{{item.Name}}</div>
        </div>
    </van-col>
    </van-row>

    <van-cell  title="" icon="question-o"  v-show="!showMissionTag" :label="mission_desc" />

    <van-cell-group>
        <!-- 标题 -->
        <van-field v-model="mission.Title" label="标题："   required type="textarea" placeholder="请输入任务名称" rows="1" autosize />
        <van-field v-model.number="mission.Price" type="number" label="单价(元)：" required placeholder="请输入任务单价,0.01元起" rows="1" 
            autosize  right-icon="info-o" @click-right-icon="$toast('提高任务单价更容易成单')"/>
        <van-field v-model.number="mission.Amount" type="number" label="任务数量：" required placeholder="请输入任务数量" rows="1" autosize />

        <!-- 验收时间 -->
        <van-field readonly clickable label="验收时间：" type="number" required :value="mission.CheckTime" placeholder="选择验收时间" @click="showPicker = true" />
        <van-popup v-model="showPicker" position="bottom">
        <van-picker show-toolbar :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
        </van-popup>

        <van-cell class="cell-radio" title="选择形式：" required clickable>
            <van-radio-group v-model="url_type">
                <van-radio name="qrcode" checked-color="#EE0A24" icon-size="10px">上传二维码</van-radio>
                <van-radio name="url" checked-color="#EE0A24" icon-size="10px">粘贴链接</van-radio> 
            </van-radio-group>
        </van-cell>
        

        <!-- 二维码 -->
        <div class="setting-container">
            <van-uploader :after-read="afterRead" name='qrcode'  v-show="url_type=='qrcode'" v-model="file_list" :max-count="1"/>
            <van-field v-model="mission.EntryURL" label="链接" placeholder="输入用户要跳转的链接" 
                rows="1" autosize v-show="url_type=='url'"/>
        </div>


        <!-- 操作步骤说明 -->
        <van-cell title="操作说明" required class="step-intro">
        <div class="step-container">
            <div class="steps">
                <van-field v-model="mission.Description" type="textarea" placeholder="请填写文字，简单易懂将大幅提高接单效率" rows="1" autosize />
                <div v-for="item in step_list" :key="item.id" class="step">
                    <div class="step-number">
                        <label>步骤</label> <div class="bg-step">{{ item.id }}</div>
                    </div>
                    <van-uploader :after-read="afterRead" name='step' v-model="item.url" :max-count="1"/>
                </div>
            </div>
            <van-button type="primary" color="#EE0A24" size="small" @click="addStep">添加图片</van-button>
        </div>
        </van-cell>


        <!-- 设置审核 -->
        <van-cell class="check-container" title="设置审核" required label="审核图样最多三张，要求用户提供几张图片，就上传几张">
        <van-uploader :after-read="afterRead" name='check' v-model="check_list" :max-count="3"/>
        <van-field v-model="mission.Content" label="审核文字" placeholder="如要接单人提供文字信息" rows="1" autosize/>    
        <van-button type="primary" color="#EE0A24" size="large" @click="createMission">发布任务</van-button>
        </van-cell>
    </van-cell-group>
    
</div> 
</template>。

<script>
let Base64 = require('js-base64').Base64;
export default {
    data(){
        return {
            role :'',
            url_type:"qrcode",
            file_list:[], // 上传的预览图片
            step_list:[], // 步骤预览图
            check_list:[], // 审核图样
            showPicker: false,
            columns: [10, 30, 60, 120],
            mission:{
                Title:"",
                Price:"",
                Amount:"",
                CheckTime:120,
                QRCode:'',
                EntryURL:'',
                Steps:[],
                Reviews:[],
                Description:'',
                Content:'',
            },
            showMissionTag:true,
            mission_desc:"",
            mission_name:"",
            mission_types: [],
        }
    },
    created(){
        this.role = JSON.parse(localStorage.getItem('Role'))
        this.$http.get('?c=8',{}).then(rsp => {
            this.mission_types = rsp.body.Types;
        },rsp=>{
            console.log("get mission typs error", rsp)
        })
    },
    methods:{
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
        onClickLeft(){
            this.$router.go(-1);
        },
        afterRead(file,detail) {
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
                     var image_url  = "http://pzjt57d8l.bkt.clouddn.com/"+ resp.data.key;
                     switch (detail.name) {
                         case 'qrcode':
                             self.mission.QRCode = image_url;
                             break;
                         case 'step':
                             self.mission.Steps.push({Number:self.mission.Steps.length,Image:image_url})
                             break;
                         case 'check':
                             self.mission.Reviews.push(image_url)
                            break;
                     }
                    },resp => {
                        console.log('上传失败',resp);
                    }).catch(function (error) {
                        console.log('上传失败',error)
                    });
                } 
            },resp=>{})
        },
        onMissionSelected(item){
           this.showMissionTag = false;
           this.mission_desc = item.Description;
           this.mission_name = item.Name;
           this.mission.Title = item.Name + "任务";
           this.mission.Type = item.ID
        },
        addStep(){
            this.step_list.push({id:this.step_list.length+1,url:[]})
        },
        onConfirm(value) {
            this.check_time = value;
            this.showPicker = false;
        },
        createMission(){
            var self = this;
            if (!this.mission.Title) {
                this.$toast('标题不能为空');
                return
            }
            if (!this.mission.Price) {
                this.$toast('单价不能为空');
                return
            }
            if (this.mission.Price < 0.01) {
                this.$toast('单价不能低于 0.01 元')
            }
            self.mission.Price = Math.round(self.mission.Price *100)
            this.$http.post("?c=6",self.mission,{headers:{'Content-Type':'application/json'}}).then(resp=>{
                if (resp.status == 200) {
                   self.mission.UserInfo = JSON.parse(localStorage.getItem('Role'));
                   self.$router.push({path:"/detail",query:self.mission});
                }
            },resp=>{
                if (resp.body.code == 65543) {
                    self.$toast('余额不足，请充值');
                    self.mission.Price = self.mission.Price / 100
                }
            })
        },
        updateRole(){

        }
    }
}
</script>


<style lang="scss"> 
.van-row {
    padding: 5px 20px 5px 20px;
    text-align: center;
    line-height:20px;
    font-size: 10px;
    color: grey;
}

.cell-radio {
    .van-cell__title {
        position: relative;
        flex: 1;
    }
    .van-cell__value {
        flex: 3;
        position: relative;
    }
    .van-radio {
        float: left;
        padding-left: 5px;
    }
}

.setting-container {
    margin: 5px 0px 0px 5px;
    text-align: center;
}

.step-intro {
    flex-direction: column;
}

.step-container {
    display: flex;
    flex-direction: column;

    .step,
    .step-number {
        display: flex;
    }

    .step-number {
        width: 100px;
        justify-content:center;
        align-items: center;
        font-size: 14px;
        color: #969799;
    }

    .bg-step {
        width: 18px;
        height: 18px;
        color:white;
        border-radius: 50%;
        text-align: center;
        line-height: 18px;
        font-size: 12px;
        margin-left: 10px;
        background-color: #969799;
    }
}

.check-container {
    flex-direction: column;
    // justify-content: left;;

    .van-cell__value {
        text-align: left;
    }
}
</style>