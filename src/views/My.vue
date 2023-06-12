<template>
    <div class="my">
        <div class="bg-box">
            <div class="my-bg" v-if="userInfo.userBg" :style="{ backgroundImage: `url('${userInfo.userBg}')` }">
                <div class="my-update">
                    <van-uploader show-upload:false result-type:file :after-read="uploadBg" />
                </div>
            </div>
        </div>
        <div class="my-box">
            <div class="my-info">
                <div class="my-img">
                    <img class="auto_img" :src="userInfo.userImg" alt="">
                </div>
                <div class="userinfo">
                    <div class="user-name one_text">
                        {{ userInfo.nickName }}
                    </div>

                    <div class="user-desc one_text">{{ userInfo.desc == '' ? '这家伙很懒，什么都没有留下！' : userInfo.desc }}</div>
                </div>
            </div>
            <div class="my-list">
                <van-cell :title=item.title is-link @click="toPage(item.name)" v-for="(item, index) in listData" />
            </div>
        </div>
    </div>
</template>    

<script>
import { Toast } from "vant";
import "../assets/less/My.less"
export default {
    name: "My",
    data() {
        return {
            //用户信息
            userInfo: {},
            listData: [
                {
                    title: "个人资料",
                    name: "Account"
                },
                {
                    title: "我的订单",
                    name: "Order"
                },
                {
                    title: "我的收藏",
                    name: "Like"
                },
                {
                    title: "地址管理",
                    name: "Address"
                },
                {
                    title: "浏览足迹",
                    name: "Track"
                },
                {
                    title: "安全中心",
                    name: "Secure"
                },
            ]
        }
    },
    created() {
        this.getuserInfo()
    },
    methods: {
        //页面跳转
        toPage(name) {
            this.$router.push({ name: name })
        },

        //上传背景图片
        uploadBg(file) {
            //允许上传的文件类型
            let type = ['jpg', 'png', 'gif', 'jpeg', 'webp']

            //允许上传的最大大小
            let size = 1;

            //判断上传文件是否合法
            let fileType = file.file.type.split('/')[1];
            console.log(file);
            if (type.indexOf(fileType) === -1) {
                this.$toast(`文件类型仅${type.join(',')}`)
                return
            }

            //判断文件大小
            let filesize = file.file.size / 1024 / 1024
            if (filesize > size) {
                this.$toast(`请上传不大于${size}MB的图片`);
                return;
            }

            //处理base64标记
            let base64 = file.content.replace(/^data:image\/[AZa-z]+;base64,/, '')

            //上传文件
            let tokenString = localStorage.getItem("token");
            this.$toast.loading({
                message: "上传中...",
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
                url: "/updateUserBg",
                //请求参数,{}类型用Parmas，[]类型用data
                data: {
                    appkey: this.appkey,
                    tokenString: tokenString,
                    imgType: fileType,
                    serverBase64Img: base64,
                },

            })
                .then((result) => {
                    // console.log(result);
                    //清除轻提示
                    // this.$toast.clear();
                    this.$toast("更换背景成功!")
                    location.reload()
                    // if(result.data.code == 700){
                    //     this.$router.push({name:'Login'})
                    // }else if (result.data.code == "I001"){
                    //     this.userInfo.userBg=result.data.userBg
                    // }
                    // this.$toast(result.data.msg)
                })
        },

        //获取用户信息
        getuserInfo() {
            let tokenString = localStorage.getItem("token");

            // console.log(tokenString);
            if (tokenString) {
                this.$toast.loading({
                    message: "加载中....",
                    //点击穿透
                    forbidClick: true,
                    //延迟
                    duration: 0,
                });
                //发起请求
                this.axios({
                    //请求类型get or post
                    method: 'GET',
                    //请求路径
                    url: "/findMy",
                    //请求参数,{}类型用Parmas，[]类型用data
                    params: {
                        appkey: this.appkey,
                        tokenString,
                    },
                })
                    .then((result) => {
                        // console.log(result); 
                        //清除轻提示
                        this.$toast.clear();
                        // 判断是否取得数据
                        if (result.data.code == 'A001') {
                            this.userInfo = result.data.result[0];

                            // 成功提示
                            // Toast.success('yes')
                        } else if (result.data.code == 700) {
                            //token被篡改时
                            Toast.fail("token校验码已失效,请重新登录")
                            return this.$router.push({ name: 'Login' })
                        } else {
                            //失败提示
                            // Toast.fail('no')
                        }
                    })
                    .catch((err) => {
                        this.$toast.clear()
                    })
            } else {
                this.$toast("请先登录！")
                return this.$router.push({ name: 'Login' })
            }
        }
    }

}
</script>
