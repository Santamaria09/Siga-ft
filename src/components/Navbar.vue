<script setup>

</script>

<template>
  <!-- Navbar -->
  <nav class="bg-white text-white shadow-lg fixed w-full z-50">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">

      <!-- Logo -->
      <router-link
        to="/"
        class="text-2xl text-black font-bold tracking-wide flex items-center gap-3"
      >
        <img
          src="https://static.vecteezy.com/system/resources/previews/003/224/489/original/education-logo-design-illustration-vector.jpg"
          alt="logo"
          class="w-10 h-10 rounded-full object-cover border-2 border-white"
        />

        <span class="leading-none">
          Complejo Educativo Hacienda Colima
        </span>
      </router-link>

      <!-- Desktop Menu -->
      <div class="hidden md:flex gap-8 items-center font-medium">

        <!-- Inicio -->
        <router-link
          to="/"
          class="bg-transparent text-blue-400 font-semibold transition flex items-center gap-2 focus:outline-none pb-2 border-b-2 border-transparent hover:border-blue-400"
        >
          Inicio
        </router-link>

        <!-- Institución Dropdown -->
        <div class="relative group inline-block">

          <button
            class="bg-transparent text-blue-400 font-semibold transition flex items-center gap-2 focus:outline-none pb-2 border-b-2 border-transparent hover:border-blue-400"
          >
            Institución
            <i class="pi pi-chevron-down text-xs"></i>
          </button>

          <div
            class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
          >

            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              Historia
            </a>

            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              Reglamento
            </a>

          </div>
        </div>

        <!-- Contacto Dropdown -->
        <div class="relative group inline-block">

          <button
            class="bg-transparent text-blue-400 font-semibold transition flex items-center gap-2 focus:outline-none pb-2 border-b-2 border-transparent hover:border-blue-400"
          >
            Contacto
            <i class="pi pi-chevron-down text-xs"></i>
          </button>

          <div
            class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
          >

            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              Ubicación
            </a>

            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              Correo
            </a>

            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              Teléfonos
            </a>

          </div>
        </div>
      </div>

      <!-- Mobile Button -->
      <router-link
        to="/login"
        class="ml-4 bg-blue-500 text-white px-5 py-2 rounded-xl font-semibold shadow-md hover:scale-105 hover:bg-blue-600 transition flex items-center gap-2"
      >
        <i class="pi pi-user"></i>
        Iniciar sesión
      </router-link>

    </div>

    <!-- Mobile Menu -->
    <transition name="slide">

      <div
        v-if="isOpen"
        class="md:hidden bg-white border-t border-gray-200 px-6 py-6 space-y-5 shadow-xl"
      >

        <!-- Inicio -->
        <router-link
          to="/"
          class="block text-gray-700 hover:text-blue-500 transition"
        >
          Inicio
        </router-link>

        <!-- Institución -->
        <div class="space-y-2">

          <p class="text-blue-400 font-semibold text-sm uppercase tracking-wider">
            Institución
          </p>

          <a
            href="#"
            class="block text-gray-700 hover:text-blue-500 transition pl-4"
          >
            Historia
          </a>

          <a
            href="#"
            class="block text-gray-700 hover:text-blue-500 transition pl-4"
          >
            Reglamento
          </a>

        </div>

        <!-- Contacto -->
        <div class="space-y-2">

          <p class="text-blue-400 font-semibold text-sm uppercase tracking-wider">
            Contacto
          </p>

          <a
            href="#"
            class="block text-gray-700 hover:text-blue-500 transition pl-4"
          >
            Ubicación
          </a>

          <a
            href="#"
            class="block text-gray-700 hover:text-blue-500 transition pl-4"
          >
            Correo
          </a>

          <a
            href="#"
            class="block text-gray-700 hover:text-blue-500 transition pl-4"
          >
            Teléfonos
          </a>

        </div>

        <!-- Mobile Login -->
        <router-link
          to="/login"
          class="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 hover:bg-blue-600 transition"
        >
          <i class="pi pi-user"></i>
          Iniciar sesión
        </router-link>

      </div>

    </transition>

  </nav>

  <!-- Space Navbar -->
  <div class="h-20"></div>
</template>

<script setup>
import { ref } from "vue";

const isOpen = ref(false);
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
