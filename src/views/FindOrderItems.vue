<template>
  <div>
    <el-input v-model="orderID" placeholder="Enter Order ID"></el-input>
    <el-button @click="findOrder">Find Order</el-button>
    <div v-if="hasQueried" style="margin-top: 20px;">
      <h3>Order Items:</h3>
      <!-- 物品列表 -->
    <div v-if="items && items.length > 0" style="margin-top: 20px;">
      <el-table :data="items" style="width: 100%">
        <el-table-column prop="itemID" label="Item ID" />
        <el-table-column prop="idescription" label="Description" width="170"  />
        <el-table-column prop="roomNum" label="Room Number" />
        <el-table-column prop="shelfNum" label="Shelf Number" />
        <el-table-column prop="shelfDescription" label="Shelf Description" width="150"/>
        <el-table-column prop="pDescription" label="Piece Description" width="150"  />
        <el-table-column prop="pieceNum" label="Number of Pieces" />
      </el-table>
    </div>
    <div v-else>
        <el-alert 
          title="No location information found for this order." 
          type="warning" 
          show-icon
          style="margin-top: 10px;"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const orderID = ref('');
const items = ref(null);
const hasQueried = ref(false);


const findOrder = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    ElMessage.error('Please log in first!');
    return;
  }

  if (!orderID.value) {
    ElMessage.error('Please enter an Order ID!');
    return;
  }
  try {
    const response = await axios.get(`http://localhost:8080/items/order/${orderID.value}`, {
      headers: { token },
    });

    hasQueried.value = true;

    if(response.data.code>0)
    {
    items.value = response.data.data;
    ElMessage.success('Order found successfully!');}
    else {
      ElMessage.warning('No item found!');
      items.value = null;
    }
  } catch (error) {
    ElMessage.error('Failed to find order: ' + (error.response?.data || 'Unknown error'));
    items.value = null;
  }
};
</script>
