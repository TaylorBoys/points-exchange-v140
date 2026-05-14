import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import UserManage from '../views/UserManage.vue'
import GiftManage from '../views/GiftManage.vue'
import ExchangeManage from '../views/ExchangeManage.vue'
import TaskManage from '../views/TaskManage.vue'
import Statistics from '../views/Statistics.vue'
import Admin from '../views/Admin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/users',
      name: 'users',
      component: UserManage
    },
    {
      path: '/gifts',
      name: 'gifts',
      component: GiftManage
    },
    {
      path: '/exchanges',
      name: 'exchanges',
      component: ExchangeManage
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TaskManage
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: Statistics
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin
    }
  ]
})

export default router
