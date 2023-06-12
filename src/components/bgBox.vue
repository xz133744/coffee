<template>
    <div class="bg-box">
        <div class="bg">
            
        </div>
        <div class="bg-content">

        </div>
        <slot>

        </slot>
    </div>
</template>
<script>
export default {
    name: "bgBox"
}
</script>
<style lang="less" scoped>
.bg-box {
    background-color: #f5f5f5;

    .bg {
        // margin-top: 40px;
        height: 150px;
        background-color: #c94d4d;

        .history_box {
            padding: 15px;

            .history_item{
                display: inline-block;
                padding: 5px;
                background-color: #e8e8e8;
            }
            
        }
    }

    .bg-content {

        margin: 0 10px;
        position: relative;
        top: -25px;
        // background-color: #f5f5f5;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        overflow: hidden;
    }
}
</style>