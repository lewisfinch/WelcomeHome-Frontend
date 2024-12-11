<template>
  <el-container style="height: 100vh;">
    <!-- 侧边导航栏 -->
    <el-aside width="220px" style="background: #2c3e50; color: #ecf0f1;">
      <el-menu
        :default-active="activeMenu"
        background-color="#2c3e50"
        text-color="#ecf0f1"
        active-text-color="#ffd04b"
        @select="navigate"
        style="height: 100%; border-right: none;"
      >
      <el-menu-item index="/dashboard/popularCategories">Popular Categories</el-menu-item>
      <el-menu-item index="/dashboard/usersTasks">User's Tasks</el-menu-item>
      <el-menu-item index="/dashboard/startAnOrder">Start An Order</el-menu-item>
      <el-menu-item index="/dashboard/shopping">Shopping</el-menu-item>
        <el-menu-item index="/dashboard/findSingleItem">Find Single Item</el-menu-item>
        <el-menu-item index="/dashboard/findOrderItems">Find Order Items</el-menu-item>
        <el-menu-item index="/dashboard/acceptDonation">Accept Donation</el-menu-item>
        <el-menu-item index="logout" @click="logout">Logout</el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主体内容 -->
    <el-main style="padding: 20px; background-color: #ecf0f1;">
      <div class="content-container">
        <router-view /> <!-- 子路由页面显示区域 -->
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const activeMenu = ref(router.currentRoute.value.path);

const navigate = (path) => {
  router.push(path);
};

const logout = () => {
  localStorage.removeItem('token'); // 清除 token
  router.push('/'); // 返回登录页面
};
</script>

<style scoped>
.el-aside {
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

.el-main {
  display: flex;
  flex: 1;
}


.content-container {
  margin: 0 auto;
  background: #ffffff;
  padding: 20px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  min-height: calc(100vh - 40px);
}


body {
  margin: 0;
  font-family: 'Arial', sans-serif;
  background-color: #ecf0f1; /* 浅灰背景 */
}
</style>
