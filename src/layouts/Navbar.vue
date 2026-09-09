<script setup>
const emit = defineEmits(["toggle-sidebar"]);

const user = {
  nombre: "Usuario",
  rol: "Cliente",
};

const toggleNavbar = () => {
  emit("toggle-sidebar");
};

const logout = () => {
  console.log("Cerrar sesión");
};
</script>

<template>
  <header
    class="sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-6 bg-white border-b border-slate-200 shadow-sm shrink-0"
  >
    <div class="flex items-center gap-3">
      <button
        @click="toggleNavbar"
        class="p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
        aria-label="Alternar menú"
      >
        <i class="pi pi-bars text-xl"></i>
      </button>

      <span class="text-lg font-bold text-slate-900"> CENTRO ESCOLAR HACIENDA COLIMA </span>
    </div>

    <div class="flex items-center gap-4">
      <div class="hidden sm:flex flex-col items-end leading-tight">
        <span class="text-sm font-medium text-slate-900">
          {{ user.nombre }}
        </span>

        <span class="text-xs text-slate-500">
          {{ user.rol }}
        </span>
      </div>

      <button
        @click="logout"
        class="p-2 rounded-md text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
      >
        <i class="pi pi-sign-out text-xl"></i>
      </button>
    </div>
  </header>
</template>
