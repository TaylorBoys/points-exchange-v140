<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">积分兑换中心</h1>
        <p class="text-blue-100">v1.4.0 会员积分兑换平台</p>
      </div>

      <div class="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-6 mb-6 shadow-2xl">
        <div class="flex items-center gap-6 mb-6">
          <img :src="currentUser.avatar" alt="avatar" class="w-20 h-20 rounded-full border-4 border-white shadow-lg" />
          <div>
            <h2 class="text-2xl font-bold text-white">{{ currentUser.username }}</h2>
            <div class="flex items-center gap-2 mt-1">
              <span :class="['px-3 py-1 rounded-full text-sm font-semibold', getLevelBg(currentUser.level)]" :class2="getLevelColor(currentUser.level)">
                {{ getLevelText(currentUser.level) }}
              </span>
              <span class="text-white text-lg font-bold">{{ currentUser.points.toLocaleString() }} 积分</span>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white bg-opacity-30 rounded-2xl p-4 text-center">
            <p class="text-white text-sm opacity-80">累计兑换</p>
            <p class="text-white text-2xl font-bold">{{ statistics.totalExchanges }}</p>
          </div>
          <div class="bg-white bg-opacity-30 rounded-2xl p-4 text-center">
            <p class="text-white text-sm opacity-80">进行中</p>
            <p class="text-white text-2xl font-bold">{{ statistics.pendingExchanges }}</p>
          </div>
          <div class="bg-white bg-opacity-30 rounded-2xl p-4 text-center">
            <p class="text-white text-sm opacity-80">已完成</p>
            <p class="text-white text-2xl font-bold">{{ statistics.completedExchanges }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <router-link to="/users" class="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 text-center hover:bg-opacity-30 transition-all duration-300 shadow-xl">
          <div class="text-4xl mb-2">👥</div>
          <p class="text-white font-semibold">用户管理</p>
        </router-link>
        <router-link to="/gifts" class="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 text-center hover:bg-opacity-30 transition-all duration-300 shadow-xl">
          <div class="text-4xl mb-2">🎁</div>
          <p class="text-white font-semibold">礼品中心</p>
        </router-link>
        <router-link to="/exchanges" class="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 text-center hover:bg-opacity-30 transition-all duration-300 shadow-xl">
          <div class="text-4xl mb-2">📦</div>
          <p class="text-white font-semibold">兑换记录</p>
        </router-link>
        <router-link to="/tasks" class="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 text-center hover:bg-opacity-30 transition-all duration-300 shadow-xl">
          <div class="text-4xl mb-2">📋</div>
          <p class="text-white font-semibold">任务中心</p>
        </router-link>
        <router-link to="/statistics" class="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 text-center hover:bg-opacity-30 transition-all duration-300 shadow-xl">
          <div class="text-4xl mb-2">📊</div>
          <p class="text-white font-semibold">数据统计</p>
        </router-link>
        <router-link to="/admin" class="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 text-center hover:bg-opacity-30 transition-all duration-300 shadow-xl">
          <div class="text-4xl mb-2">⚙️</div>
          <p class="text-white font-semibold">管理后台</p>
        </router-link>
        <button @click="signIn" class="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-6 text-center hover:from-green-500 hover:to-emerald-600 transition-all duration-300 shadow-xl">
          <div class="text-4xl mb-2">✨</div>
          <p class="text-white font-semibold">每日签到</p>
        </button>
        <button @click="showAnnouncement = true" class="bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl p-6 text-center hover:from-pink-500 hover:to-rose-600 transition-all duration-300 shadow-xl">
          <div class="text-4xl mb-2">📢</div>
          <p class="text-white font-semibold">活动公告</p>
        </button>
      </div>

      <div class="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-6 shadow-2xl">
        <h3 class="text-xl font-bold text-white mb-4">🔥 热门礼品</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="gift in topGifts" :key="gift.id" class="bg-white rounded-2xl p-4 shadow-lg">
            <img :src="gift.image" :alt="gift.name" class="w-full h-32 object-cover rounded-xl mb-3" />
            <h4 class="font-bold text-gray-800 mb-1">{{ gift.name }}</h4>
            <p class="text-sm text-gray-600 mb-2">{{ gift.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-xl font-bold text-purple-600">{{ gift.points }}积分</span>
              <span class="text-sm text-gray-500">剩余 {{ gift.stock }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAnnouncement" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 class="text-2xl font-bold mb-4 text-center">📢 活动公告</h3>
        <div class="space-y-3 text-gray-700">
          <p>🎉 <strong>新用户注册</strong>送500积分</p>
          <p>✨ <strong>每日签到</strong>连续7天额外奖励200积分</p>
          <p>🎁 <strong>限时兑换</strong> - 全场8折优惠</p>
          <p>👥 <strong>邀请好友</strong> - 双方各得100积分</p>
        </div>
        <button @click="showAnnouncement = false" class="w-full mt-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all">
          我知道了
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getUsers, getExchanges, getGifts, updateUser } from '../utils/storage'

const showAnnouncement = ref(false)
const currentUser = ref(getUsers()[0])

const statistics = computed(() => {
  const exchanges = getExchanges()
  return {
    totalExchanges: exchanges.length,
    pendingExchanges: exchanges.filter(e => e.status === 'pending' || e.status === 'approved').length,
    completedExchanges: exchanges.filter(e => e.status === 'completed').length
  }
})

const topGifts = computed(() => {
  return getGifts().slice(0, 3)
})

const getLevelText = (level: string): string => {
  const levels: Record<string, string> = {
    bronze: '青铜会员',
    silver: '白银会员',
    gold: '黄金会员',
    platinum: '铂金会员',
    diamond: '钻石会员'
  }
  return levels[level] || level
}

const getLevelBg = (level: string): string => {
  const colors: Record<string, string> = {
    bronze: 'bg-amber-700 text-white',
    silver: 'bg-gray-400 text-white',
    gold: 'bg-yellow-400 text-gray-800',
    platinum: 'bg-purple-500 text-white',
    diamond: 'bg-blue-500 text-white'
  }
  return colors[level] || 'bg-gray-300 text-gray-800'
}

const signIn = () => {
  currentUser.value.points += 10
  updateUser(currentUser.value)
  alert('签到成功！获得10积分')
}
</script>
