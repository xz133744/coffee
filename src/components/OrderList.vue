<template>
    <div class="order-list white">
        <div class="pro-box clearfix">
            <div class="info-boxs a">
                <div class="info-title">{{ infoTitle }}</div>
                <div class="no fl">{{ no }}</div>
                <div class="info-title-no fl">{{ infoTitleLeft }}</div>
                <div class="reinfo fr" v-if="isRight">
                    <div v-if="!isReceive" @click="confirmReceive">确认收货</div>
                    <div v-else class="clearfix">
                        <div class="fl">已完成</div>
                        <div class="fl delete" @click="remove">
                            <van-icon name="delete" size="19" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="cell-list">
            <slot></slot>
        </div>
        <div class="bottom-into">
            <div class="circle">
                <div class="fl circle-box circle-left"></div>
                <div class="fr circle-box circle-right"></div>
            </div>
            <div class="date" v-if="date != ''">{{ date }}</div>
            <div class="clearfix">
                <div class="fl count">共计{{ count }}件商品</div>
                <div class="fr total">订单金额:￥{{ total }}</div>
            </div>
        </div>
    </div>
</template>

<script>
// import "../assets/less/cell.less"
export default {
    name: "OrderList",
    props: {
        no: {
            type: String,
            default: "订单编号:"
        },
        infoTitle: {
            type: String,
            default: "订单信息",
        },

        infoTitleLeft: {
            type: String,
            default: "左边标题"
        },
        isRight: {
            type: Boolean,
            default: false
        },
        date: {
            type: String,

        },
        count: {
            type: Number,
            default: 0,
        },
        total: {
            type: [Number, String],
            default: 0
        },
        isReceive: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        confirmReceive() {
            this.$emit('confirm-receive');
        },
        remove() {
            this.$emit('remove');
        }
    }
}
</script>
<style lang="less" scoped>
.cell-list {
    margin-bottom: 20px;
    
}

.bottom-into {
    font-size: .37333rem;
    align-items: center;
    padding: .53333rem 0 .26667rem;
    border-top: .02667rem dashed #e8e8e8;
    position: relative;

    .circle {
        .circle-left {
            position: absolute;
            top: -10px;
            left: -20px;
            width: .53333rem;
            height: .53333rem;
            background-color: #f5f5f5;
            border-radius: 50%;
        }

        .circle-right {
            position: absolute;
            top: -.26667rem;
            right: -20px;
            width: .53333rem;
            height: .53333rem;
            background-color: #f5f5f5;
            border-radius: 50%;
        }
    }

    .count {
        color: #666;
    }
    .total{
        color: #e4393c;
        font-weight: 700;
        margin-left: auto;
    }

}
</style>