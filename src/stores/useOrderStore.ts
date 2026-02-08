// src/stores/useOrderStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../firebase' 
import { collection, query, onSnapshot, doc, updateDoc, orderBy } from 'firebase/firestore'

export const useOrderStore = defineStore('orders', () => {
  const orders = ref<any[]>([])
  const loading = ref(true)

  const fetchOrders = () => {
    loading.value = true
    const q = query(collection(db, 'pedidos'), orderBy('fecha', 'desc'))
    
    // Suscripción en tiempo real
    return onSnapshot(q, (snapshot) => {
      orders.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      loading.value = false
    }, (error) => {
      console.error("Error consultando pedidos: ", error)
      loading.value = false
    })
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'pedidos', orderId)
      await updateDoc(orderRef, { estado: newStatus })
    } catch (error) {
      console.error("Error al actualizar estado:", error)
    }
  }

  return { orders, loading, fetchOrders, updateOrderStatus }
})