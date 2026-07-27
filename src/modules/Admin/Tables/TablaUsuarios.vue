<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUiStore } from "@/stores/ui";
import SidebarAdmin from "../SidebarAdmin.vue";
import FormUser from "../Forms/Usuarios.vue";

const uiStore = useUiStore();
const { sidebarOpen } = storeToRefs(uiStore);
const activeSection = ref("Usuarios");
const search = ref("");
const verForm = ref(false);

const toggleSidebar = () => {
  uiStore.toggleSidebar();
};

const cerrarModal = () => {
  verForm.value = false;
};

const usuarios = ref([
  {
    id: 1,
    nombre: "María López",
    correo: "maria@escuela.com",
    password: "********",
    dui: "12345678-9",
    rol: "Administrador",
  },
  {
    id: 2,
    nombre: "Carlos Pérez",
    correo: "carlos@escuela.com",
    password: "********",
    dui: "98765432-1",
    rol: "Profesor",
  },
  {
    id: 3,
    nombre: "Ana Ruiz",
    correo: "ana@escuela.com",
    password: "********",
    dui: "45678912-3",
    rol: "Cliente",
  },
]);

const filteredUsuarios = computed(() =>
  usuarios.value.filter((u) => u.nombre.toLowerCase().includes(search.value.toLowerCase())),
);

const tabClass = (name) => [
  "px-8 py-3 rounded-t-[24px] border border-transparent font-semibold text-lg transition-all duration-200",
  activeSection.value === name
    ? "bg-white text-slate-900 relative z-20 -mb-[2px]"
    : "bg-slate-200 text-slate-600 hover:bg-slate-300",
];
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
    <SidebarAdmin :open="sidebarOpen" @close="uiStore.setSidebarOpen(false)" />

    <main :class="['transition-all duration-300 p-6', sidebarOpen ? 'md:ml-64' : 'ml-0']">
      <header class="mb-6">
        <div class="flex items-center gap-4">
          <button
            @click="toggleSidebar"
            class="p-2 rounded-lg border border-transparent bg-transparent hover:bg-slate-200 transition"
          >
            <i :class="sidebarOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-xl"></i>
          </button>

          <div>
            <h1 class="text-4xl font-bold text-slate-900">Usuarios</h1>

            <p class="text-slate-500 mt-2">Gestión de usuarios y roles.</p>
          </div>
        </div>
      </header>

      <nav class="flex gap-4 mb-0">
        <button :class="tabClass('Usuarios')" @click="activeSection = 'Usuarios'">
          Todos los usuarios
        </button>
      </nav>

      <div class="bg-white rounded-b-3xl rounded-r-3xl shadow-xl p-6 overflow-hidden">
        <section v-if="activeSection === 'Usuarios'">
          <div class="flex items-center gap-4 mb-6">
            <input
              v-model="search"
              type="text"
              placeholder="Buscar usuario..."
              class="w-full max-w-sm h-11 px-4 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
            />

            <button
              @click="verForm = true"
              class="ml-auto h-11 px-5 rounded-lg bg-blue-600 border border-transparent text-white font-semibold hover:bg-blue-700 transition"
            >
              + Crear Usuario
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr>
                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">
                    Nombre
                  </th>

                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">
                    Correo
                  </th>

                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">
                    Contraseña
                  </th>

                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">DUI</th>

                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">Rol</th>

                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="usuario in filteredUsuarios" :key="usuario.id">
                  <td class="px-4 py-4 border-b border-slate-200">
                    {{ usuario.nombre }}
                  </td>

                  <td class="px-4 py-4 border-b border-slate-200">
                    {{ usuario.correo }}
                  </td>

                  <td class="px-4 py-4 border-b border-slate-200">
                    {{ usuario.password }}
                  </td>

                  <td class="px-4 py-4 border-b border-slate-200">
                    {{ usuario.dui }}
                  </td>

                  <td class="px-4 py-4 border-b border-slate-200">
                    <span
                      class="px-3 py-1 rounded-full text-sm font-medium"
                      :class="{
                        'bg-red-100 text-red-700': usuario.rol === 'Administrador',
                        'bg-blue-100 text-blue-700': usuario.rol === 'Profesor',
                        'bg-green-100 text-green-700': usuario.rol === 'Cliente',
                      }"
                    >
                      {{ usuario.rol }}
                    </span>
                  </td>

                  <td class="px-6 py-4">
                    <div class="flex justify-center gap-3">
                      <button
                        class="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition"
                      >
                        <i class="pi pi-pencil"></i>
                        Editar
                      </button>

                      <button
                        class="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition"
                      >
                        <i class="pi pi-trash"></i>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <FormUser v-if="verForm" @cerrar="cerrarModal" />
        </section>
      </div>
    </main>
  </div>
</template>
