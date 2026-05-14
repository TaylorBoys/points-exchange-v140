<template>
  <div class="min-h-screen bg-gray-100">
    <div class="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
      <div class="container mx-auto">
        <router-link to="/" class="text-green-200 hover:text-white mb-4 inline-block">← 返回首页</router-link>
        <h1 class="text-3xl font-bold">礼品中心</h1>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <div class="flex gap-2 mb-4">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="selectedCategory = cat"
            :class="['px-4 py-2 rounded-xl font-semibold transition-all', selectedCategory === cat ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200']"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="gift in filteredGifts" :key="gift.id" class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
          <div class="relative">
            <img :src="gift.image" :alt="gift.name" class="w-full h-48 object-cover" />
            <span class="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {{ gift.category }}
            </span>
          </div>
          <div class="p-5">
            <h3 class="text-xl font-bold mb-2">{{ gift.name }}</h3>
            <p class="text-gray-600 mb-3">{{ gift.description }}</p>
            <div class="flex justify-between items-center mb-4">
              <span class="text-2xl font-bold text-purple-600">{{ gift.points }} 积分</span>
              <span class="text-sm" :class="gift.stock > 10 ? 'text-green-600' : 'text-red-600'">
                剩余 {{ gift.stock }}
              </span>
            </div>
            <button 
              v-if="gift.stock > 0"
              @click="exchangeGift(gift)"
              class="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all"
            >
              立即兑换
            </button>
            <button v-else disabled class="w-full bg-gray-300 text-gray-500 py-3 rounded-xl font-semibold cursor-not-allowed">
              库存不足
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6 mt-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">管理所有礼品</h2>
          <button @click="showAddModal = true" class="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all">
            添加礼品
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-gray-200">
                <th class="text-left py-3 px-4 font-semibold">礼品</th>
                <th class="text-left py-3 px-4 font-semibold">积分</th>
                <th class="text-left py-3 px-4 font-semibold">库存</th>
                <th class="text-left py-3 px-4 font-semibold">分类</th>
                <th class="text-left py-3 px-4 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="gift in gifts" :key="gift.id" class="border-b border-gray-100 hover:bg-gray-50">
                <td class="py-4 px-4">
                  <div class="flex items-center gap-3">
                    <img :src="gift.image" class="w-12 h-12 rounded-xl object-cover" />
                    <span class="font-semibold">{{ gift.name }}</span>
                  </div>
                </td>
                <td class="py-4 px-4 text-purple-600 font-bold">{{ gift.points }}</td>
                <td class="py-4 px-4">
                  <span :class="gift.stock > 10 ? 'text-green-600' : 'text-red-600'">{{ gift.stock }}</span>
                </td>
                <td class="py-4 px-4">
                  <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{{ gift.category }}</span>
                </td>
                <td class="py-4 px-4">
                  <button @click="editGift(gift)" class="text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                  <button @click="deleteGiftConfirm(gift.id)" class="text-red-600 hover:text-red-800">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">{{ editingGift ? '编辑礼品' : '添加礼品' }}</h3>
        <form @submit.prevent="saveGift" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">礼品名称</label>
            <input v-model="formData.name" type="text" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">描述</label>
            <textarea v-model="formData.description" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">所需积分</label>
              <input v-model.number="formData.points" type="number" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">库存</label>
              <input v-model.number="formData.stock" type="number" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">图片URL</label>
            <input v-model="formData.image" type="url" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">分类</label>
            <input v-model="formData.category" type="text" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div class="flex gap-3">
            <button type="submit" class="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-xl font-semibold">
              保存
            </button>
            <button type="button" @click="closeModal" class="flex-1 bg-gray-300 text-gray-700 py-2 rounded-xl font-semibold">
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getGifts, addGift, updateGift, deleteGift, addExchange, getUsers, updateGiftStock } from '../utils/storage'
import { generateId } from '../utils/helpers'
import type { Gift, Exchange } from '../types'

const gifts = ref<Gift[]>([])
const showAddModal = ref(false)
const editingGift = ref<Gift | null>(null)
const selectedCategory = ref('全部')
const categories = computed(() => {
  const cats = ['全部', ...new Set(gifts.value.map(g => g.category))]
  return cats
})

const formData = ref({
  name: '',
  description: '',
  points: 0,
  stock: 0,
  image: '',
  category: ''
})

onMounted(() => {
  loadGifts()
})

const loadGifts = () => {
  gifts.value = getGifts()
}

const filteredGifts = computed(() => {
  if (selectedCategory.value === '全部') {
    return gifts.value
  }
  return gifts.value.filter(g => g.category === selectedCategory.value)
})

const exchangeGift = (gift: Gift) => {
  const currentUser = getUsers()[0]
  if (currentUser.points >= gift.points) {
    const exchange: Exchange = {
      id: generateId(),
      userId: currentUser.id,
      giftId: gift.id,
      giftName: gift.name,
      points: gift.points,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    addExchange(exchange)
    alert('兑换申请已提交！')
  } else {
    alert('积分不足，无法兑换')
  }
}

const editGift = (gift: Gift) => {
  editingGift.value = gift
  formData.value = { ...gift }
  showAddModal.value = true
}

const saveGift = () => {
  if (editingGift.value) {
    updateGift({ ...editingGift.value, ...formData.value })
  } else {
    const newGift: Gift = {
      id: generateId(),
      ...formData.value
    }
    addGift(newGift)
  }
  closeModal()
  loadGifts()
}

const deleteGiftConfirm = (id: string) => {
  if (confirm('确定要删除该礼品吗？')) {
    deleteGift(id)
    loadGifts()
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingGift.value = null
  formData.value = { name: '', description: '', points: 0, stock: 0, image: '', category: '' }
}
</script>
