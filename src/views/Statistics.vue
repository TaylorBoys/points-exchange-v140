<template>
  <div class="min-h-screen bg-gray-100">
    <div class="bg-gradient-to-r from-pink-600 to-rose-600 text-white p-6">
      <div class="container mx-auto">
        <router-link to="/" class="text-pink-200 hover:text-white mb-4 inline-block">← 返回首页</router-link>
        <h1 class="text-3xl font-bold">数据统计</h1>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
          <p class="text-blue-100 text-sm mb-1">总用户数</p>
          <p class="text-4xl font-bold">{{ statistics.totalUsers }}</p>
        </div>
        <div class="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
          <p class="text-purple-100 text-sm mb-1">总礼品数</p>
          <p class="text-4xl font-bold">{{ statistics.totalGifts }}</p>
        </div>
        <div class="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg p-6 text-white">
          <p class="text-green-100 text-sm mb-1">总兑换数</p>
          <p class="text-4xl font-bold">{{ statistics.totalExchanges }}</p>
        </div>
        <div class="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white">
          <p class="text-orange-100 text-sm mb-1">总积分发放</p>
          <p class="text-4xl font-bold">{{ statistics.totalPoints.toLocaleString() }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold mb-4">兑换趋势</h2>
          <div ref="exchangeChartRef" style="width: 100%; height: 300px;"></div>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold mb-4">积分分布</h2>
          <div ref="pointsChartRef" style="width: 100%; height: 300px;"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold mb-4">用户等级分布</h2>
          <div ref="levelChartRef" style="width: 100%; height: 300px;"></div>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold mb-4">礼品分类统计</h2>
          <div ref="categoryChartRef" style="width: 100%; height: 300px;"></div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6 mt-6">
        <h2 class="text-xl font-bold mb-4">最近兑换记录</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-gray-200">
                <th class="text-left py-3 px-4 font-semibold">用户</th>
                <th class="text-left py-3 px-4 font-semibold">礼品</th>
                <th class="text-left py-3 px-4 font-semibold">积分</th>
                <th class="text-left py-3 px-4 font-semibold">状态</th>
                <th class="text-left py-3 px-4 font-semibold">时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="exchange in recentExchanges" :key="exchange.id" class="border-b border-gray-100">
                <td class="py-4 px-4 font-semibold">{{ getUsername(exchange.userId) }}</td>
                <td class="py-4 px-4">{{ exchange.giftName }}</td>
                <td class="py-4 px-4 text-purple-600 font-bold">{{ exchange.points }}</td>
                <td class="py-4 px-4">
                  <span :class="['px-3 py-1 rounded-full text-sm font-semibold', getStatusColor(exchange.status)]">
                    {{ getStatusText(exchange.status) }}
                  </span>
                </td>
                <td class="py-4 px-4 text-gray-600">{{ exchange.createdAt }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { getUsers, getGifts, getExchanges } from '../utils/storage'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

const exchangeChartRef = ref<HTMLElement>()
const pointsChartRef = ref<HTMLElement>()
const levelChartRef = ref<HTMLElement>()
const categoryChartRef = ref<HTMLElement>()

let exchangeChart: ECharts | null = null
let pointsChart: ECharts | null = null
let levelChart: ECharts | null = null
let categoryChart: ECharts | null = null

const users = computed(() => getUsers())
const gifts = computed(() => getGifts())
const exchanges = computed(() => getExchanges())

const statistics = computed(() => {
  return {
    totalUsers: users.value.length,
    totalGifts: gifts.value.length,
    totalExchanges: exchanges.value.length,
    totalPoints: users.value.reduce((sum, u) => sum + u.points, 0) + exchanges.value.reduce((sum, e) => sum + e.points, 0)
  }
})

const recentExchanges = computed(() => {
  return exchanges.value.slice(0, 10)
})

const getUsername = (userId: string): string => {
  const user = users.value.find(u => u.id === userId)
  return user ? user.username : '未知'
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

const initCharts = () => {
  if (exchangeChartRef.value) {
    exchangeChart = echarts.init(exchangeChartRef.value)
    const completed = exchanges.value.filter(e => e.status === 'completed').length
    const pending = exchanges.value.filter(e => e.status === 'pending').length
    const approved = exchanges.value.filter(e => e.status === 'approved').length
    const rejected = exchanges.value.filter(e => e.status === 'rejected').length
    
    exchangeChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {c}' },
        data: [
          { value: completed, name: '已完成', itemStyle: { color: '#10b981' } },
          { value: approved, name: '已通过', itemStyle: { color: '#3b82f6' } },
          { value: pending, name: '待处理', itemStyle: { color: '#f59e0b' } },
          { value: rejected, name: '已拒绝', itemStyle: { color: '#ef4444' } }
        ]
      }]
    })
  }

  if (pointsChartRef.value) {
    pointsChart = echarts.init(pointsChartRef.value)
    const sortedUsers = [...users.value].sort((a, b) => b.points - a.points).slice(0, 5)
    
    pointsChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: sortedUsers.map(u => u.username) },
      series: [{
        type: 'bar',
        data: sortedUsers.map(u => u.points),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ])
        },
        barWidth: '50%'
      }]
    })
  }

  if (levelChartRef.value) {
    levelChart = echarts.init(levelChartRef.value)
    const levelCounts = {
      bronze: users.value.filter(u => u.level === 'bronze').length,
      silver: users.value.filter(u => u.level === 'silver').length,
      gold: users.value.filter(u => u.level === 'gold').length,
      platinum: users.value.filter(u => u.level === 'platinum').length,
      diamond: users.value.filter(u => u.level === 'diamond').length
    }
    
    levelChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      radar: {
        indicator: [
          { name: '青铜', max: users.value.length },
          { name: '白银', max: users.value.length },
          { name: '黄金', max: users.value.length },
          { name: '铂金', max: users.value.length },
          { name: '钻石', max: users.value.length }
        ]
      },
      series: [{
        type: 'radar',
        data: [{
          value: [levelCounts.bronze, levelCounts.silver, levelCounts.gold, levelCounts.platinum, levelCounts.diamond],
          name: '用户等级',
          areaStyle: { color: 'rgba(139, 92, 246, 0.3)' },
          lineStyle: { color: '#8b5cf6' },
          itemStyle: { color: '#8b5cf6' }
        }]
      }]
    })
  }

  if (categoryChartRef.value) {
    categoryChart = echarts.init(categoryChartRef.value)
    const categoryCounts: Record<string, number> = {}
    gifts.value.forEach(g => {
      categoryCounts[g.category] = (categoryCounts[g.category] || 0) + 1
    })
    
    categoryChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: Object.keys(categoryCounts) },
      yAxis: { type: 'value' },
      series: [{
        type: 'bar',
        data: Object.values(categoryCounts),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#10b981' },
            { offset: 1, color: '#34d399' }
          ])
        },
        barWidth: '50%'
      }]
    })
  }
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  exchangeChart?.dispose()
  pointsChart?.dispose()
  levelChart?.dispose()
  categoryChart?.dispose()
})

const handleResize = () => {
  exchangeChart?.resize()
  pointsChart?.resize()
  levelChart?.resize()
  categoryChart?.resize()
}
</script>
