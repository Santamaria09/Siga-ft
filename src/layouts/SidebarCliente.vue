<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";

const props = defineProps({
  open: { type: Boolean, default: false },
  matriculaEstado: { type: String, default: "pendiente" },
});

const emit = defineEmits(["close"]);
const authStore = useAuthStore();

const submenuAbierto = ref(null);
const isMobile = () => window.innerWidth < 768;

const handleNavClick = () => {
  if (!props.open) return;
  if (isMobile()) {
    emit("close");
  }
};

const toggleSubmenu = (titulo) => {
  submenuAbierto.value = submenuAbierto.value === titulo ? null : titulo;
};

// Función para obtener la inicial del email o nombre
const inicialUsuario = computed(() => {
  const email = authStore.user?.email || "U";
  return email.charAt(0).toUpperCase();
});

// Obtener nombre o correo dinámico del usuario autenticado
const nombreUsuario = computed(() => {
  return authStore.user?.email || "Usuario";
});

// Rol dinámico devuelto por Laravel
const rolUsuario = computed(() => {
  return authStore.userRole || "CLIENTE";
});

const cerrarSesion = () => {
  handleNavClick();
  authStore.logout();
};

const menuItems = computed(() => {
  const items = [
    { title: "Inicio", to: "/cliente/dashboard", icon: "pi pi-home" },
  ];

  if (props.matriculaEstado === "pendiente") {
    items.push({ title: "Registro de Estudiante", to: "/cliente/registro", icon: "pi pi-user-plus" });
    items.push({ title: "Solicitud de Matrícula", to: "/cliente/matricula", icon: "pi pi-file-plus" });
  }

  if (props.matriculaEstado === "aprobada") {
    items.push({ title: "Mi Perfil", to: "/cliente/perfil", icon: "pi pi-user" });
    items.push({ title: "Libreta de Notas", to: "/cliente/boleta", icon: "pi pi-file-edit" });
    items.push({ title: "Asignaturas", to: "/cliente/asignaturas", icon: "pi pi-check-circle" });
  }

  if (props.matriculaEstado === "rechazada") {
    items.push({ title: "Registro de Estudiante", to: "/cliente/registro", icon: "pi pi-user-plus" });
  }

  return items;
});
</script>

<template>
  <div>
    <div v-if="open" @click="handleNavClick" class="fixed inset-0 bg-black/40 z-30 md:hidden"></div>
    <aside
      :class="[
        'bg-white text-black min-h-screen transition-all duration-300 fixed inset-y-0 left-0 z-40 flex flex-col shadow-lg shadow-slate-200/60',
        open ? 'w-64 translate-x-0' : 'w-0 -translate-x-full overflow-hidden',
      ]"
    >
      <div class="p-6 border-b border-gray-200 shrink-0">
        <div class="bg-blue-900 flex items-center gap-2 drop-shadow p-2 rounded-xl">
          <i class="pi pi-graduation-cap text-white"></i>
          <h3 class="text-xs text-white whitespace-nowrap">Complejo Educativo <br /> Hacienda Colima</h3>
        </div>
      </div>

      <nav class="mt-4 flex-1 overflow-y-auto flex flex-col text-sm px-2">
        <div v-for="item in menuItems" :key="item.title">
          <router-link v-if="!item.submenu" :to="item.to" class="menu-item" @click="handleNavClick">
            <div class="bg-white drop-shadow p-2 rounded-full flex items-center justify-center">
              <i :class="item.icon + ' text-blue-500'"></i>
            </div>
            {{ item.title }}
          </router-link>

          <div v-else>
            <button type="button" class="menu-item w-full" @click="toggleSubmenu(item.title)">
              <div class="bg-white drop-shadow p-2 rounded-full flex items-center justify-center">
                <i :class="item.icon + ' text-blue-500'"></i>
              </div>
              <span class="flex-1 text-left">{{ item.title }}</span>
              <i :class="['pi text-xs text-blue-500', submenuAbierto === item.title ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>
            <div v-if="submenuAbierto === item.title" class="ml-6 flex flex-col">
              <router-link v-for="sub in item.submenu" :key="sub.to" :to="sub.to" class="submenu-item" @click="handleNavClick">{{ sub.title }}</router-link>
            </div>
          </div>
        </div>
      </nav>

      <!-- FOOTER CON USUARIO REAL Y CERRAR SESIÓN REAL -->
      <div class="mt-auto p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50/50 shrink-0">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-10 h-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm shadow-sm select-none shrink-0">
            {{ inicialUsuario }}
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-bold text-gray-900 truncate" :title="nombreUsuario">{{ nombreUsuario }}</p>
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{{ rolUsuario }}</p>
          </div>
        </div>

        <button
          @click="cerrarSesion"
          type="button"
          class="w-9 h-9 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
          title="Cerrar Sesión"
        >
          <i class="pi pi-sign-out text-sm"></i>
        </button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.menu-item { display: flex; align-items: center; gap: 10px; padding: 12px 20px; transition: all 0.2s; text-decoration: none; color: #2563eb; }
.menu-item:hover { border-radius: 999px; background: white; transform: translateX(4px); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); }
.router-link-active { border-radius: 999px; background: white; transform: translateX(4px); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08); }
.submenu-item { display: flex; align-items: center; padding: 10px 20px 10px 45px; color: #2563eb; text-decoration: none; font-size: 0.875rem; transition: all 0.2s; }
.submenu-item:hover { border-radius: 999px; background: white; transform: translateX(4px); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); }
.submenu-item.router-link-active { border-radius: 999px; background: white; transform: translateX(4px); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08); }
</style>