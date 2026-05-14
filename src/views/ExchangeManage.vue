<template>
  <div class="min-h-screen bg-gray-100">
    <div class="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
      <div class="container mx-auto">
        <router-link to="/" class="text-orange-200 hover:text-white mb-4 inline-block">← 返回首页</router-link>
        <h1 class="text-3xl font-bold">兑换管理</h1>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">全部兑换</p>
              <p class="text-3xl font-bold text-gray-800">{{ statistics.total }}</p>
            </div>
            <div class="text-4xl">📦</div>
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-yellow-500 text-sm">待处理</p>
              <p class="text-3xl font-bold text-yellow-600">{{ statistics.pending }}</p>
            </div>
            <div class="text-4xl">⏳</div>
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-500 text-sm">已通过</p>
              <p class="text-3xl font-bold text-blue-600">{{ statistics.approved }}</p>
            </div>
            <div class="text-4xl">✅</div>
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-500 text-sm">已完成</p>
              <p class="text-3xl font-bold text-green-600">{{ statistics.completed }}</p>
            </div>
            <div class="text-4xl">🎉</div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">兑换记录</h2>
          <select v-model="filterStatus" class="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="all">全部状态</option>
            <option value="pending">待处理</option>
            <option value="approved">已通过</option>
            <option value="rejected">已拒绝</option>
            <option value="completed">已完成</option>
          </select>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-gray-200">
                <th class="text-left py-3 px-4 font-semibold">兑换ID</th>
                <th class="text-left py-3 px-4 font-semibold">用户</th>
                <th class="text-left py-3 px-4 font-semibold">礼品</th>
                <th class="text-left py-3 px-4 font-semibold">积分</th>
                <th class="text-left py-3 px-4 font-semibold">状态</th>
                <th class="text-left py-3 px-4 font-semibold">时间</th>
                <th class="text-left py-3 px-4 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="exchange in filteredExchanges" :key="exchange.id" class="border-b border-gray-100 hover:bg-gray-50">
                <td class="py-4 px-4 text-sm font-mono">{{ exchange.id }}</td>
                <td class="py-4 px-4 font-semibold">{{ getUsername(exchange.userId) }}</td>
                <td class="py-4 px-4">{{ exchange.giftName }}</td>
                <td class="py-4 px-4 text-purple-600 font-bold">{{ exchange.points }}</td>
                <td class="py-4 px-4">
                  <span :class="['px-3 py-1 rounded-full text-sm font-semibold', getStatusColor(exchange.status)]">
                    {{ getStatusText(exchange.status) }}
                  </span>
                </td>
                <td class="py-4 px-4 text-gray-600 text-sm">{{ exchange.createdAt }}</td>
                <td class="py-4 px-4">
                  <div v-if="exchange.status === 'pending'" class="flex gap-2">
                    <button @click="approveExchange(exchange)" class="text-green-600 hover:text-green-800 font-semibold">通过</button>
                    <button @click="rejectExchange(exchange)" class="text-red-600 hover:text-red-800 font-semibold">拒绝</button>
                  </div>
                  <div v-else-if="exchange.status === 'approved'" class="flex gap-2">
                    <button @click="completeExchange(exchange)" class="text-blue-600 hover:text-blue-800 font-semibold">完成</button>
                    <button @click="rejectExchange(exchange)" class="text-red-600 hover:text-red-800 font-semibold">拒绝</button>
                  </div>
                  <span v-else class="text-gray-400">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getExchanges, updateExchange, updateGiftStock, getUsers } from '../utils/storage'
import type { Exchange } from '../types'

const exchanges = ref<Exchange[]>([])
const filterStatus = ref('all')
const users = ref(getUsers())

const statistics = computed(() => {
  return {
    total: exchanges.value.length,
    pending: exchanges.value.filter(e => e.status === 'pending').length,
    approved: exchanges.value.filter(e => e.status === 'approved').length,
    completed: exchanges.value.filter(e => e.status === 'completed').length
  }
})

const filteredExchanges = computed(() => {
  if (filterStatus.value === 'all') {
    return exchanges.value
  }
  return exchanges.value.filter(e => e.status === filterStatus.value)
})

onMounted(() => {
  loadExchanges()
})

const loadExchanges = () => {
  exchanges.value = getExchanges()
}

const getUsername = (userId: string): string => {
  const user = users.value.find(u => u.id === userId)
  return user ? user.username : '未知用户'
}

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700'
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    pending: '待处理',
    approved: '已通过',
    rejected: '已拒绝',
    completed: '已完成'
  }
  return texts[status] || status
}

const approveExchange = (exchange: Exchange) => {
  updateExchange({
    ...exchange,
    status: 'approved',
    processedAt: new Date().toISOString()
  })
  loadExchanges()
}

const rejectExchange = (exchange: Exchange) => {
  if (confirm('确定要拒绝该兑换申请吗？')) {
    updateExchange({
      ...exchange,
      status: 'rejected',
      processedAt: new Date().toISOString()
    })
    loadExchanges()
  }
}

const completeExchange = (exchange: Exchange) => {
  updateExchange({
    ...exchange,
    status: 'completed',
    processedAt: new Date().toISOString()
  })
  updateGiftStock(exchange.giftId, -1)
  loadExchanges()
}
</script>
