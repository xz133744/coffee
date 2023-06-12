<template>
    <div class="pro-item">
        <div class="items">
            <div class="item-img">
                <img :src="item.small_img" class="auto_img " alt="">
            </div>
            <div class="item-content">
                <div class="item-name">
                    <div class="zhname-box">
                        <div class="zhname one_text">{{ item.name }}</div>
                        <div class="rule one_text">{{ item.rule }}</div>
                    </div>
                    <div class="enname one_text">{{ item.enname }}</div>
                </div>
                <div class="price-count">
                    <div class="price">{{ item.price }}</div>
                    <div class="count">×{{ item.count }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "payProItem",

    // 组件传值
    props: {
        item: {
            type: Object,
            default() {
                return {};
            }
        }
    }
}
</script>

<style lang="less" scoped>
.pro-item {
    margin-bottom: 10px;
    min-width: 335px;

    .items {
        display: flex;
        align-items: center;

        .item-img {
            width: 80px;
            height: 80px;
            background-color: #ddd;
            margin-right: 10px;
        }

        .item-content {
            width: calc(100% - 2.93333rem);
            height: 80px;

            .item-name {
                height: 40px;
                font-weight: 400;

                .zhname-box {
                    display: flex;

                    .zhname {
                        font-size: 14px;
                    }

                    .rule {
                        margin-left: 20px;
                        color: #666;
                    }
                }

                .enname {
                    font-size: 12px;
                    color: #999;
                    margin-top: 3px;
                }
            }

            .price-count {
                height: 40px;
                display: flex;
                align-items: center;

                .price {
                    font-size: 14px;
                    font-weight: 700;
                    color: #e4393c;
                    margin-right: auto;
                }
            }
        }
    }
}
</style>