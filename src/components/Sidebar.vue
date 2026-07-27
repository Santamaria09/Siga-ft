<template>
  <aside
    :class="[
      'bg-slate-900 text-gray-200 w-64 min-h-screen fixed md:relative z-40 transition-transform duration-300',

      open ? 'translate-x-0' : '-translate-x-full',

      !isMobile && open ? 'md:translate-x-0' : '',
    ]"
  >
    <div class="p-6 border-b border-gray-700">
      <div class="flex items-center gap-3">
        <div class="bg-blue-600 p-2 rounded">
          <i class="pi pi-shield text-white"></i>
        </div>

        <h2 class="font-bold text-lg">Shop-App</h2>
      </div>
    </div>

    <nav class="mt-4 flex flex-col text-sm">
      <router-link
        to="/admin/dashboard"
        class="menu-item"
        @click="$emit('navigate')"
      >
        <i class="pi pi-home"></i>
        Inicio
      </router-link>

      <router-link
        to="/admin/catalogos"
        class="menu-item"
        @click="$emit('navigate')"
      >
        <i class="pi pi-book"></i>
        Catálogos
      </router-link>

      <router-link
        to="/admin/productos"
        class="menu-item"
        @click="$emit('navigate')"
      >
        <i class="pi pi-box"></i>
        Productos
      </router-link>

      <router-link
        to="/admin/ordenes"
        class="menu-item"
        @click="$emit('navigate')"
      >
        <i class="pi pi-shopping-cart"></i>
        Órdenes
      </router-link>

      <router-link
        to="/admin/usuarios"
        class="menu-item"
        @click="$emit('navigate')"
      >
        <i class="pi pi-users"></i>
        Usuarios
      </router-link>

      <router-link
        to="/admin/reportes"
        class="menu-item"
        @click="$emit('navigate')"
      >
        <i class="pi pi-chart-bar"></i>
        Reportes
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
defineProps({
  open: Boolean,
  isMobile: Boolean,
});
</script>

<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  transition: all 0.2s;
}

.menu-item:hover {
  background: #1e293b;
}

.router-link-active {
  background: #2563eb;
  color: white;
}
</style>
