<template>
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
    >
      <el-form-item label="Username" prop="userName">
        <el-input v-model="ruleForm.userName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          Login
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import axios from 'axios';
  import { ElMessage } from 'element-plus';
  import type { FormInstance, FormRules } from 'element-plus';
  import router from '@/router';
  
  const ruleFormRef = ref<FormInstance>();
  const ruleForm = reactive({
    userName: '',
    password: '',
  });
  
  const rules = reactive<FormRules<typeof ruleForm>>({
    userName: [
      { required: true, message: 'Please input your username', trigger: 'blur' },
    ],
    password: [
      { required: true, message: 'Please input your password', trigger: 'blur' },
    ],
  });
  
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        try {
          const response = await axios.post('http://localhost:8080/login', ruleForm);
          if (response.data && response.data.data != null) {
            ElMessage.success('Login successful!');
            localStorage.setItem('token', response.data.data); 
            await router.push('/itemView');
          }
        } catch (error) {
          ElMessage.error('Login failed: ' + (error.response?.data || 'Unknown error'));
        }
      } else {
        ElMessage.error('Please fill in the form correctly!');
      }
    });
  };
  
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
  };
  </script>
  
  <style scoped>

  </style>
  