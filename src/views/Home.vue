<template>
  <div class="home">
    <!-- <myNav></myNav> -->
    <van-nav-bar class="van-nav-bar--fixed">
      <!-- #left作用类似浮动 -->
      <template #left>
        <div class="home-nav">
          <div class="text1">{{ greetings }} </div>
          <div class="text2">
            {{ userMsg.nickName }}
          </div>
        </div>
      </template>
      <template #right>
        <div class="home-search">
          <van-search placeholder="请输入搜索关键词" shape="round" @focus="searchFocus()" class="" />
        </div>
      </template>
    </van-nav-bar>
    <div class="home-content">
      <div class="banner-box">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(item, index) in bannerData" :key="index">
            <img class="auto_img" :src="item.bannerImg" alt="">
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="shop">
        <van-grid :column-num="2" :border="false" gutter="10px" style="padding-left:0">
          <van-grid-item v-for="(item, index) in Fial" :key="index" :icon="item.smallIMG">
            <div class="pro-item" @click="getDetail(item.pid)">
              <div class="hot">热卖~</div>
              <div class="pro-imgbox">
                <img :src="item.smallImg" class="auto_img" alt="">
              </div>
              <div class="pro-info">
                <div class="pro-name ">{{ item.name }}</div>
                <div class="pro-engelishname">{{ item.enname }}</div>
                <div class="pro-price">${{ item.price }}</div>
              </div>
            </div>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
  </div>
</template>
<script>
import { Notify } from 'vant';
import { Toast } from 'vant';
import "../assets/less/Home.less";
//轻提示方法
// import { showSuccessToast, showFailToast } from 'vant';

// 默认导出组件
export default {
  // 组件名称
  name: "Home",
  data() {
    return {
      //接收轮播图数据
      bannerData: [],
      //接受时间数据
      greetings: '',
      //热买推荐
      Fial: [],
      // yourToken: this.$route.params.yourToken,
      userMsg: [],
    };
  },
  //调用函数
  created() {
    this.getBannerData();
    this.getdate();
    this.getFail();
    this.getToken();
  },
  methods: {

    //获取时间
    getdate() {
      Notify({
        type: 'primary',
        message: '瑞幸贺新春，焦糖拿铁线下门店免费品尝',
        color: '#ffffff',
        background: '#e4393c',
      },2000);
      const hour = new Date().getHours();
      if (hour <= 6) {
        this.greetings = '凌晨好';
      } else if (hour > 6 && hour <= 11) {
        this.greetings = '早上好';
      } else if (hour > 11 && hour <= 13) {
        this.greetings = '中午好';
      } else {
        this.greetings = '晚上好';
      }
    },
    //获取轮播图数据
    getBannerData() {
      this.$toast.loading({
        message: "正在加载....",
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
        url: "/banner",
        //请求参数,{}类型用Parmas，[]类型用data
        params: {
          appkey: this.appkey,
        },
      })
        //.是axios方法
        .then((result) => {

          //清除轻提示
          this.$toast.clear();
          //判断是否取得数据
          if (result.data.code == 300) {
            this.bannerData = result.data.result;
            // 成功提示
            // Toast.success('露出鸡脚了小黑子')
          } else {
            //失败提示
            // Toast.fail('鸡将法，不给')
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.clear();
        })
    },
    //查看商品详情
    getDetail(pid) {
      //传pid,$router.push('path')跳转页面
      this.$router.push({ name: 'Detail', params: { pid, i: 1 } })
    },

    //获取商品列表（热卖推荐）
    getFail() {
      this.$toast.loading({
        message: "加载中....",
        //点击穿透
        forbidClick: true,
        //延迟
        duration: 0,
      });
      //发起请求
      this.axios({
        //请求类型get or post
        method: 'GET',
        //请求路径
        url: "/typeProducts",
        //请求参数,{}类型用Parmas，[]类型用data
        params: {
          appkey: this.appkey,
          key: 'isHot',
          value: 1
        },
      })
        .then((result) => {
          // console.log(result);
          //清除轻提示
          this.$toast.clear();
          //判断是否取得数据
          if (result.data.code == 500) {
            this.Fial = result.data.result;
            // 成功提示
            // Toast.success('露出鸡脚了小黑子')
          } else {
            //失败提示
            // Toast.fail('鸡将法，不给')
          }
        }
        )
    },
    searchFocus() {
      this.$router.push({ name: 'Search' })
    },
    //获取token
    getToken() {
      let tokenString = localStorage.getItem("token");

      console.log(tokenString);
      if (tokenString) {
        this.$toast.loading({
          message: "加载中....",
          //点击穿透
          forbidClick: true,
          //延迟
          duration: 0,
        });
        //发起请求
        this.axios({
          //请求类型get or post
          method: 'GET',
          //请求路径
          url: "/findMy",
          //请求参数,{}类型用Parmas，[]类型用data
          params: {
            appkey: this.appkey,
            tokenString,
          },
        })
          .then((result) => {
            console.log(result);
            //清除轻提示
            this.$toast.clear();
            // 判断是否取得数据
            if (result.data.code == 'A001') {
              this.userMsg = result.data.result[0];
              // 成功提示
              // Toast.success('yes')
            } else {
              //失败提示
              // Toast.fail('no')
            }
          })
      } else {
        this.$toast("请先登录！")
        return this.$router.push({ name: 'Login' })
      }

    }

  },
  components: {

  }
};
</script>

