import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'
import { watch } from 'vue'

const routes: Array<RouteRecordRaw> = [
  { 
    path: '/login', 
    name: 'Login', 
    component: () => import('../views/Login.vue') 
  },
  { 
    path: '/', 
    name: 'Dashboard', 
    component: () => import('../views/Dashboard.vue'), 
    meta: { requiresAuth: true }
  },
  {
    path: '/pedidos',
    name: 'Pedidos',
    component: () => import('../views/OrdersView.vue'),
    meta: { title: 'Gestión de Pedidos' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ Mejora: Añadimos un tiempo límite (timeout) para evitar bloqueos eternos
const waitUntilLoaded = (authStore: any) => {
  return new Promise<void>((resolve) => {
    // Si ya no está cargando, resolvemos de inmediato
    if (!authStore.loading) return resolve()

    // Ponemos un límite de 5 segundos para que la app no muera
    const timeout = setTimeout(() => {
      console.warn("Auth timeout: Firebase tardó demasiado.");
      stop();
      resolve();
    }, 5000);
    
    const stop = watch(() => authStore.loading, (loading) => {
      if (!loading) {
        clearTimeout(timeout);
        stop();
        resolve();
      }
    })
  })
}

router.beforeEach(async (to) => {
  // 💡 Importante: Pinia debe estar instalado en main.ts antes que el router
  const authStore = useAuthStore()

  await waitUntilLoaded(authStore)

  const isLoggedIn = !!authStore.user
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // 1. Si la ruta requiere auth y no está logueado -> Login
  if (requiresAuth && !isLoggedIn) {
    return { name: 'Login' }
  }

  // 2. Si está logueado e intenta ir al Login -> Dashboard
  if (to.name === 'Login' && isLoggedIn) {
    return { name: 'Dashboard' }
  }
  
  // 3. De lo contrario, permite la navegación
  return true 
})

export default router