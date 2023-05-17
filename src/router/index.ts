import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/library',
      name: 'Library',
      component: () => import('../views/LibraryView.vue')
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('../views/SettingsView.vue')
    }
  ]
})

export default router
