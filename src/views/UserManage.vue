<template>
  <div class="min-h-screen bg-gray-100">
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
      <div class="container mx-auto">
        <router-link to="/" class="text-blue-200 hover:text-white mb-4 inline-block">← 返回首页</router-link>
        <h1 class="text-3xl font-bold">用户管理</h1>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">用户列表</h2>
          <button @click="showAddModal = true" class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all">
            添加用户
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-gray-200">
                <th class="text-left py-3 px-4 font-semibold">用户</th>
                <th class="text-left py-3 px-4 font-semibold">手机号</th>
                <th class="text-left py-3 px-4 font-semibold">积分</th>
                <th class="text-left py-3 px-4 font-semibold">等级</th>
                <th class="text-left py-3 px-4 font-semibold">注册时间</th>
                <th class="text-left py-3 px-4 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id" class="border-b border-gray-100 hover:bg-gray-50">
                <td class="py-4 px-4">
                  <div class="flex items-center gap-3">
                    <img :src="user.avatar" class="w-10 h-10 rounded-full" />
                    <span class="font-semibold">{{ user.username }}</span>
                  </div>
                </td>
                <td class="py-4 px-4">{{ user.phone }}</td>
                <td class="py-4 px-4">
                  <span class="text-purple-600 font-bold">{{ user.points.toLocaleString() }}</span>
                </td>
                <td class="py-4 px-4">
                  <span :class="['px-3 py-1 rounded-full text-sm font-semibold', getLevelBg(user.level)]">
                    {{ getLevelText(user.level) }}
                  </span>
                </td>
                <td class="py-4 px-4 text-gray-600">{{ user.createdAt }}</td>
                <td class="py-4 px-4">
                  <button @click="editUser(user)" class="text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                  <button @click="deleteUserConfirm(user.id)" class="text-red-600 hover:text-red-800">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">{{ editingUser ? '编辑用户' : '添加用户' }}</h3>
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">用户名</label>
            <input v-model="formData.username" type="text" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">手机号</label>
            <input v-model="formData.phone" type="tel" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">初始积分</label>
            <input v-model.number="formData.points" type="number" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">会员等级</label>
            <select v-model="formData.level" class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="bronze">青铜</option>
              <option value="silver">白银</option>
              <option value="gold">黄金</option>
              <option value="platinum">铂金</option>
              <option value="diamond">钻石</option>
            </select>
          </div>
          <div class="flex gap-3">
            <button type="submit" class="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600">
              保存
            </button>
            <button type="button" @click="closeModal" class="flex-1 bg-gray-300 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-400">
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUsers, addUser, updateUser, deleteUser } from '../utils/storage'
import { generateId } from '../utils/helpers'
import type { User } from '../types'

const users = ref<User[]>([])
const showAddModal = ref(false)
const editingUser = ref<User | null>(null)
const formData = ref({
  username: '',
  phone: '',
  points: 0,
  level: 'bronze' as User['level']
})

onMounted(() => {
  loadUsers()
})

const loadUsers = () => {
  users.value = getUsers()
}

const getLevelText = (level: string): string => {
  const levels: Record<string, string> = {
    bronze: '青铜',
    silver: '白银',
    gold: '黄金',
    platinum: '铂金',
    diamond: '钻石'
  }
  return levels[level] || level
}

const getLevelBg = (level: string): string => {
  const colors: Record<string, string> = {
    bronze: 'bg-amber-100 text-amber-700',
    silver: 'bg-gray-100 text-gray-600',
    gold: 'bg-yellow-100 text-yellow-700',
    platinum: 'bg-purple-100 text-purple-700',
    diamond: 'bg-blue-100 text-blue-700'
  }
  return colors[level] || 'bg-gray-100 text-gray-700'
}

const editUser = (user: User) => {
  editingUser.value = user
  formData.value = {
    username: user.username,
    phone: user.phone,
    points: user.points,
    level: user.level
  }
  showAddModal.value = true
}

const saveUser = () => {
  if (editingUser.value) {
    updateUser({
      ...editingUser.value,
      ...formData.value
    })
  } else {
    const newUser: User = {
      id: generateId(),
      username: formData.value.username,
      phone: formData.value.phone,
      points: formData.value.points,
      level: formData.value.level,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.value.username}`,
      createdAt: new Date().toISOString().split('T')[0]
    }
    addUser(newUser)
  }
  closeModal()
  loadUsers()
}

const deleteUserConfirm = (id: string) => {
  if (confirm('确定要删除该用户吗？')) {
    deleteUser(id)
    loadUsers()
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingUser.value = null
  formData.value = { username: '', phone: '', points: 0, level: 'bronze' }
}
</script>
