import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login')
  },
  {
    path: '/registered',
    name: "Registered",
    component: () => import ('../views/Registered')
  },
  {
    path: '/register',
    name: 'Registration',
    component: () => import('../views/Registration')
  },
  {
    path: '/details',
    name: 'Details',
    component: () => import('../views/Details')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
