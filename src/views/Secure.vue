<template>
    <div class="Secure">
        <div class="navi">
            <van-nav-bar title="安全中心" left-text="返回" placeholder fixed left-arrow @click-left="back()" />
        </div>
        <div class="secure-bg"></div>
        <div class="secure-box">
            <van-cell-group>
                <van-cell title="修改密码" @click="toggleRegisterBox()" is-link />
                <van-cell title="删除账号" @click="destroyBox()" is-link />
            </van-cell-group>
        </div>
        <div class="btn-box">
            <van-button round type="info" size="" color="#c94d4d" @click="logOutBox()">退出登录</van-button>
        </div>

        <div class="van">
            <van-popup class="change-box" closeable position="bottom" v-model="isShow">
                <div class="change-title">修改密码</div>
                <van-cell-group>
                    <div class="password">
                        <van-field v-model="userPasswordInfo.old" :type="isRegisterInfo ? 'password' : 'text'"
                            name="旧密码" label="旧密码" placeholder="密码(6-16位)"
                            :right-icon="isRegisterInfo ? 'closed-eye' : 'eye-o'"
                            @click-right-icon="isRegisterPasswordType()" />
                        <van-field v-model="userPasswordInfo.new" :type="isRegisterInfo ? 'password' : 'text'"
                            name="新密码" label="新密码" placeholder="密码(6-16位)"
                            :right-icon="isRegisterInfo ? 'closed-eye' : 'eye-o'"
                            @click-right-icon="isRegisterPasswordType()" />
                    </div>

                    <div style="margin:15px">
                        <van-button class="v-login" color="#c94d4d" round block type="primary" native-type="submit" @click="change()">
                            确认修改
                        </van-button>
                    </div>
                </van-cell-group>
            </van-popup>
        </div>
    </div>
</template>
<script>
import "../assets/less/Secure.less"
import { validForm } from "../assets/js/validForm"
export default{
    name:"Secure",
    data(){
        return{
            isShow: false,
            isRegisterInfo: true,
            userPasswordInfo: {
                new: "",
                old: "",
        }
    }
},
methods: {
        destroyBox(){
            this.$dialog.confirm({
                title:"注销账号",
                message:"是否注销账号",
            })
            .then(()=>{
                this.destroyAccount();
            })
        },
        logOutBox(){
            this.$dialog.confirm({
                title:"退出登录",
                message:"是否退出登录?",
            })
            .then(()=>{
                this.logOut();
            })
        },
        destroyAccount(){
            let tokenString = localStorage.getItem("token")
            // console.log(tokenString)
            if (!tokenString) {
                this.$toast("请先登录");
                return this.$router.push({ name: "Login" })
            }
            this.$toast.loading({
                message: "正在注销",
                forbidClick: true,
                duration: 0,
            });
            this.axios({
                method: "POST",
                url: "/destroyAccount",
                data: {
                    appkey:this.appkey,
                    tokenString
                }
            })
            .then((result) => {
                    console.log(result);
                    if (result.data.code == "G001" ||result.data.code ==700) {
                        this.$toast(result.data.msg);
                        this.$router.push({ name: "Login" });
                    }
                })
                .catch((err) => {
                    this.$toast.clear();
                })
        },
        logOut() {
            let tokenString = localStorage.getItem("token")
            // console.log(tokenString)
            if (!tokenString) {
                this.$toast("请先登录");
                return this.$router.push({ name: "Login" })
            }
            this.$toast.loading({
                message: "正在退出",
                forbidClick: true,
                duration: 0,
            });
            this.axios({
                method: "POST",
                url: "/logout",
                data: {
                    appkey:this.appkey,
                    tokenString
                }
            })
                .then((result) => {
                    console.log(result);
                    if (result.data.code == "F001" ||result.data.code ==700) {
                        this.$toast(result.data.msg);
                        this.$router.push({ name: "Login" });
                    }
                })
                .catch((err) => {
                    this.$toast.clear();
                })
        },
        change() {
            let tokenString = localStorage.getItem("token")
            // console.log(tokenString)
            if (!tokenString) {
                this.$toast("请先登录");
                return this.$router.push({ name: "Login" })
            }

            let o = {
                new: {
                    value: this.userPasswordInfo.new,
                    errorMsg: '密码支持数字字母下划线组合,且必须以字母开头,6-16位',
                    reg: /^[A-Za-z]\w{5,15}$/
                },
                old: {
                    value: this.userPasswordInfo.old,
                    errorMsg: '密码支持数字字母下划线组合,且必须以字母开头,6-16位',
                    reg: /^[A-Za-z]\w{5,15}$/
                },
            };
            let isPass = validForm.valid(o);
            if (isPass) {
                if(this.userPasswordInfo.old==this.userPasswordInfo.new){
                    this.$toast("新旧密码不能相同")
                }else{
                    this.$toast.loading({
                    message: "正在修改",
                    forbidClick: true,
                    duration: 0,
                });
                this.axios({
                    method: "POST",
                    url: "/updatePassword",
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        password: this.userPasswordInfo.new,
                        oldPassword: this.userPasswordInfo.old
                    }
                })
                    .then((result) => {
                        console.log(result);
                        if (result.data.code == "E001") {
                            this.$toast(result.data.msg);
                            this.$router.push({ name: "Login" });
                        }
                    })
                    .catch((err) => {
                        this.$toast.clear();
                    })
                }
                
            }




        },
        back() {
            this.$router.go(-1)
        },
        toggleRegisterBox() {
            this.isShow = !this.isShow
        },

        isRegisterPasswordType() {
            this.isRegisterInfo = !this.isRegisterInfo
        },
    }
}
</script>