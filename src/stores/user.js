import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(null)

  const setUser = (userData, tokenData) => {
    user.value = userData
    token.value = tokenData
  }

  const clearUser = () => {
    user.value = null
    token.value = null
  }

  return { user, token, setUser, clearUser }
})