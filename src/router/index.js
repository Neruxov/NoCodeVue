
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/task/1'
  },
  {
    path: '/task/:id',
    name: 'Task',
    component: () => import('../components/task.vue'),
    props: (route) => ({ id: Number(route.params.id) })
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../components/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

export default router
