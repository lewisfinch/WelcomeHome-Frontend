<template>
  <div>
    <div v-if="isVerified">
      <el-input v-model="donorID" placeholder="Enter Donor ID"></el-input>
      <el-button @click="checkDonor">Verify Donor</el-button>
    </div>
    <div v-if="donorVerified">
      <el-input v-model="form.itemID" placeholder="Enter ItemID (Optional)"></el-input>
      <el-input v-model="form.iDescription" placeholder="Enter Item Name"></el-input>
      <el-input v-model="form.color" placeholder="Enter Item Color"></el-input>
      <el-switch v-model="form.isNew" active-text="New" inactive-text="Not New"></el-switch>
      <el-switch v-model="form.hasPieces" active-text="Has Pieces" inactive-text="No Pieces"></el-switch>
      <el-input v-model="form.material" placeholder="Enter Material"></el-input>
      <el-input v-model="form.mainCategory" placeholder="Enter Main Category"></el-input>
      <el-input v-model="form.subCategory" placeholder="Enter Sub Category"></el-input>
      <div>
        <h3>Pieces</h3>
        <el-button type="primary" @click="addPiece">Add Piece</el-button>
        <div v-for="(piece, index) in form.pieces" :key="index" style="margin-bottom: 10px;">
          <el-input v-model="piece.pDescription" placeholder="Enter Piece Description"></el-input>
          <el-input v-model="piece.length" type="number" placeholder="Enter Length"></el-input>
          <el-input v-model="piece.width" type="number" placeholder="Enter Width"></el-input>
          <el-input v-model="piece.height" type="number" placeholder="Enter Height"></el-input>
          <el-input v-model="piece.roomNum" placeholder="Enter Room Number"></el-input>
          <el-input v-model="piece.shelfNum" placeholder="Enter Shelf Number"></el-input>
          <el-input v-model="piece.pNotes" placeholder="Enter Piece Notes"></el-input>
          <el-button type="danger" @click="removePiece(index)">Remove</el-button>
        </div>
      </div>
      <el-button @click="acceptDonation">Accept Donation</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const staffID = localStorage.getItem('userName'); // Ensure it's not null
const donorID = ref('');
const form = ref({
  itemID: '',
  iDescription: '',
  color: '',
  isNew: false,
  hasPieces: false,
  material: '',
  mainCategory: '',
  subCategory: '',
  pieces: []
});

const isVerified = ref(false);
const donorVerified = ref(false);

const checkStaff = async () => {
  try {
    const response = await axios.get('http://localhost:8080/donations/isStaff', {
      params: { userName: staffID }
    });
    if (response.data.code > 0) {
      isVerified.value = true;
      ElMessage.success('Staff verified successfully!');
    } else {
      ElMessage.error('You are not a staff!');
    }
  } catch (error) {
    ElMessage.error('Failed to verify staff: ' + (error.response?.data || 'Unknown error'));
  }
};

const checkDonor = async () => {
  try {
    const response = await axios.get('http://localhost:8080/donations/isDonor', {
      params: { userName: donorID.value }
    });
    if (response.data.code > 0) {
      donorVerified.value = true;
      ElMessage.success('Donor verified successfully!');
    } else {
      ElMessage.error('Donor not registered!');
    }
  } catch (error) {
    ElMessage.error('Failed to verify donor: ' + (error.response?.data || 'Unknown error'));
  }
};

const acceptDonation = async () => {
  try {
    const itemIDToSubmit = form.value.itemID || '1111';

    await axios.post('http://localhost:8080/donations/acceptDonations', {
      itemID: itemIDToSubmit,
      userName: donorID.value,
      iDescription: form.value.iDescription,
      color: form.value.color,
      isNew: form.value.isNew,
      hasPieces: form.value.hasPieces,
      material: form.value.material,
      mainCategory: form.value.mainCategory,
      subCategory: form.value.subCategory,
      pieces: form.value.pieces,
    });

    ElMessage.success('Donation accepted successfully!');
  } catch (error) {
    ElMessage.error('Failed to accept donation: ' + (error.response?.data || 'Unknown error'));
  }
};

// Methods for adding/removing pieces
const addPiece = () => {
  form.value.pieces.push({ name: '', size: '' });
};

const removePiece = (index) => {
  form.value.pieces.splice(index, 1);
};

onMounted(() => {
  checkStaff();
});
</script>
