<template>

    <div class="detail">
        <div>
            <van-nav-bar title="商品详情" left-text="返回" fixed placeholder left-arrow @click-left="back()" />
        </div>

        <div>
            <div>
                <img :src="productDetail.large_img" class="auto_img" alt="">
            </div>
            <div class="pro-info-box">
                <div class="pro-info">
                    <div class=" pro-box">
                        <div class="">
                            <div class="pro-name one_text">{{ productDetail.name }}</div>
                            <div class="pro-enname one_text">{{ productDetail.enname }}</div>
                        </div>
                        <div class=" pro-price ">${{ productDetail.price }}</div>
                    </div>
                    <!-- 商品规格 -->
                    <div class="detail-rules">
                        <div class="detail-rules-item" v-for="(item, index) in productDetail.rules" :key="index">
                            <div class="rules-title">{{ item.title }}</div>
                            <div class="rules">
                                <div class="rules-item" :class="{ active: item.ruleIndex == i }"
                                    v-for="(v, i) in item.rule" :key="i" @click="toRule(item, i)">
                                    {{ v.title }}</div>
                                <!-- <div class="rules-item">热</div> -->
                            </div>
                        </div>
                    </div>
                    <div class="detail-count">
                        <div class="count-text">选择数量</div>
                        <div class="count-step">
                            <van-stepper theme="round" button-size="22" disable-input />
                        </div>
                    </div>
                    <div class="detail-desc">
                        <div class="desc-title">商品描述</div>
                        <div class="detail-desc-content">
                            <div class="desc-content-item" v-for="(item, index) in  productDetail.desc" :key="index">
                                {{ (index + 1 + '、' + item) }}
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        
            <van-goods-action>
                <van-goods-action-icon icon="bag-o" text="购物袋" :badge="bagCount" @click="goShopbag()"/>
                <van-goods-action-icon :icon="isLove ? 'like' : 'like-o'" :color="isLove ? '#ED1C24' : '#595C5A'"
                    :text="isLove ? '已收藏' : '收藏'" @click="isLike()" />
                <van-goods-action-button @click="addShopBag()" type="danger" text="加入购物车" />
                <van-goods-action-button @click="buy(isBuy)" type="danger" text="立即购买" />
            </van-goods-action>
        
    </div>
