<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold text-grey-darken-3">Panel de Pedidos</h1>
        <p class="text-body-1 text-grey-darken-1">Control de despachos en tiempo real</p>
      </v-col>
    </v-row>

    <v-card elevation="2" class="rounded-lg">
      <v-card-text class="bg-white pa-4">
        <v-row dense>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="search"
              label="Buscar por cliente o ID..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              bg-color="grey-lighten-5"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="filterStatus"
              :items="['Todos', 'Recibido', 'Preparando', 'En Camino', 'Entregado']"
              label="Filtrar por estado"
              variant="outlined"
              density="compact"
              hide-details
              bg-color="grey-lighten-5"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-text class="bg-grey-lighten-4 pa-4">
        <v-row v-if="!orderStore.loading">
          <v-col 
            v-for="order in filteredOrders" 
            :key="order.id" 
            cols="12" sm="6" md="4" lg="3"
          >
            <v-card class="order-card h-100" elevation="1" rounded="lg">
              <div class="pa-3 d-flex justify-space-between align-start">
                <div>
                  <div class="text-overline text-grey-darken-1 lh-1">ID: {{ order.id.slice(-6).toUpperCase() }}</div>
                  <div class="text-subtitle-1 font-weight-bold text-truncate" style="max-width: 150px;">
                    {{ order.cliente.nombre }}
                  </div>
                </div>
                <v-chip :color="getStatusColor(order.estado)" size="x-small" label class="font-weight-bold">
                  {{ order.estado }}
                </v-chip>
              </div>

              <v-divider />

              <v-card-text class="pa-3" style="min-height: 100px;">
                <div class="text-caption font-weight-bold text-primary mb-1">PRODUCTOS</div>
                <div v-for="(p, i) in order.productos" :key="i" class="text-caption d-flex justify-space-between">
                  <span class="text-truncate" style="max-width: 80%;">{{ p.cantidad }}x {{ p.nombre }}</span>
                  <span>${{ p.subtotal }}</span>
                </div>
              </v-card-text>

              <v-divider />

              <div class="pa-3 bg-white">
                <div class="d-flex justify-space-between align-center mb-3">
                  <span class="text-caption text-grey">Total a cobrar:</span>
                  <span class="text-subtitle-1 font-weight-black text-success">
                    ${{ order.resumen.total.toLocaleString() }}
                  </span>
                </div>

                <v-menu transition="scale-transition">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" block color="primary" variant="flat" size="small" append-icon="mdi-chevron-down">
                      Actualizar Estado
                    </v-btn>
                  </template>
                  <v-list density="compact">
                    <v-list-item 
                      v-for="status in ['Recibido', 'Preparando', 'En Camino', 'Entregado']" 
                      :key="status"
                      :value="status"
                      @click="orderStore.updateOrderStatus(order.id, status)"
                    >
                      <v-list-item-title class="text-caption">{{ status }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-card>
          </v-col>

          <v-col v-if="filteredOrders.length === 0" cols="12" class="text-center py-10">
            <v-icon size="64" color="grey-lighten-2">mdi-cart-off</v-icon>
            <div class="text-h6 text-grey mt-2">No se encontraron pedidos</div>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col v-for="n in 4" :key="n" cols="12" sm="6" md="3">
            <v-skeleton-loader type="card, list-item-two-line" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '../stores/useOrderStore'

const orderStore = useOrderStore()
const search = ref('')
const filterStatus = ref('Todos')

onMounted(() => {
  orderStore.fetchOrders()
})

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Recibido': 'info',
    'Preparando': 'warning',
    'En Camino': 'deep-purple',
    'Entregado': 'success'
  }
  return colors[status] || 'grey'
}

const filteredOrders = computed(() => {
  return orderStore.orders.filter(o => {
    const matchesSearch = o.cliente.nombre.toLowerCase().includes(search.value.toLowerCase()) ||
                          o.id.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = filterStatus.value === 'Todos' || o.estado === filterStatus.value
    return matchesSearch && matchesStatus
  })
})
</script>

<style scoped>
.order-card {
  transition: transform 0.2s;
  border: 1px solid #eee;
}
.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.05) !important;
}
</style>