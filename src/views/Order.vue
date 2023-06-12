<template>
    <div class="order">
        <van-nav-bar title="我的订单" left-text="返回" fixed placeholder left-arrow @click-left="back()" />
        <bgBox>
            <!-- <div>
                <van-tabs v-model="taIndex"
                title-active-color="#0C34BA"
                color="#0C34BA"
                line-height="2"
                @change="changeTab"
                >
                    <van-tab v-for="(item,index) in tabData" :key="index"
                     :title="item.title">
                        <div>
                            <div class="order-box"></div>
                        </div>
                    </van-tab>
                </van-tabs>
            </div> -->
        </bgBox>
        <div class="bg-content" v-if="isHas">
            <van-tabs v-model="tabIndex" color="#0c34ba" line-height="2" @change="changeTab">
                <van-tab  v-for="(item, index) in tabData" :key="index" :title="item.title">
                    <div  v-if="orderData.length > 0">
                        <div class="order-box " v-for="(v, k) in orderData" :key="v.oid">
                            <OrderList  info-title="订单信息"  :info-title-left="v.oid" :date="v.date" :count="v.count" :total="v.total"
                                :is-right="true" @confirm-receive="confirmReceive(v, k)"
                                @remove="removeOrder(v.oid, k)" :is-receive="v.status == 2">
                                <ProItem  v-for="(value, idx) in v.data" :key="idx" :item="value">
                                </ProItem>
                            </OrderList>
                        </div>
                    </div>
                    <div v-else>
                        <van-empty description="没有订单数据" />
                    </div>
                </van-tab>
            </van-tabs>
        </div>
        <div v-else>
            <van-empty description="没有订单数据" />
        </div>
    </div>
</template>
<script>
import "../assets/less/Order.less"
import bgBox from "../components/bgBox.vue"
import ProItem from "../components/ProItem.vue"
import OrderList from "../components/OrderList.vue"
export default {
    name: "Order",
    data() {
        return {
            tabIndex: 0,
            tabData: [{ title: "全部" }, { title: "进行中" }, { title: "已完成" }],
            orderData: [],
            isHas: true
        }
    },
    methods:{
        back(){
            this.$router.go(-1)
        },
        // 切换订单的状态 0全部 1进行中 2已完成
        changeTab(name, title) {
            this.getOrderDataByStatus();
        },
        getOrderDataByStatus() {
            let tokenString = localStorage.getItem("token")
            // console.log(tokenString)
            if (!tokenString) {
                this.$toast("请先登录");
                return this.$router.push({ name: "Login" })
            }
            this.$toast.loading({
                message: "加载中",
                forbidClick: true,
                duration: 0,
            })
            this.axios({
                method: "GET",
                url: "/findOrder",
                params: {
                    appkey: this.appkey,
                    tokenString,
                    status: this.tabIndex,
                }
            })
                .then((result) => {
                    this.$toast.clear();
                    console.log(result);
                    if (result.data.code == 700) {
                        this.$router.push({ name: "Login" });
                    } else if (result.data.code == 70000) {
                        if (this.tabIndex == 0 && result.data.result.length == 0) {
                            this.isHas = false;
                            return;
                        }
                        let orderDatas = [];
                        result.data.result.map((v) => {
                            for (let i = 0; i < orderDatas.length; i++) {
                                if (orderDatas[i].oid == v.oid) {
                                    orderDatas[i].data.push(v);
                                    orderDatas[i].count += v.count;
                                    orderDatas[i].total += v.count * v.price;
                                    return;
                                }
                            }
                            let o = {};
                            o.oid = v.oid;
                            o.count = v.count;
                            o.total = v.count * v.price;
                            o.status = v.status;
                            o.date = v.createdAt;
                            o.data = [v];
                            orderDatas.push(o);
                        });
                        this.orderData = orderDatas;
                    }
                })
                .catch((err) => {
                    this.$toast.clear()
                })
        },
        confirmReceive(item, index) {
            let tokenString = localStorage.getItem("token")
            // console.log(tokenString)
            if (!tokenString) {
                this.$toast("请先登录");
                return this.$router.push({ name: "Login" })
            }
            this.$toast.loading({
                message: "加载中",
                forbidClick: true,
                duration: 0,

            })
            this.axios({
                method: "POST",
                url: "/receive",
                data: {
                    appkey: this.appkey,
                    oid: item.oid,
                    tokenString
                }
            })
                .then((result) => {
                    console.log(result);
                    this.$toast.clear();
                    if (result.code.data == 700) {
                        this.$router.push({ name: "Login" })
                    } else if (result.code.data == 80000) {
                        if (this.tabIndex == 1) {
                            this.orderData.splice(index, 1);
                        }
                        item.status = 2;
                    }
                    this.$toast(result.data.msg);
                    
                })
                .catch((err) => {
                    this.$toast.clear();
                })
        },
        removeOrder(oid, index) {
            let tokenString = localStorage.getItem("token")
            // console.log(tokenString)
            if (!tokenString) {
                this.$toast("请先登录");
                return this.$router.push({ name: "Login" })
            }
            this.$toast.loading({
                message: "加载中",
                forbidClick: true,
                duration: 0,
            })
            this.axios({
                method: "POST",
                url: "/removeOrder",
                data: {
                    appkey: this.appkey,
                    oid: oid,
                    tokenString
                }
            })
            .then((result)=>{
                console.log(result);
                this.$toast.clear();
                if(result.data.code==700){
                    this.$router.push({ name: "Login" })
                }else if(result.data.code==90000){
                    this.orderData.splice(index,1);
                }
                this.$toast(result.data.msg)
            })
            .catch((err)=>{
                this.$toast.clear();
            })
        },
    },
    components: {
        bgBox,
        ProItem,
        OrderList,
    },
    created() {
        this.getOrderDataByStatus();
    },
}
</script>