<script setup>
import { storeToRefs } from "pinia";
import { useUiStore } from "@/stores/ui";
import SidebarCliente from "./SidebarCliente.vue";

const uiStore = useUiStore();
const { sidebarOpen } = storeToRefs(uiStore);

const clientName = "Cliente";

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <SidebarCliente
      :open="sidebarOpen"
      @close="uiStore.setSidebarOpen(false)"
    />

    <main
      :class="[
        'transition-all duration-300',
        sidebarOpen ? 'md:ml-64' : 'ml-0'
      ]"
    >
      <!-- Header -->
      <header
        class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30"
      >
        <div class="px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              @click="toggleSidebar"
              class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              <i
                :class="[
                  'text-xl',
                  sidebarOpen ? 'pi pi-times' : 'pi pi-bars'
                ]"
              ></i>
            </button>

            <h1 class="text-xl font-bold text-gray-800">
              Dashboard del Cliente
            </h1>
          </div>
        </div>
      </header>

      <div class="p-6 space-y-6">

        <section
          class="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl shadow-lg p-8"
        >
          <h2 class="text-3xl font-bold mb-2">
            ¡Bienvenido, {{ clientName }}!
          </h2>

          <p class="text-blue-100">
            Ha iniciado sesión correctamente. Utilice el menú lateral para
            acceder a las diferentes opciones disponibles del sistema.
          </p>
        </section>

        <section
          class="bg-white border-l-4 border-blue-600 rounded-xl shadow-sm p-5 flex gap-4"
        >
          <div
            class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"
          >
            <i class="pi pi-info-circle text-blue-600 text-xl"></i>
          </div>

          <div>
            <h3 class="font-semibold text-gray-800 mb-1">
              Información
            </h3>

            <p class="text-gray-600">
              Para comenzar, seleccione una opción del menú lateral. Desde allí
              podrá acceder a todas las funcionalidades disponibles según los
              permisos de su cuenta.
            </p>
          </div>
        </section>

      </div>
    </main>

    <div
      v-if="sidebarOpen"
      @click="toggleSidebar"
      class="md:hidden fixed inset-0 bg-black/30 z-30"
    ></div>
  </div>
</template>
