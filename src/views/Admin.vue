<template>
  <div class="min-h-screen bg-gray-100">
    <div v-if="!isAuthenticated" class="flex items-center justify-center min-h-screen">
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">🔐</div>
          <h1 class="text-2xl font-bold">管理后台</h1>
          <p class="text-gray-600 mt-2">请输入管理员密码</p>
        </div>
        <form @submit.prevent="login">
          <div class="mb-4">
            <input 
              v-model="password" 
              type="password" 
              placeholder="请输入密码" 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
            />
          </div>
          <button type="submit" class="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all">
            登录
          </button>
        </form>
      </div>
    </div>

    <div v-else>
      <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6">
        <div class="container mx-auto">
          <router-link to="/" class="text-gray-300 hover:text-white mb-4 inline-block">← 返回首页</router-link>
          <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold">管理后台</h1>
            <button @click="logout" class="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-all">
              退出登录
            </button>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm">用户总数</p>
                <p class="text-4xl font-bold">{{ statistics.totalUsers }}</p>
              </div>
              <div class="text-5xl">👥</div>
            </div>
          </div>
          <div class="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm">礼品总数</p>
                <p class="text-4xl font-bold">{{ statistics.totalGifts }}</p>
              </div>
              <div class="text-5xl">🎁</div>
            </div>
          </div>
          <div class="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm">兑换总数</p>
                <p class="text-4xl font-bold">{{ statistics.totalExchanges }}</p>
              </div>
              <div class="text-5xl">📦</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold mb-4">系统操作</h2>
            <div class="space-y-3">
              <button @click="exportData" class="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all">
                📤 导出数据
              </button>
              <button @click="importData" class="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all">
                📥 导入数据
              </button>
              <button @click="resetData" class="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all">
                🗑️ 重置数据
              </button>
              <button @click="backupData" class="w-full bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600 transition-all">
                💾 备份数据
              </button>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold mb-4">系统信息</h2>
            <div class="space-y-4">
              <div class="flex justify-between items-center py-2 border-b">
                <span class="text-gray-600">应用版本</span>
                <span class="font-semibold">v1.4.0</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b">
                <span class="text-gray-600">存储方式</span>
                <span class="font-semibold">localStorage</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b">
                <span class="text-gray-600">用户数</span>
                <span class="font-semibold">{{ statistics.totalUsers }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b">
                <span class="text-gray-600">礼品数</span>
                <span class="font-semibold">{{ statistics.totalGifts }}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-gray-600">兑换数</span>
                <span class="font-semibold">{{ statistics.totalExchanges }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <h2 class="text-xl font-bold mb-4">快速操作</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button @click="$router.push('/users')" class="bg-blue-50 text-blue-600 py-4 rounded-xl font-semibold hover:bg-blue-100 transition-all">
              👥 用户管理
            </button>
            <button @click="$router.push('/gifts')" class="bg-green-50 text-green-600 py-4 rounded-xl font-semibold hover:bg-green-100 transition-all">
              🎁 礼品管理
            </button>
            <button @click="$router.push('/exchanges')" class="bg-orange-50 text-orange-600 py-4 rounded-xl font-semibold hover:bg-orange-100 transition-all">
              📦 兑换管理
            </button>
            <button @click="$router.push('/tasks')" class="bg-purple-50 text-purple-600 py-4 rounded-xl font-semibold hover:bg-purple-100 transition-all">
              📋 任务管理
            </button>
            <button @click="$router.push('/statistics')" class="bg-pink-50 text-pink-600 py-4 rounded-xl font-semibold hover:bg-pink-100 transition-all">
              📊 数据统计
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getUsers, getGifts, getExchanges, getData, saveData } from '../utils/storage'

const isAuthenticated = ref(false)
const password = ref('')
const ADMIN_PASSWORD = 'admin123'

const statistics = computed(() => {
  return {
    totalUsers: getUsers().length,
    totalGifts: getGifts().length,
    totalExchanges: getExchanges().length
  }
})

const login = () => {
  if (password.value === ADMIN_PASSWORD) {
    isAuthenticated.value = true
  } else {
    alert('密码错误！')
  }
}

const logout = () => {
  isAuthenticated.value = false
  password.value = ''
}

const exportData = () => {
  const data = getData()
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `points-exchange-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const importData = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string)
          saveData(data)
          alert('数据导入成功！')
          location.reload()
        } catch (error) {
          alert('数据格式错误！')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

const resetData = () => {
  if (confirm('确定要重置所有数据吗？此操作不可恢复！')) {
    localStorage.removeItem('points-exchange-data')
    alert('数据已重置！')
    location.reload()
  }
}

const backupData = () => {
  exportData()
  alert('备份已下载！')
}
</script>
