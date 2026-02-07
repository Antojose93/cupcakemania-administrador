<template>
  <v-app>
    <!-- SIDEBAR -->
    <v-navigation-drawer
      v-model="drawer"
      :temporary="mobile"
      :permanent="!mobile"
      elevation="3"
      class="bg-white"
    >
      <!-- LOGO / BRAND -->
      <v-list-item class="px-4 py-4">
        <template #prepend>
          <v-avatar color="primary" variant="tonal">
            <v-icon>mdi-truck-fast</v-icon>
          </v-avatar>
        </template>

        <v-list-item-title class="text-h6 font-weight-bold">
          Distrinnovar
        </v-list-item-title>
        <v-list-item-subtitle class="text-caption">
          Gestión de pedidos
        </v-list-item-subtitle>
      </v-list-item>

      <v-divider />

      <!-- MENU -->
      <v-list nav density="comfortable">
        <v-list-subheader>Operación</v-list-subheader>

        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          rounded="lg"
          active-class="bg-primary text-white"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>

          <!-- Badges opcionales -->
          <template #append v-if="item.badge">
            <v-chip
              size="x-small"
              color="primary"
              variant="flat"
            >
              {{ item.badge }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>

      <template #append>
        <v-divider />
        <div class="pa-4 text-center text-caption text-medium-emphasis">
          OrderFlow v1.0.0
        </div>
      </template>
    </v-navigation-drawer>

    <!-- TOP BAR -->
    <v-app-bar elevation="1" color="white">
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-toolbar-title class="font-weight-bold text-primary">
        {{ currentTitle }}
      </v-toolbar-title>

      <v-spacer />


      <!-- FECHA -->
      <v-chip
        class="mr-3 d-none d-md-flex"
        variant="outlined"
        color="primary"
      >
        <v-icon start>mdi-calendar</v-icon>
        {{ currentDate }}
      </v-chip>

      <!-- NOTIFICACIONES -->
      <v-btn icon>
        <v-badge color="error" dot>
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>

      <!-- USUARIO -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-avatar color="primary" variant="tonal">
              <v-icon>mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-list width="220">
          <v-list-item>
            <v-list-item-title class="font-weight-medium">
              Antonio Hurtado
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption">
              Administrador
            </v-list-item-subtitle>
          </v-list-item>

          <v-divider />

          <v-list-item prepend-icon="mdi-logout" @click="logout">
            <v-list-item-title class="text-error">
              Cerrar sesión
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- MAIN -->
    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="pa-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '../stores/useAuthStore'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const { mobile } = useDisplay()

const drawer = ref(!mobile.value)

watch(mobile, (isMobile) => {
  drawer.value = !isMobile
})

const menuItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/' },
  { title: 'Pedidos', icon: 'mdi-receipt-text', to: '/pedidos', badge: '?' },
  // { title: 'Clientes', icon: 'mdi-account-multiple', to: '/customers' },
  // { title: 'Inventario', icon: 'mdi-warehouse', to: '/inventory' },
  // { title: 'Despachos', icon: 'mdi-truck-delivery', to: '/shipments' },
  // { title: 'Reportes', icon: 'mdi-chart-line', to: '/reports' },
]

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

const currentTitle = computed(() => {
  return menuItems.find(i => i.to === route.path)?.title || 'Distrinnovar'
})

const currentDate = computed(() =>
  new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
)
</script>
