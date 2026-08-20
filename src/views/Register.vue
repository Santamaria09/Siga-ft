<template>
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center px-4 relative"
    style="
      background-image: url('https://img.freepik.com/vector-premium/educacion-distancia-linea-casa_108855-1365.jpg?w=2000');
    "
  >
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
    
    <button
      @click="router.push('/')"
      class="absolute top-6 left-6 z-10 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl transition-all duration-300 shadow-lg cursor-pointer"
    >
      <i class="pi pi-arrow-left"></i>
      <span class="text-sm font-medium">Volver</span>
    </button>

    <div
      class="relative w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-10"
    >
      <div class="flex flex-col items-center mb-8">
        <div
          class="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20 overflow-hidden"
        >
          <img
            src="/LogoDefi.jpeg"
            alt="Logo"
            class="w-full h-full object-cover"
          />
        </div>

        <h1 class="text-3xl font-bold text-white mt-5">Validar Identidad</h1>
        <p class="text-white/70 text-sm mt-2 text-center">Ingrese su número de DUI para iniciar el trámite</p>
      </div>

      <div v-if="errorMessage" class="mb-5 p-3 text-sm text-red-200 bg-red-500/30 border border-red-500/40 rounded-xl backdrop-blur-md text-center">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="block text-white text-sm font-medium mb-2"> DUI </label>

          <div
            class="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-md"
          >
            <i class="pi pi-id-card text-white/70 mr-3"></i>

            <input
              type="text"
              v-model="duiForm"
              placeholder="00000000-0"
              class="w-full bg-transparent border-transparent text-white placeholder-white/50 focus:outline-none"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-500 border border-blue-600 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 cursor-pointer"
        >
          {{ loading ? "Validando..." : "Ingresar" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' 
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const duiForm = ref('')
const loading = ref(false)
const errorMessage = ref(null)

const handleRegister = async () => {
  const formatoDuiRegex = /^\d{8}-\d{1}$/
  if (!formatoDuiRegex.test(duiForm.value)) {
    errorMessage.value = "El formato del DUI debe ser 00000000-0"
    return
  }

  loading.value = true
  errorMessage.value = null

  try {
    await authStore.validarDui({ dui: duiForm.value })
  } catch (err) {
    if (err.response && err.response.status === 422) {
      const apiErrors = err.response.data?.errors
      errorMessage.value = apiErrors?.dui ? apiErrors.dui[0] : "El DUI ingresado no es válido."
    } else {
      errorMessage.value = "Ocurrió un error de conexión al validar el DUI. Intente nuevamente."
    }
  } finally {
    loading.value = false
  }
}
</script>