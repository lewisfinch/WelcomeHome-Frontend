<template>
  <div>
    <h3>Shopping - Add to Current Order</h3>

    <!-- 类别选择 -->
    <el-form :inline="true" class="category-form">
      <el-form-item label="Select Category">
        <el-select v-model="selectedCategory" placeholder="Select Category" @change="fetchItems">
          <el-option
            v-for="category in categories"
            :key="category.mainCategory + '-' + category.subCategory"
            :label="`${category.mainCategory} - ${category.subCategory}`"
            :value="category"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 物品列表 -->
    <div v-if="items.length > 0" style="margin-top: 20px;">
      <el-table :data="items" style="width: 100%">
        <el-table-column prop="idescription" label="Description" width="230"  />
        <el-table-column prop="material" label="Material" />
        <el-table-column prop="color" label="Color" />
        <el-table-column prop="new" label="Is New" />
        <el-table-column label="Actions" width="150">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="addToOrder(scope.row)"
            >
              Add to Order
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 如果没有物品 -->
    <div v-else-if="selectedCategory" style="margin-top: 20px;">
      <el-alert
        title="No items available for the selected category."
        type="info"
        show-icon
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

// 响应式变量
const categories = ref([]); // 存储类别
const items = ref([]); // 存储物品
const selectedCategory = ref(null); // 当前选择的类别
const currentOrderId = localStorage.getItem('orderId'); // 当前订单 ID

// 获取所有类别
const fetchCategories = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    ElMessage.error('Please log in first!');
    return;
  }

  try {
    const response = await axios.get('http://localhost:8080/order/getExistingCategory');
    if (response.data && response.data.data) {
      categories.value = response.data.data;
    } else {
      ElMessage.warning('No categories found.');
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    ElMessage.error('Failed to fetch categories. Please try again later.');
  }
};

// 获取选定类别的物品
const fetchItems = async () => {
  if (!selectedCategory.value) return;

  try {
    const response = await axios.get('http://localhost:8080/order/getCategory', {
      params: {
        mainCategory: selectedCategory.value.mainCategory,
        subCategory: selectedCategory.value.subCategory,
      },
    });
    if (response.data && response.data.data) {
      items.value = response.data.data;
    } else {
      items.value = [];
      ElMessage.info('No items available for the selected category.');
    }
  } catch (error) {
    console.error('Error fetching items:', error);
    ElMessage.error('Failed to fetch items. Please try again later.');
  }
};

// 添加物品到订单
const addToOrder = async (item) => {
  if (!currentOrderId) {
    ElMessage.error('No active order found. Please start an order first.');
    return;
  }

  try {
    const orderDTO = {
      itemID: item.itemID,
      orderID: currentOrderId, 
      supervisor: localStorage.getItem('userName'), 
      client: localStorage.getItem('client'), 
      orderNotes: `Adding item ${item.name}`,
    };

    const response = await axios.post('http://localhost:8080/order/addToOrder', orderDTO);
    if (response.data && response.data.code === 1) {
      ElMessage.success(`Item ${item.name} added to order successfully!`);
      fetchItems(); // 刷新物品列表，更新可用数量
    } else {
      ElMessage.error(response.data.msg || 'Failed to add item to order.');
    }
  } catch (error) {
    console.error('Error adding item to order:', error);
    ElMessage.error('Failed to add item to order. Please try again later.');
  }
};

// 页面加载时获取类别
onMounted(fetchCategories);
</script>

<style scoped>
.category-form {
  margin-bottom: 20px;
}
</style>
