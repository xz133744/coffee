<template>
    <div class="pay">
        <div class="navi">
            <van-nav-bar title="订单结算" left-text="返回" fixed placeholder left-arrow @click-left="back()" />
        </div>
        <div class="pay-box">
            <div class="select-address">
                <div>
                    <span @click="showSelectAddressList()">选择地址</span>
                    <van-icon name="arrow" />
                </div>
                <div class="user-box">
                    <div class="userinfo">
                        <div class="user-name">{{ currentAddress.name }}</div>
                        <div class="user-phone">{{ currentAddress.tel }}</div>
                        <div class="default-address" v-if="currentAddress.isDefault">
                        <span>默认</span>
                        </div>
                    </div>
                    <div class="detail-address">{{ currentAddress.address }}</div>
                </div>
            </div>
            <div class="order-info">
                <OrderList info-title-left="" no="" :count="productInfo.count" :total="productInfo.total">
                    <payProItem v-for="(item, index) in products" :key="index" :item="item"></payProItem>
                </OrderList>
            </div>
            <div class="btn-box" style="margin:15px">
                <van-button round color="#0c34ba" block type="primary" native-type="submit" @click="payBox()">
                    立即结算
                </van-button>
            </div>

            <div class="van">
                <van-popup  class="change-box" closeable position="bottom" v-model="isOpen">
                    <div class="change-title">选择地址</div>
                    <van-address-list  v-model="chosenAddressId" :list="list" default-tag-text="默认" @add="newAddress" @select="selectAddress" />
                </van-popup>
            </div>
        </div>
    </div>
</template>
<script>
import "../assets/less/Pay.less"
import bgBox from '../components/bgBox.vue'
import ProItem from '../components/ProItem.vue'
import payProItem from '../components/payProItem.vue'
import OrderList from '../components/OrderList.vue'
export default{
    name:"Pay",
    data(){
        return{
             // 控制弹窗的变量
             isOpen: false,
            // 地址列表
            list: [],
            // 选择当前地址的对象
            currentAddress: {},
            // 选择当前地址的aid
            chosenAddressId: "",
            sids: [],
            products: [],
            productInfo: {
                count: 0,
                total: 0
            }
        }
    },
    components: {
        ProItem,
        OrderList,
        payProItem,
    },
    created() {
        // 截取查询参数
        this.sids = this.$route.query.sids.split('-')
        this.getAddressData();
        this.getshopbagBySids();
    },
    methods: {
        pay(){
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
                url: "/pay",
                data: {
                    appkey: this.appkey,
                    tokenString,
                    sids:JSON.stringify(this.sids),
                    phone:this.currentAddress.tel,
                    address:this.currentAddress.address,
                    receiver:this.currentAddress.name
                }
            })
            .then((result)=>{
                console.log(result);
                this.$toast.clear();
                if(result.data.code==700){
                    this.$router.push({name:"Login"});
                }else if(result.data.code==60000){
                    this.$toast(result.data.msg);
                    setTimeout(()=>{
                        this.$router.push({name:"Order"})
                    })
                }
            })
        },
        payBox(){
            if(!this.chosenAddressId){
                this.$toast("请选择地址")
                return
            }
            this.$dialog.confirm({
                title:"请确认订单",
                message:"是否进行结算",
            })
            .then(()=>{
                this.pay();
            })
        },
        // 展示地址列表
        showSelectAddressList(){
            this.isOpen=true;
        },

        // 选择地址
        selectAddress(item,index){
            this.isOpen=false;
            this.currentAddress=item;
        },
        // 新增地址
        newAddress() {
            this.$router.push({ name: "NewAddress" })
        },
        // 获取地址的列表数据
        getAddressData() {
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
                url: "/findAddress",
                params: {
                    appkey: this.appkey,
                    tokenString,
                }
            })
                .then((result) => {
                    // console.log(result);
                    this.$toast.clear();
                    if (result.data.code == 700) {
                        this.$router.push({ name: "Login" });
                    } else if (result.data.code == 20000) {
                        result.data.result.map(v => {
                            v.isDefault = Boolean(v.isDefault);
                            v.id = v.aid;
                            v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`
                            // 选择默认地址
                            if (v.isDefault) {
                                this.currentAddress = v;
                                this.chosenAddressId = v.id;
                            }
                        });
                        this.list = result.data.result;
                    }
                })
        },
        // 根据sids获取购物袋的数据
        getshopbagBySids() {
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
                url: "/commitShopcart",
                params: {
                    appkey: this.appkey,
                    tokenString,
                    sids: JSON.stringify(this.sids)
                },
            })
                .then((result) => {
                    console.log(result);
                    this.$toast.clear();
                    if (result.data.code == 700) {
                        this.$router.push({ name: "Login" });
                    } else if (result.data.code == 50000) {
                        // 拿到数据有两种情况(有商品/没商品)
                        if (result.data.result.length == 0) {
                            return this.$router.push({ name: "Shopbag" });
                        }
                        result.data.result.map(v => {
                            this.productInfo.count += v.count;
                            this.productInfo.total += v.count * v.price;
                        })
                        this.products = result.data.result;
                    } else {
                        this.$toast(result.data.msg);
                    }
                })
                .catch((err) => {
                    this.$toast.clear();
                })
        },
        back() {
            this.$router.go(-1);
        },
    }
}
</script>