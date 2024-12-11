<template>
  <div>
    <h3>Start an Order</h3>
    <el-form>
      <el-form-item label="Client Username">
        <el-input v-model="clientUsername" placeholder="Enter client username"></el-input>
      </el-form-item>
      <el-button type="primary" @click="startOrder">Start Order</el-button>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { routerKey } from 'vue-router';

const clientUsername = ref('');

const startOrder = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    ElMessage.error('Please log in first!');
    return;
  }

  // Step 1: 检查是否是工作人员
  const isStaff = await checkIsStaff(token);
  if (!isStaff) {
    ElMessage.error('Only staff can start an order!');
    return;
  }

  // Step 2: 检查客户端用户名是否合法
  const isValidClient = await checkIsRegisteredUser(clientUsername.value, token);
  if (isValidClient>0) {
    ElMessage.error('Invalid client username!');
    return;
  }
  if(clientUsername.value==localStorage.getItem("userName")){
    ElMessage.error('You cannot start order for urself!');
    return;
  }
  // Step 3: 发送创建订单请求
  try {
  const response = await axios.get('http://localhost:8080/order/newOrder', {
    headers: { token },
    params:{
      client:clientUsername.value,
      supervisor:localStorage.getItem("userName"),
}
  });

  if (response && response.data) {
    ElMessage.success(`Order started successfully! Order ID: ${response.data.data}`);
    localStorage.setItem('client', clientUsername.value); 
    localStorage.setItem('orderId', response.data.data); 
  }
     
   
} catch (error) {
  ElMessage.error(`Failed to start order: ${error.response?.data || 'Unknown error'}`);
}
};

// 调用 isStaff API
const checkIsStaff = async (token) => {
  try {
    const username = localStorage.getItem('userName');
    const response = await axios.get('http://localhost:8080/donations/isStaff', {
      params: { userName: username },
    headers: { token },
    });
    return response.data.code;
  } catch (error) {
    ElMessage.error(`Failed to verify staff status: ${error.response?.data || 'Unknown error'}`);
    return false;
  }
};

const checkIsRegisteredUser = async (username, token) => {
  if (!username) {
    ElMessage.error('Please enter a client username!');
    return false;
  }

  try {
    const response = await axios.get(`http://localhost:8080/order/checkUserName`, {
      params: { userName: username },
      headers: { token },
    });
    return response.code;
  } catch (error) {
    ElMessage.error(`Failed to verify client username: ${error.response?.data || 'Unknown error'}`);
    return false;
  }
};
</script>
