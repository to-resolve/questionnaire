<template>
  <div class="user-management">
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">用户管理</h2>
          <p class="page-subtitle">管理系统用户信息及权限设置</p>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加用户
          </el-button>
          <el-button @click="fetchUserList">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </div>
    </div>

    <div class="main-content">
      <el-card shadow="hover" class="table-card">
        <el-table :data="userList" v-loading="loading" style="width: 100%" border stripe>
          <el-table-column label="头像" width="80" align="center">
            <template #default="{ row }">
              <el-avatar :size="40" :src="row.avatar" />
            </template>
          </el-table-column>
          <el-table-column prop="username" label="用户名" min-width="120" />
          <el-table-column prop="nickname" label="昵称" min-width="120" />
          <el-table-column prop="email" label="邮箱" min-width="180" />
          <el-table-column prop="phone" label="手机号" min-width="120" />
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                {{ row.status === 1 ? '正常' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="注册时间" min-width="180" align="center">
            <template #default="{ row }">
              {{ formatTime(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            v-model:current-page="queryParams.pageNum"
            v-model:page-size="queryParams.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next"
            :total="total"
            @size-change="fetchUserList"
            @current-change="fetchUserList"
          />
        </div>
      </el-card>
    </div>

    <!-- 用户表单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
      width="500px"
      @close="resetForm"
    >
      <el-form :model="userForm" :rules="rules" ref="userFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="userForm.username"
            placeholder="请输入用户名"
            :disabled="dialogType === 'edit'"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'
import { getUserList, addUser, updateUserInfoByUserId, deleteUser } from '@/api/user'

const loading = ref(false)
const submitting = ref(false)
const userList = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const userFormRef = ref()

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
})

const userForm = reactive({
  id: undefined,
  username: '',
  password: '',
  nickname: '',
  email: '',
  phone: '',
  status: 1,
  avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
}

const fetchUserList = async () => {
  loading.value = true
  try {
    const res = await getUserList(queryParams)
    if (res.code === 200) {
      console.log(res.data)
      userList.value = res.data.rows || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取用户列表失败', error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  Object.assign(userForm, {
    id: undefined,
    username: '',
    password: '',
    nickname: '',
    email: '',
    phone: '',
    status: 1,
  })
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.assign(userForm, { ...row })
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除用户 "${row.username}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const res = await deleteUser(row.id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchUserList()
      }
    } catch (error) {
      console.error('删除用户失败', error)
    }
  })
}

const submitForm = async () => {
  if (!userFormRef.value) return
  await userFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        let res
        if (dialogType.value === 'add') {
          res = await addUser(userForm)
        } else {
          res = await updateUserInfoByUserId(userForm)
        }
        if (res.code === 200) {
          ElMessage.success(dialogType.value === 'add' ? '添加成功' : '修改成功')
          dialogVisible.value = false
          fetchUserList()
        }
      } catch (error) {
        console.error('保存用户信息失败', error)
      } finally {
        submitting.value = false
      }
    }
  })
}

const resetForm = () => {
  userFormRef.value?.resetFields()
}

const formatTime = (time: string) => {
  if (!time) return '-'
  return new Date(time).toLocaleString()
}

onMounted(() => {
  fetchUserList()
})
</script>

<style scoped lang="scss">
.user-management {
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 50%, #e9ecef 100%);
  min-height: calc(100vh - 60px);

  .page-header {
    margin-bottom: 24px;
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 40px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

      .page-title {
        margin: 0 0 5px 0;
        font-size: 24px;
        font-weight: 600;
        color: #303133;
      }
      .page-subtitle {
        margin: 0;
        color: #909399;
        font-size: 14px;
      }
    }
  }

  .main-content {
    .table-card {
      min-height: calc(100vh - 227px);
      border-radius: 12px;
      padding: 10px;
      background: rgba(255, 255, 255, 0.95);

      .pagination-container {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
