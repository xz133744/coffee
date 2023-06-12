<template>
    <div class="Track">
        <van-nav-bar title="我的足迹" left-text="返回" left-arrow @click-left="back()" />
        <van-empty image="network" description="网络错误！" />
    </div>
</template>
<script>
import { Notify } from 'vant';
export default {
    name: "Track",
    data() {
        return {

        }
    },
    created() {
        this.loading()
    },
    methods: {
        back() {
            this.$router.go(-1)
        },
        loading(){
            Notify({
        type: 'primary',
        message: '服务暂不可用',
        color: '#ffffff',
        background: '#e4393c',
      },20000);
        }
    },
}
</script>
<style lang="less" scoped>
.Track{
    height: 667px;
}
html,
body ,Track{
    background-color: #ffffff;
}

.van-empty {
    margin-top: 150px;
}
</style>