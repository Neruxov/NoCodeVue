
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/tasks/'
  },
  {
    path: '/task/:id',
    name: 'Task',
    component: () => import('../components/task.vue'),
    props: (route) => ({ id: Number(route.params.id) })
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('../components/tasks.vue')
  },
  {
    path: '/404',
    name: '404',
    redirect: '/tasks',
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

export default router
