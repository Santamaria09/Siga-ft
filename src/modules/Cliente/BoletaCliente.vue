<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useUiStore } from "@/stores/ui";
import SidebarCliente from "./SidebarCliente.vue";

const uiStore = useUiStore();
const { sidebarOpen } = storeToRefs(uiStore);
const selectedTrimestre = ref("1");

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
const calificaciones = ref([
  {
    asignatura: "Matemática",
    profesor: "Ing. María González",
    nota1: 8.5,
    nota2: 9.0,
    nota3: 8.8,
    promedio: 8.8,
    estado: "Aprobado",
  },
  {
    asignatura: "Ciencias Naturales",
    profesor: "Dra. Ana López",
    nota1: 7.5,
    nota2: 8.2,
    nota3: 9.1,
    promedio: 8.3,
    estado: "Aprobado",
  },
  {
    asignatura: "Estudio Sociales",
    profesor: "Lic. Carlos Ramírez",
    nota1: 8.5,
    nota2: 7.0,
    nota3: 6.8,
    promedio: 6.7,
    estado: "Desaprobado",
  },
  {
    asignatura: "Lenguaje",
    profesor: "Lic. Carlos Ramírez",
    nota1: 6.5,
    nota2: 7.0,
    nota3: 6.3,
    promedio: 6.7,
    estado: "Desaprobado",
  },
  {
    asignatura: "Inglés",
    profesor: "Lic. Patricia Ruiz",
    nota1: 9.5,
    nota2: 9.8,
    nota3: 10.0,
    promedio: 9.8,
    estado: "Aprobado",
  },
]);

const getNotaEstadoClass = (estado) => {
  return estado === "Aprobado" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
};

// Datos de conducta general
const conductaGeneral = ref([
  {
    descripcion: "Participa activamente en las actividades académicas y extracurriculares.",
    calificacion: "Excelente",
  },
  {
    descripcion: "Demuestra respeto hacia compañeros, docentes y personal de la institución.",
    calificacion: "Excelente",
  },
  {
    descripcion: "Cumple puntualmente con las tareas y responsabilidades asignadas.",
    calificacion: "Bueno",
  },
  {
    descripcion: "Muestra interés por aprender y mejorar continuamente su rendimiento académico.",
    calificacion: "Excelente",
  },
  {
    descripcion: "Mantiene una actitud positiva frente a los desafíos y dificultades.",
    calificacion: "Bueno",
  },
  {
    descripcion: "Respeta las normas de convivencia y el reglamento interno de la institución.",
    calificacion: "Malo",
  },
]);

const getConductaClass = (calificacion) => {
  return (
    {
      Excelente: "bg-green-100 text-green-700",
      Bueno: "bg-blue-100 text-blue-700",
      Malo: "bg-yellow-100 text-yellow-700",
    }[calificacion] || "bg-gray-100 text-gray-700"
  );
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

            <h1 class="text-xl font-bold text-gray-800">Libreta del Estudiante</h1>
          </div>
        </div>
      </header>

      <!-- Contenido -->
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

        <div class="flex items-center p-4 gap-2">
          <select
            v-model="selectedTrimestre"
            class="border border-gray-300 rounded-lg px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">Trimestre 1</option>
            <option value="2">Trimestre 2</option>
            <option value="3">Trimestre 3</option>
          </select>
        </div>

        <!-- TABLA CALIFICACIONES -->
        <div class="mb-8">
          <div class="bg-white rounded-2xl shadow-md overflow-hidden">
            <div class="p-6 border-b">
              <h2 class="text-xl font-semibold text-gray-800">Calificaciones por Asignatura</h2>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-blue-900 text-white">
                  <tr>
                    <th class="px-6 py-4 text-left">Asignatura</th>

                    <th class="px-6 py-4 text-center">Nota 30%</th>

                    <th class="px-6 py-4 text-center">Nota 40%</th>

                    <th class="px-6 py-4 text-center">Nota 30%</th>

                    <th class="px-6 py-4 text-center">Promedio</th>

                    <th class="px-6 py-4 text-center">Estado</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(calificacion, index) in calificaciones"
                    :key="index"
                    class="hover:bg-gray-50 transition"
                  >
                    <td class="px-6 py-4 font-medium text-gray-800">
                      {{ calificacion.asignatura }}
                    </td>

                    <td class="px-6 py-4 text-center">
                      {{ calificacion.nota1 }}
                    </td>

                    <td class="px-6 py-4 text-center">
                      {{ calificacion.nota2 }}
                    </td>

                    <td class="px-6 py-4 text-center">
                      {{ calificacion.nota3 }}
                    </td>

                    <td class="px-6 py-4 text-center font-bold text-blue-600">
                      {{ calificacion.promedio }}
                    </td>

                    <td class="px-6 py-4 text-center">
                      <span
                        class="px-3 py-1 rounded-full text-sm font-medium"
                        :class="getNotaEstadoClass(calificacion.estado)"
                      >
                        {{ calificacion.estado }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <div class="bg-white rounded-2xl shadow-md overflow-hidden">
            <div class="p-6 border-b">
              <h2 class="text-xl font-semibold text-gray-800">
                Evaluación de Conducta - Ciclo Escolar
              </h2>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-blue-900 text-white">
                  <tr>
                    <th class="px-6 py-4 text-left">Descripción de Conducta</th>

                    <th class="px-6 py-4 text-center">Calificación</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(conducta, index) in conductaGeneral"
                    :key="index"
                    class="hover:bg-gray-50 transition"
                  >
                    <td class="px-6 py-4 font-medium text-gray-800">
                      {{ conducta.descripcion }}
                    </td>

                    <td class="px-3 py-4 text-center">
                      <span
                        class="px-3 py-1 rounded-full text-sm font-medium"
                        :class="getConductaClass(conducta.calificacion)"
                      >
                        {{ conducta.calificacion }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Overlay móvil -->
    <div
      v-if="sidebarOpen"
      @click="toggleSidebar"
      class="md:hidden fixed inset-0 bg-black/30 z-30"
    ></div>
  </div>
</template>
