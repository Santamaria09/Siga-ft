<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useUiStore } from "@/stores/ui";
import SidebarCliente from "./SidebarCliente.vue";

const uiStore = useUiStore();
const { sidebarOpen } = storeToRefs(uiStore);

const hijos = ref([
  {
    id: 1,
    nombre: "Juan Pérez",
    grado: "5° Primaria",
    seccion: "A",
    periodo: "2026",
  },
  {
    id: 2,
    nombre: "María Ruiz",
    grado: "3° Primaria",
    seccion: "B",
    periodo: "2026",
  },
]);

const hijoSeleccionado = ref(hijos.value[0]);

const asignaturas = ref([
  {
    id: 1,
    nombre: "Matemáticas",
    profesor: "Ing. María González",
    color: "blue",
    icono: "pi-calculator",
  },
  {
    id: 2,
    nombre: "Lenguaje y Literatura",
    profesor: "Ing. María González",
    color: "amber",
    icono: "pi-book",
  },
  {
    id: 3,
    nombre: "Ciencias Naturales",
    profesor: "Ing. María González",
    color: "green",
    icono: "pi-lightbulb",
  },
  {
    id: 4,
    nombre: "Estudios Sociales",
    profesor: "Ing. María González",
    dia: "Martes, Viernes",
    color: "blue",
    icono: "pi-globe",
  },
  {
    id: 5,
    nombre: "Educación Física",
    profesor: "Prof. Laura Sánchez",
    dia: "Jueves",
    color: "red",
    icono: "pi-heart",
  },
  {
    id: 6,
    nombre: "Inglés",
    profesor: "Lic. Patricia Ruiz",
    color: "violet",
    icono: "pi-comments",
  },
]);

const getColorClasses = (color) => {
  const colors = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      from: "from-blue-400",
      to: "to-blue-600",
    },

    violet: {
      bg: "bg-violet-100",
      text: "text-violet-600",
      from: "from-violet-400",
      to: "to-violet-600",
    },

    amber: {
      bg: "bg-amber-100",
      text: "text-amber-600",
      from: "from-amber-400",
      to: "to-amber-600",
    },

    red: {
      bg: "bg-red-100",
      text: "text-red-600",
      from: "from-red-400",
      to: "to-red-600",
    },

    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      from: "from-green-400",
      to: "to-green-600",
    },
  };

  return colors[color] || colors.blue;
};

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <SidebarCliente :open="sidebarOpen" @close="uiStore.setSidebarOpen(false)" />

    <main :class="['transition-all duration-300', sidebarOpen ? 'md:ml-64' : 'ml-0']">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              @click="toggleSidebar"
              class="p-2 rounded-lg border border-transparent bg-white hover:bg-gray-100 transition text-gray-600"
            >
              <i :class="['text-xl', sidebarOpen ? 'pi pi-times' : 'pi pi-bars']"></i>
            </button>

            <h1 class="text-xl font-bold text-gray-800">Mis Asignaturas</h1>
          </div>
        </div>
      </header>

      <div class="p-6 lg:p-8">
        <div class="mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              v-for="hijo in hijos"
              :key="hijo.id"
              @click="hijoSeleccionado = hijo"
              :class="[
                'rounded-2xl p-4 transition text-left border w-full',
                hijoSeleccionado.id === hijo.id
                  ? 'bg-blue-900 text-white border-blue-900 shadow-lg'
                  : 'bg-white border-gray-200 hover:border-gray-500',
              ]"
            >
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    hijoSeleccionado.id === hijo.id ? 'bg-white/20' : 'bg-gray-100',
                  ]"
                >
                  <i class="pi pi-user"></i>
                </div>

                <div>
                  <h4 class="font-semibold">
                    {{ hijo.nombre }}
                  </h4>

                  <p
                    class="text-sm"
                    :class="hijoSeleccionado.id === hijo.id ? 'text-blue-100' : 'text-gray-500'"
                  >
                    {{ hijo.grado }} • {{ hijo.seccion }}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
            v-for="asignatura in asignaturas"
            :key="asignatura.id"
            class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden"
          >
            <div class="p-5">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div
                    :class="[
                      'w-12 h-12 rounded-lg flex items-center justify-center',
                      getColorClasses(asignatura.color).bg,
                      getColorClasses(asignatura.color).text,
                    ]"
                  >
                    <i :class="['pi', asignatura.icono, 'text-xl']"></i>
                  </div>

                  <div>
                    <h3 class="font-bold text-gray-800 text-lg">
                      {{ asignatura.nombre }}
                    </h3>

                    <p class="text-sm text-gray-500">Asignatura</p>
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <i class="pi pi-user text-gray-400 text-sm"></i>

                  <span class="text-sm text-gray-700">
                    {{ asignatura.profesor }}
                  </span>
                </div>
              </div>
            </div>

            <div
              :class="[
                'h-1 w-full bg-gradient-to-r',
                getColorClasses(asignatura.color).from,
                getColorClasses(asignatura.color).to,
              ]"
            ></div>
          </div>
        </div>
      </div>
    </main>

    <div
      v-if="sidebarOpen"
      @click="toggleSidebar"
      class="md:hidden fixed inset-0 bg-black/30 z-30"
    ></div>
  </div>
</template>
```
