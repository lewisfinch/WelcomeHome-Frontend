<template>
  <div>
    <h3>Popular Categories</h3>

    <!-- 日期范围选择 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="Start Date">
        <el-date-picker
          v-model="dateRange.startDate"
          type="date"
          placeholder="Select Start Date"
          format="YYYY-MM-DD"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="End Date">
        <el-date-picker
          v-model="dateRange.endDate"
          type="date"
          placeholder="Select End Date"
          format="YYYY-MM-DD"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchPopularCategories" :loading="loading">
          Fetch Popular Categories
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 分类结果展示 -->
    <div v-if="categories.length > 0" style="margin-top: 20px;">
      <el-table :data="categories" style="width: 100%">
        <el-table-column prop="mainCategory" label="Main Category" width="150"></el-table-column>
        <el-table-column prop="subCategory" label="Sub Category" width="150"></el-table-column>
        <el-table-column prop="orderCount" label="Order Count" width="150"></el-table-column>
      </el-table>
    </div>

    <!-- 如果没有分类 -->
    <div v-else-if="!loading" style="margin-top: 20px;">
      <el-alert title="No popular categories found for the selected date range." type="info" show-icon></el-alert>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

// 日期范围
const dateRange = ref({
  startDate: '',
  endDate: '',
});

// 热门分类结果
const categories = ref([]);

// 加载状态
const loading = ref(false);

// 日期格式化函数
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

// 获取热门分类的函数
const fetchPopularCategories = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    ElMessage.error('Please log in first!');
    return;
  }

  console.log('Fetch button clicked'); // 确认按钮点击
  try {
    // 验证日期范围
    if (!dateRange.value.startDate || !dateRange.value.endDate) {
      ElMessage.error('Please select both start date and end date.');
      return;
    }

    // 格式化日期
    const formattedStartDate = formatDate(dateRange.value.startDate);
    const formattedEndDate = formatDate(dateRange.value.endDate);

    // 防止缓存
    const response = await axios.get('http://localhost:8080/order/popularCategories', {
      params: {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        // _timestamp: new Date().getTime(), // 防止 GET 缓存
      },
    });

    if (response.data && response.data.data) {
      categories.value = response.data.data;
    } else {
      ElMessage.warning(response.data?.msg || 'No popular categories found.');
      categories.value = [];
    }
  } catch (error) {
    console.error('Error fetching popular categories:', error);
    ElMessage.error('Failed to fetch popular categories. Please try again later.');
  } finally {
    loading.value = false; // 重置 loading 状态
  }
};
</script>
