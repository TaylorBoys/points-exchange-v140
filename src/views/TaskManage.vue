<template>
  <div class="min-h-screen bg-gray-100">
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
      <div class="container mx-auto">
        <router-link to="/" class="text-indigo-200 hover:text-white mb-4 inline-block">← 返回首页</router-link>
        <h1 class="text-3xl font-bold">任务中心</h1>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">全部任务</p>
              <p class="text-3xl font-bold text-gray-800">{{ statistics.total }}</p>
            </div>
            <div class="text-4xl">📋</div>
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-500 text-sm">已完成</p>
              <p class="text-3xl font-bold text-green-600">{{ statistics.completed }}</p>
            </div>
            <div class="text-4xl">✅</div>
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-500 text-sm">待完成</p>
              <p class="text-3xl font-bold text-blue-600">{{ statistics.pending }}</p>
            </div>
            <div class="text-4xl">⏳</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div 
          v-for="task in tasks" 
          :key="task.id" 
          :class="['bg-white rounded-2xl shadow-lg p-6 transition-all', task.completed ? 'border-2 border-green-500' : 'border-2 border-transparent']"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-bold mb-1">{{ task.name }}</h3>
              <p class="text-gray-600 text-sm">{{ task.description }}</p>
            </div>
            <span v-if="task.completed" class="text-2xl">✅</span>
            <span v-else class="text-2xl">📌</span>
          </div>
          <div class="flex items-center justify-between mb-4">
            <span class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              +{{ task.points }} 积分
            </span>
            <span :class="['px-3 py-1 rounded-full text-xs font-semibold', getTypeColor(task.type)]">
              {{ getTypeText(task.type) }}
            </span>
          </div>
          <button 
            v-if="!task.completed"
            @click="completeTask(task)"
            class="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all"
          >
            立即完成
          </button>
          <div v-else class="text-center text-green-600 font-semibold py-3 bg-green-50 rounded-xl">
            已完成 ✓
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">管理任务</h2>
          <button @click="showAddModal = true" class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all">
            添加任务
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-gray-200">
                <th class="text-left py-3 px-4 font-semibold">任务名称</th>
                <th class="text-left py-3 px-4 font-semibold">积分奖励</th>
                <th class="text-left py-3 px-4 font-semibold">类型</th>
                <th class="text-left py-3 px-4 font-semibold">状态</th>
                <th class="text-left py-3 px-4 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in tasks" :key="task.id" class="border-b border-gray-100 hover:bg-gray-50">
                <td class="py-4 px-4">
                  <div>
                    <p class="font-semibold">{{ task.name }}</p>
                    <p class="text-sm text-gray-600">{{ task.description }}</p>
                  </div>
                </td>
                <td class="py-4 px-4 text-purple-600 font-bold">+{{ task.points }}</td>
                <td class="py-4 px-4">
                  <span :class="['px-3 py-1 rounded-full text-sm', getTypeColor(task.type)]">
                    {{ getTypeText(task.type) }}
                  </span>
                </td>
                <td class="py-4 px-4">
                  <span :class="task.completed ? 'text-green-600' : 'text-yellow-600'" class="font-semibold">
                    {{ task.completed ? '已完成' : '待完成' }}
                  </span>
                </td>
                <td class="py-4 px-4">
                  <button @click="editTask(task)" class="text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                  <button @click="resetTask(task)" class="text-orange-600 hover:text-orange-800 mr-3">重置</button>
                  <button @click="deleteTaskConfirm(task.id)" class="text-red-600 hover:text-red-800">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">{{ editingTask ? '编辑任务' : '添加任务' }}</h3>
        <form @submit.prevent="saveTask" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">任务名称</label>
            <input v-model="formData.name" type="text" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">任务描述</label>
            <textarea v-model="formData.description" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">积分奖励</label>
              <input v-model.number="formData.points" type="number" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">任务类型</label>
              <select v-model="formData.type" class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="daily">每日</option>
                <option value="once">一次性</option>
                <option value="continuous">可持续</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3">
            <button type="submit" class="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-xl font-semibold">
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
import { getTasks, updateTask, getUsers, updateUser } from '../utils/storage'
import { generateId } from '../utils/helpers'
import type { Task } from '../types'

const tasks = ref<Task[]>([])
const showAddModal = ref(false)
const editingTask = ref<Task | null>(null)
const formData = ref({
  name: '',
  description: '',
  points: 0,
  type: 'daily' as Task['type']
})

const statistics = computed(() => {
  return {
    total: tasks.value.length,
    completed: tasks.value.filter(t => t.completed).length,
    pending: tasks.value.filter(t => !t.completed).length
  }
})

onMounted(() => {
  loadTasks()
})

const loadTasks = () => {
  tasks.value = getTasks()
}

const getTypeText = (type: string): string => {
  const texts: Record<string, string> = {
    daily: '每日',
    once: '一次性',
    continuous: '可持续'
  }
  return texts[type] || type
}

const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    daily: 'bg-blue-100 text-blue-700',
    once: 'bg-purple-100 text-purple-700',
    continuous: 'bg-green-100 text-green-700'
  }
  return colors[type] || 'bg-gray-100 text-gray-700'
}

const completeTask = (task: Task) => {
  const users = getUsers()
  if (users.length > 0) {
    users[0].points += task.points
    updateUser(users[0])
  }
  updateTask({ ...task, completed: true })
  loadTasks()
}

const editTask = (task: Task) => {
  editingTask.value = task
  formData.value = { ...task }
  showAddModal.value = true
}

const saveTask = () => {
  if (editingTask.value) {
    updateTask({ ...editingTask.value, ...formData.value })
  } else {
    const newTask: Task = {
      id: generateId(),
      ...formData.value,
      completed: false,
      createdAt: new Date().toISOString()
    }
    const tasks = getTasks()
    tasks.push(newTask)
    localStorage.setItem('points-exchange-data', JSON.stringify({ ...getTasksFromStorage(), tasks }))
  }
  closeModal()
  loadTasks()
}

const getTasksFromStorage = () => {
  const stored = localStorage.getItem('points-exchange-data')
  return stored ? JSON.parse(stored) : { users: [], gifts: [], exchanges: [], tasks: [] }
}

const resetTask = (task: Task) => {
  updateTask({ ...task, completed: false })
  loadTasks()
}

const deleteTaskConfirm = (id: string) => {
  if (confirm('确定要删除该任务吗？')) {
    const data = getTasksFromStorage()
    data.tasks = data.tasks.filter((t: Task) => t.id !== id)
    localStorage.setItem('points-exchange-data', JSON.stringify(data))
    loadTasks()
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingTask.value = null
  formData.value = { name: '', description: '', points: 0, type: 'daily' }
}
</script>
