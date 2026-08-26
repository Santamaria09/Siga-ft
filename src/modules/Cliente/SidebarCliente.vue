<script setup>
import { computed } from "vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  matriculaEstado: {
    type: String,
    default: "aprobada",
  },
});

const emit = defineEmits(["close"]);

const isMobile = () => window.innerWidth < 768;

const handleMenuClick = () => {
  if (!props.open) return;
  if (isMobile()) {
    emit("close");
  }
};

const handleNavClick = () => {
  if (!props.open) return;
  if (isMobile()) {
    emit("close");
  }
};

const menuItems = computed(() => {
  const items = [
    { title: "Inicio", to: "/cliente/dashboard", icon: "pi pi-home" },
  ];

  if (props.matriculaEstado === "pendiente") {
    items.push({
      title: "Registro de Estudiante",
      to: "/cliente/registro",
      icon: "pi pi-user-plus",
    });
    items.push({
      title: "Solicitud de Matrícula",
      to: "/cliente/matricula",
      icon: "pi pi-file-plus",
    });
    items.push({ title: "Avisos", to: "/cliente/avisos", icon: "pi pi-book" });
  }

  if (props.matriculaEstado === "aprobada") {
    items.push({ title: "Mi Perfil", to: "/cliente/perfil", icon: "pi pi-user" });
    items.push({ title: "Libreta de Notas", to: "/cliente/boleta", icon: "pi pi-file-edit" });
    items.push({ title: "Asignaturas", to: "/cliente/asignaturas", icon: "pi pi-check-circle" });
    items.push({ title: "Avisos", to: "/cliente/avisos", icon: "pi pi-book" });
  }

  if (props.matriculaEstado === "rechazada") {
    items.push({
      title: "Registro de Estudiante",
      to: "/cliente/registro",
      icon: "pi pi-user-plus",
    });
    items.push({ title: "Avisos", to: "/cliente/avisos", icon: "pi pi-book" });
  }

  return items;
});
</script>

<template>
  <div>
    <div
      v-if="open"
      @click="handleMenuClick"
      class="fixed inset-0 bg-black/40 z-30 md:hidden"
    ></div>

    <aside
      :class="[
        'bg-white text-black min-h-screen transition-all duration-300 fixed inset-y-0 left-0 z-40 flex flex-col',
        open ? 'w-64 translate-x-0' : 'w-0 -translate-x-full overflow-hidden',
      ]"
    >
      <!-- Header del Sidebar -->
      <div class="p-6 border-b border-gray-200">
        <div class="bg-blue-900 flex items-center gap-2 drop-shadow p-2 rounded-xl">
          <i class="pi pi-graduation-cap text-white"></i>
          <h3 class="text-xs text-white">Complejo Educativo Hacienda Colima</h3>
        </div>
      </div>

      <!-- Navegación Principal -->
      <nav class="mt-4 flex-1 overflow-y-auto flex flex-col text-sm px-2">
        <router-link
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="menu-item"
          @click="handleNavClick"
        >
          <div class="bg-white drop-shadow p-2 rounded-full flex items-center justify-center">
            <i :class="item.icon + ' text-blue-500'"></i>
          </div>
          {{ item.title }}
        </router-link>
      </nav>

      <!-- Footer del Sidebar (Perfil de Encargado y Salida) -->
      <div class="mt-auto p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50/50">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-10 h-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm shadow-sm select-none shrink-0">
            E
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-bold text-gray-900 truncate">Elena Ruiz</p>
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Encargado</p>
          </div>
        </div>

        <router-link 
          to="/login" 
          class="w-9 h-9 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors shrink-0"
          title="Cerrar Sesión"
          @click="handleNavClick"
        >
          <i class="pi pi-sign-out text-sm"></i>
        </router-link>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  transition: all 0.2s;
  text-decoration: none;
  color: #2563eb;
}

.menu-item:hover {
  border-radius: 999px;
  background: white;
  transform: translateX(4px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.router-link-active {
  border-radius: 999px;
  background: white;
  transform: translateX(4px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}
</style>