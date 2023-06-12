<template>
    <div class="shopbag">
        <van-nav-bar title="购物袋" left-text="返回" fixed placeholder left-arrow @click-left="shopbagback()"
            @click-right="isEdit = !isEdit">
            <template #right>
                <div v-if="ShopbagData.length > 0">{{ isEdit ? '完成' : '编辑' }}</div>
            </template>
        </van-nav-bar>
        <div class="shop-bg"></div>
        <div v-if="ShopbagData.length == 0">
            <van-empty description="购物袋里空空如也，快去逛逛吧！">
                <van-button round color="#0C34BA" @click="getMenu">去喝咖啡</van-button>
            </van-empty>
        </div>
        <div class="shopbag-box" v-else>

            <!-- 提交栏 -->
            <van-submit-bar v-if="!isEdit" :price="total" button-text="提交订单" @submit="commit">
                <van-checkbox v-model="isAllChecked" checked-color="#ee0a24" @click="allSelect()">全选</van-checkbox>
            </van-submit-bar>
            <!-- 编辑栏 -->
            <van-submit-bar v-else button-text="删除选择" @submit="removeSelected">
                <van-checkbox v-model="isAllChecked" checked-color="#ee0a24" @click="allSelect()">全选</van-checkbox>
            </van-submit-bar>
            <div class="shopbag-bg">
                <!-- 懒加载组件 -->

                <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多数据了" offset="20"
                    @load="loadData">
                    <!-- <van-cell v-for="item in allShopbagData" :key="item" :title="item" /> -->
                    <div class="shopbag-product">
                        <div class="shopbag-item" v-for="(item, index) in ShopbagData" :key="item.sid">
                            <div class="cell-item">
                                <van-swipe-cell :disabled="isEdit">
                                    <div class="cell-item-box ">
                                        <div class="chech-box ">
                                            <van-checkbox @change="simpleSelect" v-model="item.isChecked"
                                                checked-color="#ee0a24" />
                                        </div>
                                        <div class="pro-info-box ">
                                            <div class="pro-img ">
                                                <img class="auto_img" :src="item.small_img" alt="">
                                            </div>
                                            <div class=" pro-info">
                                                <div class="pro-info-text">
                                                    <div class=" names">
                                                        <div class="pro-name">{{ item.name }}</div>
                                                        <div class=" pro-rule one_text">{{ item.rule }}</div>
                                                    </div>
                                                    <div class="pro-enname one_text">{{ item.enname }}</div>
                                                    <div class="pro-count-box">
                                                        <div class=" pro-price">￥{{ item.price }}</div>
                                                        <div class=" step-box">
                                                            <van-stepper v-model="item.count" theme="round"
                                                                button-size="20" disable-input
                                                                @change="changeCount(item)" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <template #right>
                                        <van-button square type="danger" text="删除" class="delete-button"
                                            @click="removerOne(index, item.sid)" />
                                        <!-- <van-button square type="primary" text="收藏" /> -->
                                    </template>
                                </van-swipe-cell>
                            </div>
                        </div>
                    </div>
                </van-list>
            </div>
        </div>
    </div>

</template>    

