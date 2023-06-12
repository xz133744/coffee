<template>
    <div class="newAddress">
        <van-nav-bar :title="aid ? '编辑地址' : '新增地址'" left-text="返回" left-arrow @click-left="back()" />
        <van-address-edit :area-list="areaList" show-postal :show-delete="!!aid" show-set-default
            :area-columns-placeholder="['选择省', '选择市', '选择区']" @save="save" @delete="removeAddress"
            :address-info="addressInfo" save-button-text="保存地址" />
    </div>
</template>
<script>
import areaList from "../assets/js/area"
export default {
    name: "NewAddress",
    data() {
        return {
            areaList,
            //地址初始值
            addressInfo: {},
            //地址aid
            aid: "",
        }
    },
    created() {
        //截取aid
        this.aid = this.$route.query.aid;
        //根据aid查询地址的数据
        if (this.aid) {
            this.getAddressDataByAid();
        };


    },
    methods: {
        //保存地址
        save(content) {
            //获取token
            let tokenString = localStorage.getItem("token");

            //判断token是否存在，如果存在，则进入页面，否则返回登录页
            if (!tokenString) {
                this.$toast("请先登录")
                return this.$router.push({ name: "Login" })
            }
            //复制地址content
            let addressInfo = Object.assign({

            }, content)

            delete addressInfo.country;
            addressInfo.tokenString = tokenString;
            addressInfo.appkey = this.appkey;
            addressInfo.isDefault = Number(addressInfo.isDefault);

            this.$toast.loading({
                message: "正在获取地址...",
                //点击穿透
                forbidClick: true,
                //延迟
                duration: 1,
            });

            //请求数据
            //如果有aid------编辑地址
            //如果没有aid------新增地址
            if (!this.aid) {
                //新增
                this.address(addressInfo, "/addAddress")
            } else {
                //编辑
                this.address(addressInfo, "/editAddress")
                //验证用户是否修改过原地址数据
                let isModify = false;
                for (let key in this.addressInfo) {
                    if (content[key] != this.addressInfo[key]) {
                        isModify = true;
                    }
                }
                if (isModify) {
                    //编辑地址
                    this.address(addressInfo, "/editAddress");
                } else {
                    return this.$toast("请填写地址信息");
                }
            }
        },

        //发起新增地址的请求
        address(addressInfo,url){
            this.axios({
                method:"POST",
                url,
                data:addressInfo
            })
            .then((result)=>{
                console.log(result);
                this.$toast.clear();

                if(result.data.code ==700){
                    this.$router.push({name:"Login"});
                }else if (result.data.code ==9000 || result.data.code == 30000){
                    setTimeout(()=>{
                        this.$router.push({name:"Address"});
                    },500);
                }
                this.$toast(result.data.msg)
            })
            .catch((err)=>{
                this.$toast.clear()
            })
        },

        //根据地址aid查询地址
        getAddressDataByAid() {
            //获取token
            let tokenString = localStorage.getItem("token");

            //判断token是否存在，如果存在，则进入页面，否则返回登录页
            if (!tokenString) {
                this.$toast("请先登录")
                return this.$router.push({ name: "Login" })
            }
            this.$toast.loading({
                message: "正在获取地址...",
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
                url: "/findAddressByAid",
                //请求参数,{}类型用Parmas，[]类型用data
                params: {
                    appkey: this.appkey,
                    tokenString: tokenString,
                    aid: this.aid,
                },

            })
                .then((result) => {
                    console.log(result);
                    //清除轻提示
                    this.$toast.clear();
                    if (result.data.code == 40000) {
                        let data = result.data.result[0];
                        data.isDefault = Boolean(data.isDefault);
                        this.addressInfo = data;
                    } else if (result.data.code == 700) {
                        this.$router.push({ name: "Login" })
                    }
                })
                .catch(err => {
                    this.$toast.clear()
                })
        },

        //删除地址
        removeAddress() { 
            //获取token
            let tokenString = localStorage.getItem("token");

            //判断token是否存在，如果存在，则进入页面，否则返回登录页
            if (!tokenString) {
                this.$toast("请先登录")
                return this.$router.push({ name: "Login" })
            }
            this.$toast.loading({
                message: "正在获取地址...",
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
                url: "/deleteAddress",
                //请求参数,{}类型用Parmas，[]类型用data
                data: {
                    appkey: this.appkey,
                    tokenString: tokenString,
                    aid: this.aid,
                },

            })
                .then((result) => {
                    console.log(result);
                    //清除轻提示
                    this.$toast.clear();
                    if (result.data.code == 10000) {
                        setTimeout(()=>{
                            this.$router.push({name:"Address"})
                        },500)
                        this.$toast(result.data.msg)
                    } else if (result.data.code == 700) {
                        this.$router.push({ name: "Login" })
                    }
                })
                .catch((err)=>{
                    this.$toast.clear()
                })
                .catch(err => {
                    this.$toast.clear()
                })
        },
        back() {
            this.$router.go(-1);
        }
    }
}
</script>