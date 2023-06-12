<template>
    <div class="Like">
        <router-view/>
        <van-nav-bar title="我的收藏" left-text="返回" fixed placeholder left-arrow @click-left="back()" />
        <bgBox>
            <!-- div用于遍历数据 -->
            <div class="ProItem-box" v-if="likeProduct.length > 0">
                <div class="like-item"  @click=getDetails(item.pid) v-for="(item, index) in likeProduct" :key="index">
                    <ProItem :item="item" @remove="removeLike(item.pid,index)" :is-remove="true"></ProItem>
                </div>
            </div>
            <div v-else>
                <van-empty  description="暂时还没有收藏的商品哦~" />
            </div>
        </bgBox>
    </div>
</template>
<script>
import bgBox from "../components/bgBox.vue"
import ProItem from "../components/ProItem.vue"
export default {
    name: "Like",
    data() {
        return {
            likeProduct: []
        }
    },
    components: {
        bgBox,
        ProItem,
    },
    created() {
        this.getLikeProduct();
    },
    methods: {
        //获取收藏的商品
        getLikeProduct() {
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
                url: "/findAllLike",
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
                    if (result.data.code == 2000) {
                        this.likeProduct = result.data.result
                    } else if (result.data.code == 700) {
                        this.$router.push({name:"Login"})
                    }
                })
                .catch((err)=>{
                    this.$toast.clear();
                })
        },
        back() {
            this.$router.go(-1)
            // this.$router.push({name:'Like'})
        },
        //查看商品详情
        getDetails(pid) {
            //传pid,$router.push('path')跳转页面
            this.$router.push({ name: 'Detail', params: { pid, i: 1 } })
        },
        //删除收藏商品
        removeLike(pid,index) {
            let tokenString = localStorage.getItem("token");

            //判断token是否存在，如果存在，则进入页面，否则返回登录页
            if(!tokenString){
                this.$toast("请先登录")
                return this.$router.push({name:"Login"})
            }
            this.$toast.loading({
                message: "请稍后...",
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
                url: "/notlike",
                //请求参数,{}类型用Parmas，[]类型用data
                data: {
                    appkey: this.appkey,
                    pid,
                    tokenString: tokenString,
                },

            })
                .then((result) => {
                    console.log(result);
                    //清除轻提示
                    this.$toast.clear();
                    if (result.data.code == 700) {
                        this.$router.push({name:"Login"})
                    } else if (result.data.code == 900) {
                        this.$toast('删除成功！')
                        this.likeProduct.splice(index,1)
                    }else{
                        this.$toast("删除失败")
                    }
                })
                .catch(err=>{
                    this.$toast.clear()
                })
        }
    }
}
</script>
<style lang="less" scoped>
.ProItem-box {
    border-top-left-radius: .26667rem;
    border-top-right-radius: .26667rem;
    background-color: #ffffff;
    margin: -.8rem .26667rem 0;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;

    .like-item {
        // flex: 1;
        width: calc((100% - 50px)/2);
        background-color: #fff;
        // margin-bottom: .26667rem;
        // margin-right: .26667rem;
        padding: .26667rem;
        max-width: calc((100% - 50px)/2);
        min-width: calc((100% - 50px)/2);

        // &:nth-child(2n) {
        //     // margin-right: 0;
        // }

    }
}

.custom-image .van-empty__image {
    width: 90px;
    height: 90px;
}
</style>