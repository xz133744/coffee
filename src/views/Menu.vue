<template>
    <div>
        <div class="menu">
            <div class="menu-nav">
                <van-search placeholder="请输入搜索关键词" shape="round" @focus="searchFocus()" />
            </div>
            <div class="menu-box">
                <div class="menu-option clearfix ">
                    <van-sidebar v-model="active">
                        <van-sidebar-item v-for="(item, index) in menuOption" :key="index" :title="item.title"
                            @click="toMenu(index, item.type)" />
                    </van-sidebar>
                </div>

                <div class="menu-content clearfix">
                    <div class="menu-product clearfix">
                        <div class="m-pro-item clearfix" @click="getDetail(item.pid)"
                            v-for="(item, index) in productData" :key="index">
                            <div class="hot" v-show="item.isHot">热卖~</div>
                            <div class="pro-img">
                                <img :src="item.smallImg" class="auto_img" alt="">
                            </div>
                            <div class="text clearfix">
                                <div class="pro-name one_text">{{ item.name }}</div>
                                <div class="pro-enname">{{ item.enname }}</div>
                            </div>
                            <div class="price">${{ item.price }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>    

<script>
import { Notify } from 'vant';
import { Toast } from 'vant';
import { ref } from 'vue';
import "../assets/less/Menu.less";
export default {
    setup() {
        const active = ref(0);
        return { active };
    },
    name: "Menu",
    data() {
        return {
            menuIndex: 0,
            menuOption: [
                {
                    title: "热卖推荐",
                    // activeIcon: require("../assets/images/icons_03.gif"),
                    // inactiveIcon: require("../assets/images/icons_05.gif")
                },
                {
                    title: "拿铁",
                    // activeIcon: require("../assets/images/icons_03.gif"),
                    // inactiveIcon: require("../assets/images/icons_05.gif")
                },
                {
                    title: "咖啡",
                    // activeIcon: require("../assets/images/icons_03.gif"),
                    // inactiveIcon: require("../assets/images/icons_05.gif")
                },
                {
                    title: "瑞纳冰",
                    // activeIcon: require("../assets/images/icons_03.gif"),
                    // inactiveIcon: require("../assets/images/icons_05.gif")
                },
                {
                    title: "水果茶",
                    // activeIcon: require("../assets/images/icons_03.gif"),
                    // inactiveIcon: require("../assets/images/icons_05.gif")
                },
            ],
            productData: [],
        }
    },
    //调用函数
    created() {
        // this.getProductsByType("热卖推荐")
        //接收商品数据
        this.getOption();

    },
    methods: {
        //菜单切换选项
        toMenu(index, type) {
            if (this.menuIndex == index) {
                return;
            }
            this.menuIndex = index;
            this.getProductsByType(type);
        },
        //读取菜单
        getOption() {
            Notify({
                type: 'primary',
                message: '热卖商品卖十送一',
                color: '#ffffff',
                background: '#e4393c',
            }, 1500);
            this.$toast.loading({
                message: "正在开团....",
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
                url: "/type",
                //请求参数,{}类型用Parmas，[]类型用data
                params: {
                    appkey: this.appkey,
                },
            })
                //.是axios方法
                .then((result) => {
                    // console.log(result);
                    // 清除轻提示
                    this.$toast.clear();
                    // 判断是否取得数据
                    if (result.data.code == 400) {
                        let data = result.data.result;
                        //给获取的数据加内容
                        data.unshift({
                            id: "5",
                            type: "isHot",
                            typeDesc: "热卖推荐",
                            createdAt: '2021-01-24T09:57:57.000Z',
                            updatedAt: '2021-01-24T09:57:57.000Z'
                        });
                        //map()方法对数组进行排序，返回一个新数组
                        this.menuOption.map(v => {
                            for (let i = 0; i < data.length; i++) {
                                //匹配title和typeDesc
                                if (v.title == data[i].typeDesc) {
                                    v.type = data[i].type;
                                    break;
                                }
                            }
                        });
                        let type = this.menuOption[this.menuIndex].type;
                        //调用获取商品类型的方法

                        this.getProductsByType(type);
                    }
                    if (result.data.code == 400) {
                        this.leftNav = result.data.result;
                        // 成功提示
                        // Toast.success('苏制666')
                    } else {
                        //失败提示
                        // Toast.fail('你有没有苏枝啊')
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.$toast.clear();
                })
        },
        //根据类型获取商品
        getProductsByType(type) {
            let params = {
                appkey: this.appkey
            };
            if (type == "isHot") {
                params.key = "isHot";
                params.value = 1;
            } else {
                params.key = "type";
                params.value = type;
            };
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
                url: "/typeProducts",
                //请求参数,{}类型用Parmas，[]类型用data
                params,
            })
                .then((result) => {
                    // 清除轻提示
                    this.$toast.clear();
                    console.log(result);
                    if (result.data.code == 500) {
                        this.productData = result.data.result
                        // 成功提示
                        // Toast.success('苏制666')
                    }
                })
        },
        //查看商品详情
        getDetail(pid) {
            //传pid,$router.push('path')跳转页面
            this.$router.push({ name: 'Detail', params: { pid, i: 1 } })
        },
        searchFocus() {
            this.$router.push({ name: 'Search' })
        },
    }
}

</script>

<style lang="less" scoped>

</style>

