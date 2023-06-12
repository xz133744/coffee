<template>
    <div class="account">
        <van-nav-bar title="个人资料" left-text="返回" left-arrow fixed @click-left="back()" />
        <!-- <MyBg>


        </MyBg> -->
        <bgBox>
            <van-cell-group inset>
                <van-cell title="头像" center:true>
                    <div class="avatar">
                        <img :src=accountInfo.userImg class="auto_img" alt="">
                        <van-uploader class="uploader-box"  :after-read="uploadAvatar">

                        </van-uploader>
                    </div>

                </van-cell>
                <van-cell title="用户id" center:true>
                    {{ accountInfo.userId }}
                </van-cell>
                <van-cell title="手机号" center:true>
                    {{ accountInfo.phone }}
                </van-cell>
                <van-cell title="昵称" center:true>
                    <van-field class="nickName" @blur="nickNameBlur()" input-align="right"
                        v-model="accountInfo.nickName">

                    </van-field>
                </van-cell>
                <div class="desc-box">
                    <div class="desc-content">
                        <div class="desc-title">简介</div>
                        <van-field v-model="accountInfo.desc" placeholder="这个家伙很懒，什么都没留下" label-align="right"
                            type="textarea" show-word-limit:true maxlength:41 @blur="descBlur" />
                    </div>
                </div>
            </van-cell-group>
        </bgBox>

    </div>
</template>
<script>
import bgBox from "../components/bgBox.vue"
import MyBg from "../components/MyBg.vue"
export default {
    name: "Account",
    data() {
        return {
            accountInfo: {
                nickName: "",
                desc: "",
                phone: "",
                userId: "",
            },
        }
    },
    components: {
        MyBg,
        bgBox
    },
    created() {
        this.getAccountInfo()
    },
    methods: {
        back() {
            this.$router.go(-1)
        },

        //上传头像
        uploadAvatar(file) {
            let base64 = file.content.replace(/^data:image\/[A-Za-z]+;base64,/, '');

            let tokenString = localStorage.getItem("token")
            // 允许上传的文件类型
            let type = ['jpg', 'png', 'git', 'jpeg', 'webp'];
            // 允许最大大小1mb
            let size = 1;
            console.log(file);
            // 判断文件类型
            let fileType = file.file.type.split('/')[1];
            if (type.indexOf(fileType) === -1) {
                this.$toast(`文件类型仅支持${type.join(',')}`);
                return;
            }
            let fileSize = file.file.size / 1024 / 1024;
            console.log(fileSize)
            if (fileSize > size) {
                this.$toast(`文件最大不能超过${size}MB`);
                return;
            }
            this.$toast.loading({
                message: "加载中....",
                forbidClick: true,
                duration: 1
            })
            this.axios({
                method: "POST",
                url: "/updateAvatar",
                data: {
                    appkey: this.appkey,
                    tokenString: tokenString,
                    imgType: fileType,
                    serverBase64Img: base64
                }
            })
                .then((result) => {
                    this.$toast.clear();
                    console.log(result);
                    // location.reload();
                    if (result.data.code == 700) {
                        this.$router.push({ name: "Login" })
                    } else if (result.data.code == "H001") {
                        this.accountInfo.userImg = result.data.userImg;
                        this.$toast(result.data.msg)
                    }
                    this.$toast(result.data.msg)
                })
                .catch((err) => {
                    this.$toast.clear();
                })
        },
        //修改昵称
        nickNameBlur() {
            //判断昵称是否为空
            if (!this.accountInfo.nickName) {
                this.$toast("昵称不能为空!")
            } else {
                //获取token
                let tokenString = localStorage.getItem("token");

                //判断token是否存在，如果存在，则进入页面，否则返回登录页
                if (!tokenString) {
                    this.$toast("请先登录")
                    return this.$router.push({ name: "Login" })
                }
                this.$toast.loading({
                    message: "加载中...",
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
                    url: "/updateNickName",
                    //请求参数,{}类型用Parmas，[]类型用data
                    data: {
                        appkey: this.appkey,
                        tokenString: tokenString,
                        nickName: this.accountInfo.nickName
                    },

                })
                    .then((result) => {
                        console.log(result);
                        //清除轻提示
                        this.$toast.clear();

                        if (result.data.code == 700) {
                            this.$router.push({ name: "Login" })
                        } else {
                            this.$toast(result.data.msg)
                        }
                    })
                    .catch((err) => {
                        this.$toast.clear()
                    })
            }
        },

        //修改简介
        descBlur() {
            //判断简介是否为空
            // if(!this.accountInfo.desc){
            //     this.$toast("简介不能为空!")
            // }
            //获取token
            let tokenString = localStorage.getItem("token");

            //判断token是否存在，如果存在，则进入页面，否则返回登录页
            if (!tokenString) {
                this.$toast("请先登录")
                return this.$router.push({ name: "Login" })
            }
            this.$toast.loading({
                // message: "加载中....",
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
                url: "/updateDesc",
                //请求参数,{}类型用Parmas，[]类型用data
                data: {
                    appkey: this.appkey,
                    tokenString: tokenString,
                    desc: this.accountInfo.desc
                },

            })
                .then((result) => {
                    // console.log(result);
                    //清除轻提示
                    this.$toast.clear();

                    if (result.data.code == 700) {
                        this.$router.push({ name: "Login" })
                    } else {
                        this.$toast(result.data.msg)
                    }
                })
                .catch((err) => {
                    this.$toast.clear()
                })

        },

        //获取个人资料
        getAccountInfo() {
            let tokenString = localStorage.getItem("token");
            this.$toast.loading({
                message: "加载中...",
                //点击穿透
                forbidClick: true,
                //延迟
                duration: 1,
            });
            //发起请求
            this.axios({
                //请求类型get or post
                method: 'GET',
                //请求路径
                url: "/findAccountInfo",
                //请求参数,{}类型用Parmas，[]类型用data
                params: {
                    appkey: this.appkey,
                    tokenString: tokenString,
                },
            })
                .then((result) => {
                    console.log(result);
                    if (result.data.code == 700) {
                        this.$router.push({ name: "Login" })
                    } else if (result.data.code == 'B001') {
                        this.accountInfo = result.data.result[0]
                    }
                    // this.$toast(result.data.msg)
                    // this.$toast.clear();
                })
                .catch((err) => {
                    this.$toast.clear();
                })
        },
    }
}
</script>
<style lang="less" scoped>
.account .text-area {
    color: #969799;
}

.van-cell-group {
    margin: -.8rem .26667rem 0;
    overflow: hidden;
    padding: .26667rem;

    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        background-color: #ffffff;
        position: relative;
        overflow: hidden;
        border-radius: 50%;
        margin-left: auto;


        .uploader-box {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0;

        }
    }


    .van-cell {
        max-height: 55px;
        padding: 0;
        padding-bottom: .26667rem;

    }

    :first-child {
        max-height: 100px;
        line-height: 40px;
    }

    .desc-title {
        font-size: 14px;
    }

}
</style>