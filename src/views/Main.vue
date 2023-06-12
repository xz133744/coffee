<template>
  <div class="main">
    <!-- 二级路由 -->
    <div>
      <router-view></router-view>
    </div>
    <!-- 底部导航栏 -->
    <van-tabbar active-color="#0c34ba" inactive-color="#646566" v-model="activeName" route>
      <van-tabbar-item replace :to="item.path" v-for="(item, index) in tabbarData" :key="index" :name="item.name">
        <span>{{ item.title }}</span>
        <!-- 插槽，给子组件提供占位符 -->
        <template #icon="props">
          <img :src="props.active ? item.activeImg : item.inactiveImg">
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
// import { url } from 'inspector';
import { ref } from 'vue';
// import { createApp } from 'vue';
export default {
  // setup() {
  //   const active = ref(0);
  //   return { active };
  // },
  name: "Main",

  data() {
    return {

      //激活标签名称
      activeName: 'Home',

      tabbarData: [
        {
          title: '首页',
          icon: 'wap-home-o',
          //标签名称、页面跳转路由名称
          name: 'home',
          path: '/main/home',

          //未选择和选择图标路径
          inactiveImg: require("../assets/images/home.png"),
          activeImg: require("../assets/images/home_active.png"),
        },
        {
          title: '菜单',
          icon: 'wap-home-o',
          //标签名称、页面跳转路由名称
          name: 'menu',
          path: '/main/menu',

          //未选择和选择图标路径
          inactiveImg: require("../assets/images/menu.png"),
          activeImg: require("../assets/images/menu_active.png"),
        },
        {
          title: '购物袋',
          icon: 'wap-home-o',
          //标签名称、页面跳转路由名称
          name: 'shopbag',
          path: '/main/shopbag',

          //未选择和选择图标路径
          inactiveImg: require("../assets/images/shopbag.png"),
          activeImg: require("../assets/images/shopbag_active.png"),
        },
        {
          title: '我的',
          icon: 'wap-home-o',
          //标签名称、页面跳转路由名称
          name: 'my',
          path: '/main/my',

          //未选择和选择图标路径
          inactiveImg: require("../assets/images/my.png"),
          activeImg: require("../assets/images/my_active.png"),
        }
      ]
    };
  },
  methods: {},
};
</script>
<style lang="less">

</style>
