<template>
    <div class="MyBg">
        <div class="My-nav">
            <van-nav-bar title="?" left-text="返回" left-arrow fixed />
        </div>
        <div class="My-bg">
            <!-- <img src="../assets/images/shopbag_bg.png"  alt=""> -->
        </div>
        <div class="My-content">

        </div>
    </div>
</template>
<script>
export default {
    name: "MyBg"
}
</script>
<style lang="less",scoped>
html{
    background-color: #f5f5f5;
}
.MyBg {
    background-color: #f5f5f5;
    .My-bg {
        margin-top: 50px;
        height: 100px;
        width: 100%;
        background: url("../assets/images/shopbag_bg.png")repeat-y;
        background-size:  134% 100px;
        // overflow: hidden;
    }

    .My-content {
        // height: 400px;
        // background-color: pink;
        z-index: 444;
        margin: -30px 10px 0;
        border-top-left-radius:10px;
        border-top-right-radius: 10px;
        // background-color: #fff;
        // overflow: hidden;
        padding: 10px;
        // background-image: linear-gradient(180deg, rgb(217 209 238 / 50%) 0, rgb(254 254 255 / 50%) 0.93333rem, #ffffff 0);
    }
}
</style>