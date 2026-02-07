<template>
  <v-container fluid class="pa-6">
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">{{ title }}</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="(item, index) in stats"
        :key="index"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card variant="flat" class="border pa-4">
          <v-list-item class="px-0">
            <template v-slot:prepend v-if="item.icon">
              <v-icon :color="item.color" size="large" :icon="item.icon" class="mr-4"></v-icon>
            </template>
            <v-list-item-title class="text-overline mb-1">
              {{ item.label }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-h5 font-weight-bold text-high-emphasis">
              {{ item.value }}
            </v-list-item-subtitle>
          </v-list-item>
          
          <div v-if="item.trend" class="mt-2 text-caption">
            <span :class="item.trend > 0 ? 'text-success' : 'text-error'">
              {{ item.trend > 0 ? '▲' : '▼' }} {{ Math.abs(item.trend) }}%
            </span>
            <span class="text-medium-emphasis ml-1">vs last month</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12">
        <v-card variant="flat" class="border pa-6">
          <v-card-title class="px-0">{{ subtitle }}</v-card-title>
          <v-divider class="mb-4"></v-divider>
          <v-sheet
            height="200"
            color="grey-lighten-4"
            class="d-flex align-center justify-center border-dashed rounded-lg"
          >
            <span class="text-grey-darken-1 italic">
              <v-icon icon="mdi-chart-line" class="mr-2"></v-icon>
              Chart Placeholder
            </span>
          </v-sheet>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Definición de la interfaz para las estadísticas
interface StatItem {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
  trend?: number;
}

// Definición de Props con TypeScript
interface Props {
  title?: string;
  subtitle?: string;
  stats?: StatItem[];
}

// Valores por defecto (Datos "quemados" o placeholders)
const props = withDefaults(defineProps<Props>(), {
  title: 'Dashboard',
  subtitle: 'Recent Activity',
  stats: () => [
    { label: 'Total Users', value: '1,234', icon: 'mdi-account-group', color: 'primary', trend: 12 },
    { label: 'Revenue', value: '$45,678', icon: 'mdi-currency-usd', color: 'success', trend: 8 },
    { label: 'Orders', value: '456', icon: 'mdi-cart', color: 'info', trend: -3 },
    { label: 'Growth', value: '+12%', icon: 'mdi-trending-up', color: 'warning', trend: 12 },
  ]
});
</script>

<style scoped>
/* Con Vuetify 3, la mayoría del CSS manual desaparece 
   gracias a las utilidades (pa-6, text-h4, mb-6, etc.) 
*/
.border-dashed {
  border: 2px dashed #ccc !important;
}
</style>