<script>
import "../assets/less/Shopbag.less";
export default {
    name: "Shopbag",
    data() {
        return {
            //是否选中
            isCheck: false,

            //是否处于编辑状态
            isEdit: false,

            //购物袋商品数量
            count: 2,

            //是否全选
            isAllChecked: false,

            //是否懒加载
            loading: true,

            //是否全部完成加载数据
            finished: false,

            //所有购物袋数据
            allShopbagData: [],

            //购物袋数据
            ShopbagData: [],

            //下拉加载的数量
            dataCount: 8,

            //开始截取购物袋数据的位置
            startIndex: 0,

            //订单总金额
            total: 0,
        }
    },
    created() {
        this.getShopbagData()
        // this.isSelectProduct()
        // this.sum() 
    },
    methods: {
        //返回按钮
        shopbagback() {
            // this.$router.push('/main/menu')
            this.$router.back()
        },

        //提交订单
        onSubmit() {
            // this.$router.push({name:"Pay"})
        },

        //全选
        allSelect() {
            this.ShopbagData.map((v) => {
                v.isChecked = this.isAllChecked

            })
        },

        //单选
        simpleSelect() {
            this.sum()
            for (let i = 0; i < this.ShopbagData.length; i++) {
                if (this.ShopbagData[i].isChecked == false) {
                    //选择单选时，让全选失效
                    this.isAllChecked = false;
                    return;

                }

            }
            this.isAllChecked = true;
        },

        //单个删除
        removerOne(index, sid) {
            //sid:购物袋id
            //index:ShopbagData数组下标

            //获取token
            let tokenString = localStorage.getItem("token");

            //判断token是否存在，如果存在，则进入页面，否则返回登录页
            if (!tokenString) {
                this.$toast("请先登录")
                return this.$router.push({ name: "Login" })
            }
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
                method: 'POST',
                //请求路径
                url: "/deleteShopcart",
                //请求参数,{}类型用Parmas，[]类型用data
                data: {
                    appkey: this.appkey,
                    tokenString: tokenString,
                    sids: JSON.stringify([sid])
                },

            })
                .then((result) => {
                    // console.log(result);
                    //清除轻提示
                    this.$toast.clear();

                    if (result.data.code == 700) {
                        this.$router.push({ name: "Login" })
                    } else if (result.data.code == 7000) {
                        this.ShopbagData.splice(index, 1);
                        this.sum();
                    }
                    this.$toast(result.data.msg)
                })
                .catch((err) => {
                    this.$toast.clear()
                })
        },
        //获取购物袋数据
        getShopbagData() {
            //获取token
            let tokenString = localStorage.getItem("token");

            //判断token是否存在，如果存在，则进入页面，否则返回登录页
            if (!tokenString) {
                this.$toast("请先登录")
                return this.$router.push({ name: "Login" })
            }
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
                url: "/findAllShopcart",
                //请求参数,{}类型用Parmas，[]类型用data
                params: {
                    appkey: this.appkey,
                    tokenString: tokenString,
                },

            })
                .then((result) => {
                    console.log(result);
                    //清除轻提示
                    this.$toast.clear();

                    if (result.data.code == 700) {
                        this.$router.push({ name: "Login" })
                    } else if (result.data.code == 5000) {
                        result.data.result.map((v) => {
                            v.isChecked = false;
                        })
                        this.allShopbagData = result.data.result;

                        //截取数据
                        //根据开始截取位置和截取数量设置购物袋显示的数据
                        this.ShopbagData = this.allShopbagData.slice(
                            this.startIndex,
                            this.startIndex + this.dataCount,
                        );
                        this.startIndex += this.dataCount;

                        //未加载的数据
                        this.loading = false;
                    }
                })
                .catch((err) => {
                    this.$toast.clear()
                })
        },

        //计算订单总金额
        sum() {
            this.total = 0;
            this.ShopbagData.map((v) => {
                if (v.isChecked) {
                    this.total += v.price * v.count;
                }
            })
            this.total *= 100;
        },

        //判断是否勾选商品
        isSelectProduct(msg) {
            for (let i = 0; i < this.ShopbagData.length; i++) {
                if (this.ShopbagData[i].isChecked) {
                    return true;
                }
            }
            return false
        },

        //删除选择的商品
        removeSelected() {
            let isHas = this.isSelectProduct();
            if (!isHas) {
                this.$toast("请选择要删除的商品");
                return;
            }

            //sids:购物袋sid的集合
            let sids = [];
            this.ShopbagData.map((v) => {
                if (v.isChecked) {
                    sids.push(v.sid);
                }
            });
            //获取token
            let tokenString = localStorage.getItem("token");

            //判断token是否存在，如果存在，则进入页面，否则返回登录页
            if (!tokenString) {
                this.$toast("请先登录")
                return this.$router.push({ name: "Login" })
            }
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
                method: 'POST',
                //请求路径
                url: "/deleteShopcart",
                //请求参数,{}类型用Parmas，[]类型用data
                data: {
                    appkey: this.appkey,
                    tokenString: tokenString,
                    sids: JSON.stringify([sids])
                },

            })
                .then((result) => {
                    // console.log(result);
                    //清除轻提示
                    this.$toast.clear();

                    if (result.data.code == 700) {
                        this.$router.push({ name: "Login" })
                    } else if (result.data.code == 7000) {
                        //移除页面数据
                        for (let i = 0; i < this.ShopbagData.length; i++) {
                            if (this.ShopbagData[i].isChecked) {
                                this.ShopbagData.splice(i, 1);
                                i--;
                            }
                        }
                        this.sum();
                    }
                    this.$toast(result.data.msg)
                })
                .catch((err) => {
                    this.$toast.clear()
                })
        },

        //修改数量
        changeCount(item) {
            //获取token
            let tokenString = localStorage.getItem("token");

            //判断token是否存在，如果存在，则进入页面，否则返回登录页
            if (!tokenString) {
                this.$toast("请先登录")
                return this.$router.push({ name: "Login" })
            }
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
                method: 'POST',
                //请求路径
                url: "/modifyShopcartCount",
                //请求参数,{}类型用Parmas，[]类型用data
                data: {
                    appkey: this.appkey,
                    tokenString: tokenString,
                    sid: item.sid,
                    count: item.count
                },

            })
                .then((result) => {
                    // console.log(result);
                    //清除轻提示
                    this.$toast.clear();

                    if (result.data.code == 700) {
                        this.$router.push({ name: "Login" })
                    } else if (result.data.code == 6000) {
                        //调用选择
                        if (item.isChecked) {
                            //重新统计金额
                            this.sum()
                        }
                    }else{
                        this.$toast(result.data.msg)
                    }
                })
                .catch((err) => {
                    this.$toast.clear()
                })
        },

        //提交订单
        commit() {
            //是否选择
            let isHas = this.isSelectProduct();
            if (!isHas) {
                this.$toast("请选择商品");
                return;
            }

            //商品sid集合
            let sids = [];
            this.ShopbagData.map((v) => {
                if (v.isChecked) {
                    sids.push(v.sid);
                }
            })

            //调到支付界面并传入sids
            this.$router.push({ name: "Pay", query: { sids: sids.join('-') } })
        },

        //去喝咖啡
        getMenu() {
            this.$router.push({ name: "Menu" })
        },

        //懒加载的购物袋数据
        loadData() {

            setTimeout(() => {
                //截取allshopbagdata的数据
                let data = this.allShopbagData.slice(
                    this.startIndex,
                    this.startIndex + this.dataCount
                );

                this.startIndex += this.dataCount;

                this.ShopbagData.push(...data);

                this.isAllChecked = false;

                //如果当前截取数据不足8条，下次不再截取数据
                if (data.length < this.dataCount) {
                    //没有数据可以加载了，需要将finished修改为true,这样就不会再执行onload事件
                    this.finished = true;
                } else {
                    //每次触发onload事件的时候，都需要将loading修改为false
                    this.loading = false;
                }
            }, 1500)
        }
    }
}
</script>
<style lang="less" scoped>

</style>
