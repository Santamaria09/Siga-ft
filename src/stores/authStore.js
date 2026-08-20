import { defineStore } from 'pinia'
import api from '@/services/api'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    validacion: null, 
    duiActual: null,
    esNuevoUsuario: false 
  }),

  getters: {
    isVerified: (state) => !!state.validacion
  },

  actions: {
    async validarDui(payload) {
const { data } = await api.post('/registrado', payload)
      this.validacion = data.registro 
      this.duiActual = payload.dui
      this.esNuevoUsuario = data.esNuevo

      router.push('/cliente/dashboard')
    },

    limpiarValidacion() {
      this.validacion = null
      this.duiActual = null
      this.esNuevoUsuario = false
      router.push('/register') 
    }
  }
})