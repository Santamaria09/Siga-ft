<script setup>
import { computed } from "vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  matriculaEstado: {
    type: String,
    default: "pendiente",
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

  // Menú condicional según el estado de matrícula
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
        'bg-white text-black min-h-screen transition-all duration-300 fixed inset-y-0 left-0 z-40',
        open ? 'w-64 translate-x-0' : 'w-0 -translate-x-full overflow-hidden',
      ]"
    >
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="bg-blue-900 flex items-center gap-2 drop-shadow p-2 rounded-xl">
          <i class="pi pi-graduation-cap text-white"></i>
          <h3 class="text-xs text-white">Complejo Educativo Hacienda Colima</h3>
        </div>
      </div>

      <!-- Navegación -->
      <nav class="mt-4 flex flex-col text-sm">
        <router-link
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="menu-item"
          @click="handleNavClick"
        >
          <div class="bg-white drop-shadow p-2 rounded-full">
            <i :class="item.icon + ' text-blue-500'"></i>
          </div>
          {{ item.title }}
        </router-link>
      </nav>

      <!-- Footer -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <router-link to="/" class="menu-item text-red-400 hover:bg-red-50" @click="handleNavClick">
          <i class="pi pi-sign-out"></i>
          Cerrar Sesión
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
