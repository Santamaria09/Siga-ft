<script setup>
import { ref, computed } from "vue";

// --- ESTADOS DE LA VISTA ---
const selectedTrimestre = ref("1");
const vistaActiva = ref("calificaciones");

const hijos = ref([
  { id: 1, nombre: "Juan Pérez", grado: "5° Primaria", seccion: "A", periodo: "2026" },
  { id: 2, nombre: "María Ruiz", grado: "3° Primaria", seccion: "B", periodo: "2026" },
]);

const hijoSeleccionadoId = ref(hijos.value[0].id);
const hijoSeleccionado = computed(
  () => hijos.value.find((h) => h.id === hijoSeleccionadoId.value) || hijos.value[0],
);

// --- DATOS ---
const calificaciones = ref([
  { asignatura: "Matemática", profesor: "Ing. María González", nota1: 8.5, nota2: 9.0, nota3: 8.8, promedio: 8.8, estado: "Aprobado" },
  { asignatura: "Ciencias Naturales", profesor: "Dra. Ana López", nota1: 7.5, nota2: 8.2, nota3: 9.1, promedio: 8.3, estado: "Aprobado" },
  { asignatura: "Estudio Sociales", profesor: "Lic. Carlos Ramírez", nota1: 8.5, nota2: 7.0, nota3: 6.8, promedio: 6.7, estado: "Reprobado" },
  { asignatura: "Lenguaje", profesor: "Lic. Carlos Ramírez", nota1: 6.5, nota2: 7.0, nota3: 6.3, promedio: 6.7, estado: "Reprobado" },
  { asignatura: "Inglés", profesor: "Lic. Patricia Ruiz", nota1: 9.5, nota2: 9.8, nota3: 10.0, promedio: 9.8, estado: "Aprobado" },
]);

const getNotaEstadoClass = (estado) => {
  return estado === "Aprobado" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
};

const conductaGeneral = ref([
  { descripcion: "Participa activamente en las actividades académicas.", calificacion: "Excelente" },
  { descripcion: "Demuestra respeto hacia compañeros y docentes.", calificacion: "Excelente" },
  { descripcion: "Cumple puntualmente con las tareas asignadas.", calificacion: "Bueno" },
  { descripcion: "Mantiene una actitud positiva frente a los desafíos.", calificacion: "Bueno" },
  { descripcion: "Respeta las normas de convivencia del reglamento.", calificacion: "Malo" },
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
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <main class="transition-all duration-300 flex flex-col">

      <div class="p-6 lg:p-8 flex-1">
        <!-- PESTAÑAS Y SELECTORES -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div class="flex gap-3 w-full lg:w-auto">
            <button
              @click="vistaActiva = 'calificaciones'"
              :class="['flex-1 lg:flex-none px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2 justify-center text-sm border', vistaActiva === 'calificaciones' ? 'bg-blue-900 text-white border-blue-900 shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400']"
            >
              <i class="pi pi-book"></i> Calificaciones
            </button>

            <button
              @click="vistaActiva = 'conducta'"
              :class="['flex-1 lg:flex-none px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2 justify-center text-sm border', vistaActiva === 'conducta' ? 'bg-blue-900 text-white border-blue-900 shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400']"
            >
              <i class="pi pi-users"></i> Conducta
            </button>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div class="relative w-full sm:w-80">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600">
                <i class="pi pi-user text-sm"></i>
              </div>
              <select
                v-model="hijoSeleccionadoId"
                class="w-full bg-gray-50 border border-gray-200 text-gray-800 font-bold text-sm rounded-xl pl-10 pr-10 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer appearance-none transition"
              >
                <option v-for="hijo in hijos" :key="hijo.id" :value="hijo.id">
                  {{ hijo.nombre }} ({{ hijo.grado }})
                </option>
              </select>
              <i class="pi pi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none"></i>
            </div>

            <select
              v-model="selectedTrimestre"
              class="w-full sm:w-auto border border-gray-200 text-gray-700 font-semibold rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm cursor-pointer text-sm"
            >
              <option value="1">Trimestre 1</option>
              <option value="2">Trimestre 2</option>
              <option value="3">Trimestre 3</option>
            </select>
          </div>
        </div>

        <!-- TABLA 1: CALIFICACIONES (REFACTORIZADA CON PRIMEVUE) -->
        <div v-if="vistaActiva === 'calificaciones'" class="animate-fade-in mb-8">
          <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <i class="pi pi-chart-bar text-blue-600"></i>
              </div>
              <h2 class="text-xl font-bold text-gray-800">Calificaciones por Asignatura</h2>
            </div>

            <div class="p-0">
              <DataTable :value="calificaciones" responsiveLayout="scroll" stripedRows class="p-datatable-sm w-full">
                <Column header="Asignatura">
                  <template #body="{ data }">
                    <p class="font-bold text-gray-800">{{ data.asignatura }}</p>
                    <p class="text-xs text-gray-500">{{ data.profesor }}</p>
                  </template>
                </Column>
                <Column field="nota1" header="Nota 30%" class="text-center text-gray-600 font-medium"></Column>
                <Column field="nota2" header="Nota 40%" class="text-center text-gray-600 font-medium"></Column>
                <Column field="nota3" header="Nota 30%" class="text-center text-gray-600 font-medium"></Column>
                <Column field="promedio" header="Promedio" class="text-center font-bold text-blue-600 text-lg"></Column>
                <Column header="Estado" class="text-center">
                  <template #body="{ data }">
                    <span class="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide" :class="getNotaEstadoClass(data.estado)">
                      {{ data.estado }}
                    </span>
                  </template>
                </Column>
              </DataTable>
            </div>
          </div>
        </div>

        <!-- TABLA 2: CONDUCTA (REFACTORIZADA CON PRIMEVUE) -->
        <div v-if="vistaActiva === 'conducta'" class="animate-fade-in mb-6">
          <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <i class="pi pi-star text-blue-600"></i>
              </div>
              <h2 class="text-xl font-bold text-gray-800">Evaluación de Conducta</h2>
            </div>

            <div class="p-0">
              <DataTable :value="conductaGeneral" responsiveLayout="scroll" stripedRows class="p-datatable-sm w-full">
                <Column field="descripcion" header="Descripción de Conducta" class="font-medium text-gray-700"></Column>
                <Column header="Calificación" class="text-center w-48">
                  <template #body="{ data }">
                    <span class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide" :class="getConductaClass(data.calificacion)">
                      {{ data.calificacion }}
                    </span>
                  </template>
                </Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #1e3a8a; /* bg-blue-900 */
  color: white;
  padding: 1rem 1.5rem;
}
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 1rem 1.5rem;
}
</style>