</template>
<script>
import "../assets/less/Detail.less";
// import { title } from 'process';
import { Toast } from 'vant';
export default {
    name: "Detail",
    created() {
        //获取首页的pid
        this.pid = this.$route.params.pid
        // console.log(this.pid);
        this.getDetail()
        //查询购物袋数量
        this.shopBagCount();
        //查询是否收藏商品
        this.findLike();
    },
    data() {
        return {
            //商品pid
            pid: "",
            //商品数量
            product: {
                count: 1
            },

            //购物袋数量
            bagCount: 0,
            //商品信息
            productDetail: {},
            //是否收藏商品
            isLove: false,
            //是否购买商品
            isBuy:false,
        }
    },

    methods: {
        buy(isBuy){
            this.addShopBag(isBuy);
        },
        //收藏商品
        isLike() {
            let tokenString = localStorage.getItem("token");
            if (!tokenString) {
                this.$router.push({ name: "Login" })
            }
            this.$toast.loading({
                message: "获取信息中",
                forbidClick: true,
                duration: 0,
            })
            let url = this.isLove ? "/notlike" : "/like";
            this.axios({
                method: "POST",
                url,
                data: {
                    appkey: this.appkey,
                    pid: this.pid,
                    tokenString
                }
            })
                .then((result) => {
                    console.log(result);
                    this.$toast.clear();
                    if (result.data.code == 700) {
                        this.$router.push({ name: "Login" });
                    } else if (result.data.code == 800) {
                        this.isLove = true;
                    } else if (result.data.code == 900) {
                        this.isLove = false;
                    }
                    this.$toast(result.data.msg);
                })
                .catch(err => {
                    this.$toast.clear();
                })
        },
        detailGetback(i) {
            if (i == 1) {
                this.$router.push('/main/home')
            }

        },
        //切换商品规格
        toRule(item, i) {
            if (item.ruleIndex == i) {
                return;
            }
            item.ruleIndex = i
        },
        getDetail() {
            this.$toast.loading({
                message: "加载中....",
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
                url: "/productDetail",
                //请求参数,{}类型用Parmas，[]类型用data
                params: {
                    appkey: this.appkey,
                    pid: this.pid,
                },
            })
                //.是axios方法
                .then((result) => {
                    // console.log(result);
                    //清除轻提示
                    this.$toast.clear();
                    //判断是否取得数据
                    if (result.data.code == 600) {
                        let data = result.data.result[0];
                        //切割描述内容
                        data.desc = data.desc.split(/\n/);
                        let rules = [];
                        let rulesData = ['tem', 'sugar', 'milk', 'cream'];
                        rulesData.map(v => {
                            let r = {};
                            r.title = data[v + '_desc']
                            //定义下标
                            r.ruleIndex = 0;
                            r.rule = [];
                            //获取规格的字符串
                            let ruleString = data[v].split('/');
                            ruleString.map(value => {
                                if (value != "") {
                                    r.rule.push({ title: value })
                                }
                            });
                            if (r.rule.length > 0) {
                                rules.push(r);
                            }
                        });
                        data.rules = rules;
                        this.productDetail = data;
                        // console.log(data);
                        // console.log(data.desc);
                        // 成功提示 
                        // Toast.success('露出鸡脚了小黑子')
                    } else {
                        //失败提示
                        // Toast.fail('鸡将法，不给')
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.$toast.clear();
                })
        },

        //查询是否收藏该商品
        findLike(){
            //获取token
            let tokenString = localStorage.getItem("token");

            //判断token是否存在，如果存在，则进入页面，否则返回登录页
            if (!tokenString) {
                this.$toast("请先登录")
                return this.$router.push({ name: "Login" })
            }

            this.$toast.loading({
                message: "正在获取信息...",
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
                url: "/findlike",
                //请求参数,{}类型用Parmas，[]类型用data
                params: {
                    appkey: this.appkey,
                    pid:this.pid,
                    tokenString: tokenString,    
                },

            })
                .then((result) => {
                    // console.log(result);
                    //清除轻提示
                    this.$toast.clear();

                    if (result.data.code == 700) {
                        this.$router.push({ name: "Login" })
                    } else if(result.data.code == 1000){
                        if(result.data.result.length > 0){
                            this.isLove = true;
                        }
                    }
                })
                .catch((err) => {
                    this.$toast.clear()
                })
        },

        //收藏商品
        toggeleLike(){
            let tokenString = localStorage.getItem("token");
            if (!tokenString) {
                this.$router.push({ name: "Login" })
            }
            this.$toast.loading({
                message: "获取信息中....",
                forbidClick: true,
                duration: 0,
            })
            let url = this.isLove ? "/notlike" : "/like";
            this.axios({
                method: "POST",
                url,
                data: {
                    appkey: this.appkey,
                    pid: this.pid,
                    tokenString
                }
            })
                .then((result) => {
                    // console.log(result);
                    this.$toast.clear();
                    if (result.data.code == 700) {
                        this.$router.push({ name: "Login" });
                    } else if (result.data.code == 800) {
                        this.isLove = true;
                    } else if (result.data.code == 900) {
                        this.isLove = false;
                    }
                    this.$toast(result.data.msg);
                })
                .catch(err => {
                    this.$toast.clear();
                })
        },

        //加入购物袋
        addShopBag(){
            //获取token
            let tokenString = localStorage.getItem("token");

            //判断token是否存在，如果存在，则进入页面，否则返回登录页
            if (!tokenString) {
                this.$toast("请先登录")
                return this.$router.push({ name: "Login" })
            }

            //请求的参数
            let data = {
                tokenString,
                appkey:this.appkey,
                pid:this.pid,
                count:this.product.count
            }

            let rs=[];
            //遍历ProductDetail.rules数组获取选择的商品规格
            this.productDetail.rules.map(v=>{
                rs.push(v.rule[v.ruleIndex].title);
            })
            data.rule = rs.join('/');

            this.$toast.loading({
                message: "加载中...",
                //点击穿透
                forbidClick: true,
                //延迟
                duration: 0,
            });
            //发起请求
            this.axios({
                //请求类型get or post
                method: 'POST',
                //请求路径
                url: "/addShopcart",
                //请求参数,{}类型用Parmas，[]类型用data
                data,

            })
                .then((result) => {
                    console.log(result);
                    //清除轻提示
                    this.$toast.clear();

                    if (result.data.code == 700) {
                        this.$router.push({ name: "Login" })
                    } else if(result.data.code == 3000){
                        //加入成功
                        if(!isBuy){
                            window.location.reload () 
                            //isBuy判断用户是否加入购物车
                            if(result.data.status == 0){
                                this.bagCount++;
                                this.$toast("加入购物袋成功")
                            }
                        }else{
                            //立即购买
                            this.$router.push({name:'Pay',query:{sids:result.data.sid}})
                        }
                    }
                    this.$toast(result.data.msg);
                })
                .catch((err) => {
                    this.$toast.clear()
                })
        },

        //查询购物袋数量
        shopBagCount(){
            //获取token
            let tokenString = localStorage.getItem("token");

            //判断token是否存在，如果存在，则进入页面，否则返回登录页
            if (!tokenString) {
                this.$toast("请先登录")
                return this.$router.push({ name: "Login" })
            }
            this.$toast.loading({
                message: "正在获取....",
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
                url: "/shopcartCount",
                //请求参数,{}类型用Parmas，[]类型用data
                params: {
                    appkey: this.appkey,
                    tokenString: tokenString,
                },

            })
                .then((result) => {
                    // console.log(result);
                    //清除轻提示
                    this.$toast.clear();

                    if (result.data.code == 700) {
                        this.$router.push({ name: "Login" })
                    } else if(result.data.code == 4000){
                        this.bagCount = result.data.result;
                    }
                })
                .catch((err) => {
                    this.$toast.clear()
                })
        },

        //前往购物袋
        goShopbag(){
            this.$router.push({name:"Shopbag"})
        },

        //根据浏览器历史记录返回
        back(){
            //-1返回上一页
            this.$router.go(-1)
        }
    }
}
</script>
<style lang="less" scoped>

</style>