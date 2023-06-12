<template>
    <div class="search">
        <van-nav-bar left-text="返回" left-arrow @click-left="back()" fixed>
            <template #right>
                <form action="/">
                    <van-search show-action placeholder="请输入搜索关键词" ref="search" @search="search()" shape="round"
                        v-model="name" />
                </form>
            </template>
        </van-nav-bar>
        <bgBox>
            <div class="Proitem-box">
                <div class="item" v-for="(item, index) in products" :key="index">
                    <ProItem :item="item" ></ProItem>
                </div>
            </div>
        </bgBox>
    </div>
</template>
<script>
import "../assets/less/Search.less"
import bgBox from "../components/bgBox.vue"
import ProItem from "../components/ProItem.vue"
export default {
    name: "Search",
    data() {
        return {
            products: [],
            name: "",
        }
    },
    components: {
        bgBox,
        ProItem,
    },
    created() {
        //在vue中操作dom，要使用$nextTick回调函数
        this.$nextTick(() => {
            //获取搜索框
            let searchIpt = this.$refs.search.querySelector('[type="search"]')
            //获取焦点
            searchIpt.focus();
        })
    },
    methods: {
        //根据浏览器历史记录返回
        back() {
            //-1返回上一页
            this.$router.go(-1)
        },
        search() {
            this.$toast.loading({
                message: "搜索中",
                forbidClick: true,
                duration: 0,
            });
            this.axios({
                method: "GET",
                url: "/search",
                params: {
                    appkey: this.appkey,
                    name: this.name,
                }
            })
                .then((result) => {
                    this.$toast.clear()
                    console.log(result);
                    if (result.data.code == "Q001") {
                        this.products = result.data.result;
                    } else {
                        this.$toast(result.data.msg)
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        
    }
}
</script>