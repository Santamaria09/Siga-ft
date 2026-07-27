<template>
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
    style="
      background-image: url('https://img.freepik.com/vector-premium/educacion-distancia-linea-casa_108855-1365.jpg?w=2000');
    "
  >
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

    <!-- Register Card -->
    <div
      class="relative w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-10"
    >
      <!-- Logo -->
      <div class="flex flex-col items-center mb-8">
        <div
          class="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20 overflow-hidden"
        >
          <img
            src="/public/LogoDefi.jpeg"
            alt="Logo"
            class="w-full h-full object-cover"
          />
        </div>

        <h1 class="text-3xl font-bold text-white mt-5">Crear Usuario</h1>

        <p class="text-white/70 text-sm mt-2">Completa los campos para registrarte</p>
      </div>

      <!-- Form -->
      <form class="space-y-5">
        <!-- Nombre -->
        <div>
          <label class="block text-white text-sm font-medium mb-2"> Nombre </label>

          <div
            class="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-md"
          >
            <i class="pi pi-user text-white/70 mr-3"></i>

            <input
              type="text"
              placeholder="Ingrese su nombre"
              class="w-full bg-transparent border-transparent text-white placeholder-white/50 focus:outline-none"
              required
            />
          </div>
        </div>

        <!-- DUI -->
        <div>
          <label class="block text-white text-sm font-medium mb-2"> DUI </label>

          <div
            class="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-md"
          >
            <i class="pi pi-id-card text-white/70 mr-3"></i>

            <input
              type="text"
              placeholder="00000000-0"
              class="w-full bg-transparent border border-transparent text-white placeholder-white/50 focus:outline-none"
              required
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-white text-sm font-medium mb-2"> Email </label>

          <div
            class="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-md"
          >
            <i class="pi pi-envelope text-white/70 mr-3"></i>

            <input
              type="email"
              placeholder="correo@gmail.com"
              class="w-full bg-transparent border border-transparent text-white placeholder-white/50 focus:outline-none"
              required
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-white text-sm font-medium mb-2"> Contraseña </label>

          <div
            class="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-md"
          >
            <i class="pi pi-lock text-white/70 mr-3"></i>

            <input
              type="password"
              placeholder="********"
              class="w-full bg-transparent border border-transparent text-white placeholder-white/50 focus:outline-none"
              required
            />
          </div>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-white text-sm font-medium mb-2"> Confirmar Contraseña </label>

          <div
            class="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-md"
          >
            <i class="pi pi-lock text-white/70 mr-3"></i>

            <input
              type="password"
              placeholder="********"
              class="w-full bg-transparent border border-transparent text-white placeholder-white/50 focus:outline-none"
              required
            />
          </div>
        </div>

        <!-- Button -->
        <button
          type="submit"
          class="w-full bg-blue-500 border border-blue-600 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-xl hover:scale-105 transition-all duration-300"
        >
          Registrarse
        </button>
      </form>

      <!-- Footer -->
      <p class="text-center text-white/70 text-sm mt-6">
        ¿Ya tienes cuenta?

        <button
          class="text-white font-semibold hover:underline bg-transparent border-0 cursor-pointer"
        >
          Iniciar sesión
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
const goToLogin = () => {}
const validateDUI = () => {}
const handleRegister = () => {}
</script>
