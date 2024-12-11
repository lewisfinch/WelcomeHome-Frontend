<template>
    <div>
      <el-button @click="fetchItemData">Fetch Item Data</el-button>
      <div v-if="itemData">
        <pre>{{ itemData }}</pre>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { ElMessage } from 'element-plus';
  
  const itemData = ref(null);
  
  const fetchItemData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      ElMessage.error('Please log in first!');
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:8080/items/find/1`, {
        headers: {
          'token': token, 
        },
        withCredentials: true,
      });
 
      itemData.value = response.data;
      ElMessage.success('Item data fetched successfully!');
    } catch (error) {
      ElMessage.error('Failed to fetch item data: ' + (error.response?.data || 'Unknown error'));
    }
  };
  </script>
  
  <style scoped>
  </style>
  