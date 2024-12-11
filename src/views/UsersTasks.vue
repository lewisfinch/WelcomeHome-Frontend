<template>
  <div>
    <h3>User's Orders</h3>
    
    <!-- 添加按钮触发订单请求 -->
    <el-button type="primary" @click="fetchUserOrders">Fetch User Orders</el-button>

    <!-- 如果有订单，展示表格 -->
    <div v-if="orders.length > 0" style="margin-top: 20px;">
      <el-table :data="orders" style="width: 100%">
        <el-table-column prop="orderID" label="Order ID" ></el-table-column>
        <el-table-column prop="orderDate" label="Order Date"></el-table-column>
        <el-table-column prop="itemID" label="Item ID" ></el-table-column>
        <el-table-column prop="idescription" label="Item Description" ></el-table-column>
        <el-table-column prop="client" label="Client" ></el-table-column>
        <el-table-column prop="supervisor" label="Supervisor"></el-table-column>
        <el-table-column prop="status" label="Status" ></el-table-column>
        <el-table-column prop="deliveredDate" label="Status Date" ></el-table-column>
        <el-table-column prop="deliveredBy" label="Delivered By" ></el-table-column>
        <el-table-column prop="donor" label="Donor" ></el-table-column>
        <el-table-column prop="donateDate" label="Donate Date" ></el-table-column>
      </el-table>
    </div>

    <!-- 如果没有订单，展示提示信息 -->
    <div v-else style="margin-top: 20px;">
      <el-alert title="No relevant orders found." type="info" show-icon></el-alert>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

// 响应式变量存储订单列表
const orders = ref([]);

// 获取用户相关订单的函数
const fetchUserOrders = async () => {
  try {
    const username = localStorage.getItem('userName'); // 从 LocalStorage 获取用户名
    if (!username) {
      ElMessage.error('Username not found. Please log in again.');
      return;
    }

    const token = localStorage.getItem('token'); // 从 LocalStorage 获取 token
    if (!token) {
      ElMessage.error('Token not found. Please log in again.');
      return;
    }

    const response = await axios.get('http://localhost:8080/order/userTasks', {
      params: { userName: username }, // 使用查询参数
      headers: { token }, // 如果需要身份验证
    });

    // 根据响应处理数据
    if (response.data.code>0) {
      ElMessage.success('Logged in User\'s tasks found successfully!');
      orders.value = response.data.data;
    } else {
      ElMessage.warning('No relevant orders found.');
    }
  } catch (error) {
    console.error('Error fetching user orders:', error);
    ElMessage.error('Failed to fetch user orders. Please try again later.');
  }
};
</script>
