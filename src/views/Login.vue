<template>
  <div class="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center px-4" style="background-image: url('https://img.freepik.com/vector-premium/educacion-distancia-linea-casa_108855-1365.jpg?w=2000');">
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

    <button @click="router.push('/')" class="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl transition-all duration-300 shadow-lg cursor-pointer">
      <i class="pi pi-arrow-left"></i>
      <span class="text-sm font-medium">Volver</span>
    </button>

    <div class="z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-10">
      <div class="flex flex-col items-center mb-8">
        <div class="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20 overflow-hidden">
          <img src="/LogoDefi.jpeg" alt="Logo" class="w-full h-full object-cover" />
        </div>
        <h1 class="text-3xl font-bold text-white mt-5">Bienvenido</h1>
        <p class="text-white/70 text-sm mt-2">Inicia sesión para continuar</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-white text-sm font-medium mb-2"> Email </label>
          <div class="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-md">
            <i class="pi pi-user text-white/70 mr-3"></i>
            <input v-model="email" type="email" placeholder="Ingrese su email" class="w-full bg-transparent border-transparent text-white placeholder-white/50 focus:outline-none" required />
          </div>
        </div>

        <div>
          <label class="block text-white text-sm font-medium mb-2"> Contraseña </label>
          <div class="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-md">
            <i class="pi pi-lock text-white/70 mr-3"></i>
            <input v-model="password" type="password" placeholder="********" class="w-full bg-transparent border-transparent text-white placeholder-white/50 focus:outline-none" required />
          </div>
        </div>

        <button type="submit" :disabled="loading" class="w-full bg-blue-500 border-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-xl hover:scale-105 transition-all duration-300">
          {{ loading ? 'Iniciando...' : 'Iniciar Sesión' }}
        </button>
      </form>

       <div class="mt-6 text-center">
        <p class="text-white/70 text-sm">¿No tienes Cuenta? 
        <button @click="router.push('/register')" class="bg-transparent border-none text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer">Registrarse</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

// 2. Instanciamos el store correcto
const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    Swal.fire({
      title: 'Datos Incompletos',
      text: 'Por favor complete todos los campos',
      icon: 'warning',
      confirmButtonColor: '#3b82f6'
    });
    return
  }

  loading.value = true
  try {
    // 3. Llamamos al login usando authStore en lugar de userStore
    await authStore.login(email.value, password.value)

    Swal.fire({
      title: '¡Bienvenido!',
      text: 'Inicio de sesión exitoso.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
    
    router.push({ name: 'dashboard-cliente' }) 

  } catch (error) {
    let mensajeError = 'Ocurrió un error al conectar con el servidor.';
    
    if (error.response) {
      if (error.response.status === 401) {
        mensajeError = 'Credenciales inválidas. Verifique su correo y contraseña.';
      } else if (error.response.data && error.response.data.message) {
        mensajeError = error.response.data.message;
      }
    }

    Swal.fire({
      title: 'Error de acceso',
      text: mensajeError,
      icon: 'error',
      confirmButtonColor: '#ef4444'
    });
  } finally {
    loading.value = false
  }
}
</script>