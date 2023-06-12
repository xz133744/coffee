<template>
    <div class="address my-address">
        <van-nav-bar title="地址列表" left-text="返回" left-arrow fixed @click-left="back()" />
        <bgBox>
            <div v-if="list.length>0">
                <van-address-list :list="list" :switchable="false" default-tag-text="默认"  @add="add" @edit="edit" />
            </div>
            <div v-else>
                <van-empty class="custom-image" description="没有地址"  />
                <van-address-list  default-tag-text="默认"  @add="add" />
            </div>
        </bgBox>
       </div> 
</template>
    
    
<script>
import bgBox from "../components/bgBox.vue"
export default {
    name: "Address",
    data() {
        return {
            list: []
        }
    },
    created(){
        this.getAddressData()
    },
    methods: {
        back() {
            this.$router.go(-1)
        },
        getAddressData() {
            let tokenString = localStorage.getItem("token");
            this.$toast.loading({
                message: "正在获取地址信息...",
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
                url: "/findAddress",
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
                    if (result.data.code == 20000) {
                        result.data.result.map(v=>{
                            v.isDefault = Boolean(v.isDefault);
                            v.id = v.aid;
                            v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
                        })
                        this.list = result.data.result
                    } else if (result.data.code == 700) {
                        this.$router.push({name:"Login"})
                    }
                })
                .catch(err=>{
                    this.$toast.clear()
                })
        },
        //新增地址
        add(){
            this.$router.push({name:"NewAddress"})
        },
        //编辑地址
        edit(item){
            this.$router.push({name:"NewAddress",query:{aid:item.aid}})
        }
    },
    components: {
        bgBox,
    }
}
</script>