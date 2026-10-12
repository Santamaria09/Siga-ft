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
        <h1 class="text-3xl font-bold text-white mt-5">Crear Cuenta</h1>
        <p class="text-white/70 text-sm mt-2">Completa tus datos para registrarte</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <!-- Input de Email -->
        <div>
          <label class="block text-white text-sm font-medium mb-2"> Email </label>
          <div class="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-md">
            <i class="pi pi-envelope text-white/70 mr-3"></i>
            <input v-model="form.email" type="email" placeholder="Ingrese su correo" class="w-full bg-transparent border-transparent text-white placeholder-white/50 focus:outline-none" required />
          </div>
        </div>

        <!-- Input de Contraseña -->
        <div>
          <label class="block text-white text-sm font-medium mb-2"> Contraseña </label>
          <div class="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-md">
            <i class="pi pi-lock text-white/70 mr-3"></i>
            <input v-model="form.password" type="password" placeholder="Mínimo 8 caracteres" class="w-full bg-transparent border-transparent text-white placeholder-white/50 focus:outline-none" required minlength="8" />
          </div>
        </div>

        <!-- Confirmar Contraseña (Buena práctica de UX) -->
        <div>
          <label class="block text-white text-sm font-medium mb-2"> Confirmar Contraseña </label>
          <div class="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-md">
            <i class="pi pi-check-circle text-white/70 mr-3"></i>
            <input v-model="form.password_confirmation" type="password" placeholder="Repita la contraseña" class="w-full bg-transparent border-transparent text-white placeholder-white/50 focus:outline-none" required minlength="8" />
          </div>
        </div>

        <button type="submit" :disabled="loading" class="w-full bg-blue-500 border-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 cursor-pointer">
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>
      </form>
      
      <!-- Enlace para ir al Login si ya tiene cuenta -->
      <div class="mt-6 text-center">
        <p class="text-white/70 text-sm">¿Ya tienes cuenta? 
        <button @click="router.push('/login')" class="bg-transparent border-none text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer">Inicia Sesión</button>
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

const authStore = useAuthStore()
const router = useRouter()

// Estructura que exige tu backend
const form = ref({
  email: '',
  password: '',
  password_confirmation: '',
  rol: 'CLIENTE' // Envíado automáticamente por seguridad
})

const loading = ref(false)

const handleRegister = async () => {
  // 1. Validaciones básicas de Front-end
  if (!form.value.email || !form.value.password || !form.value.password_confirmation) {
    Swal.fire({
      title: 'Datos Incompletos',
      text: 'Por favor complete todos los campos',
      icon: 'warning',
      confirmButtonColor: '#3b82f6'
    });
    return
  }

  if (form.value.password !== form.value.password_confirmation) {
    Swal.fire({
      title: 'Las contraseñas no coinciden',
      text: 'Asegúrese de escribir la misma contraseña en ambos campos',
      icon: 'error',
      confirmButtonColor: '#ef4444'
    });
    return
  }

  loading.value = true

  try {
    // 2. Llamada al Store (Asegúrate de tener este método creado en authStore.js)
    await authStore.register({
      email: form.value.email,
      password: form.value.password,
      rol: form.value.rol
    })

    // 3. Éxito
    Swal.fire({
      title: '¡Cuenta Creada!',
      text: 'Te has registrado correctamente.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
    
    // Tu controlador de Laravel hace un auto-login y devuelve el token, 
    // así que lo podemos mandar directamente al dashboard
    router.push({ name: 'dashboard-cliente' }) 

  } catch (error) {
    let mensajeError = 'Ocurrió un error al conectar con el servidor.';
    
    // Capturamos el error 422 de Laravel si el correo ya existe
    if (error.response && error.response.status === 422) {
      const apiErrors = error.response.data;
      const primerError = Object.keys(apiErrors)[0];
      mensajeError = apiErrors[primerError][0];
    } else if (error.response && error.response.data.message) {
      mensajeError = error.response.data.message;
    }

    Swal.fire({
      title: 'Error de registro',
      text: mensajeError,
      icon: 'error',
      confirmButtonColor: '#ef4444'
    });
  } finally {
    loading.value = false
  }
}
</script>