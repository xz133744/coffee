<template>
    <div class="login">
        <div>
            <van-nav-bar right-text="首页" @click-right="gohome('Home')">
                <template #left>
                    <div class="nav-left">
                        <div class="login_logo fl">
                            <img class="auto_img " src="../assets/images/home_active.png" alt="">
                        </div>
                        <div class="logo_text fl">Luckin Coffee</div>
                    </div>
                </template>
            </van-nav-bar>
            <div class="user-box">
                <div class="welcome">忘记密码！</div>
                <div class="en-welcome">Forgot password!</div>
            </div>
            <div class="login_signfrom">
                <van-form>
                    <van-cell-group inset>
                        <van-field v-model="userInfo.phone" name="用户名" label="手机号" placeholder="手机名"
                            autocomplete="off" />
                        <van-field v-model="userInfo.password" :type="isRegisterPassword ? 'password' : 'text'"
                            name="密码" label="新密码" placeholder="新密码(6-16位)"
                            :right-icon="isRegisterPassword ? 'closed-eye' : 'eye-o'"
                            @click-right-icon="toggleRegisterPasswordType" />
                        <van-field v-model="userInfo.mailbox" name="邮箱" label="邮箱" placeholder="邮箱"
                            autocomplete="off" />
                        <van-field v-model="userInfo.mailbox_yzm" center clearable label="邮箱验证码" placeholder="验证码(6位数字)">
                            <template #button>
                                <van-button color="#0c34ba" size="small" type="primary">发送验证码</van-button>
                            </template>
                        </van-field>
                    </van-cell-group>
                    <div class="forgot">
                        <div class="forgot_pwd" @click="goForgot('Login')">
                            已有密码？立即登录
                        </div>
                    </div>
                    <div style="margin: 16px;">
                        <van-button round block type="primary" style="background-color: #0c34ba;border-color: #0c34ba;"
                            native-type="submit" @click="login()">
                            登录
                        </van-button>
                    </div>
                </van-form>
            </div>
        </div>
    </div>
</template>

<script>
import "../assets/less/ForGot.less"
//导入表单验证模块插件
// import {} from "../assets/js/validForm.js"
import { validForm } from "../assets/js/validForm"
// import { validForm } from "@/js/validForm"
export default {
    name: "Login",
    data() {
        return {
            //记录用户登录信息
            userInfo: {
                phone: '',
                password: '',
                mailbox: '',
                mailbox_yzm: ''
            },
            //记录用户注册信息
            userRegister: {
                phone: '',
                password: '',
                mailbox: '',
                mailbox_yzm: ''
            },

            //注册信息的开关
            isShow: false,
            //密码类型
            isRegisterPassword: true,
        }
    },
    methods: {
        gohome(name) {
            this.$router.push({ name })
        },
        //忘记密码跳转
        goForgot(name) {
            this.$router.push({ name })
        },
        //密码框小眼睛
        toggleRegisterPasswordType() {
            this.isRegisterPassword = !this.isRegisterPassword
        },
        //注册弹出层
        toggleRisterShow() {
            this.isShow = !this.isShow
        },

        //登录
        login() {
            //构建表单的验证消息
            // let o = {
            //     phone: {
            //         value: this.userInfo.phone,
            //         //错误信息提示
            //         errorMsg: '手机号格式错误',
            //         //正则匹配
            //         reg: /^1[3-9]\d{9}$/
            //     },
            //     password: {
            //         value: this.userInfo.password,
            //         errorMsg: '密码支持数字字母或下划线组合,且必须以字母开头,6-16位',
            //         reg: /^[A-Za-z]\w{5,15}$/
            //     },
            // };
            // let isPass = validForm.valid(o);
            // if (isPass) {
            let userInfo = Object.assign({}, this.userInfo);
            userInfo.appkey = this.appkey;

            this.$toast.loading({
                message: "正在露出鸡脚....",
                //点击穿透
                forbidClick: true,
                //延迟
                duration: 1,
            });
            //发起请求
            this.axios({
                //请求类型get or post
                method: 'POST',
                //请求路径
                url: "/retrievePassword",
                //请求参数,{}类型用Parmas，[]类型用data
                // data: userInfo,
                data: {
                    appkey: this.appkey,
                    phone: userInfo.phone,
                    password: userInfo.password,
                }

            })
                .then(result => {
                    console.log(result);
                    if (result.data.code == 200) {
                        //登录成功，保存token
                        localStorage.setItem('token', result.data.token)
                        console.log(result.data.token);
                        this.$router.push({ name: 'Home' })
                    } else {
                        this.$toast(result.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
            // }
        }
    },

}
</script>