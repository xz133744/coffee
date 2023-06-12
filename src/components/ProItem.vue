<template>
    <div class="Pro-items" @click="getDetail(item.pid)">
        <!-- <div class="Proitem"> -->
        <div>
            <img :src="item.smallImg" class="auto_img" alt="">
        </div>
        <div class="pro-name one_text">{{ item.name }}</div>
        <div class="pro-enname one_text">{{ item.enname }}</div>
        <div class="clearfix">
            <div class="fl pro-price">${{ item.price }}</div>
            <div class="fr count" v-if="!item.count">{{ item.count }}</div>
            <div class="fr count" v-else>x{{ item.count }}</div>
            <!-- .stop冒泡删除 -->
            <div class="fr delete" @click.stop="remove" v-if="isRemove">
                <van-icon name="delete-o" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProItem",
    //组件传值
    props: {
        //商品对象信息
        item: {
            type: Object,
            default() {
                return {};
            }
        },
        //是否显示删除按钮
        isRemove:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            // isRemove:true
        }
    },
    methods:{
        //查看商品详情
        // getDetail(pid) {
        //     //传pid,$router.push('path')跳转页面
        //     this.$router.push({ name: 'Detail', params: { pid, i: 1 } })
        // },

        //移除事件
        remove(){
            this.$emit('remove')
        }
    }
}
</script>
<style lang="less" scoped>
.Pro-items {
    
    .pro-name {
        margin-top: 10px;
        font-size: 16px;
    }

    .pro-enname {
        // margin-top: 5px;
        margin-bottom: 10px;
        font-size: 12px;
        color: #999;
    }

    .pro-price {
        font-size: 14px;
        color: #E7393C;
        font-weight: bold;
    }

    .delete {
        width: 16px;
        height: 16px;
        font-size: .53333rem;
        color: #999;
        margin-top: 3px;
    }

    }

</style>