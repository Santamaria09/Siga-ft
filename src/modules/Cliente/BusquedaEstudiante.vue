<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useMatriculaStore } from "@/stores/matricula";

const matriculaStore = useMatriculaStore();
const { estudiantesDemo } = storeToRefs(matriculaStore);

const nieBusqueda = ref("");
const resultadosBusqueda = ref([]);

const buscarEstudiante = () => {
  const termino = nieBusqueda.value.trim().toLowerCase();
  
  if (!termino) {
    resultadosBusqueda.value = [];
    return;
  }
  
  resultadosBusqueda.value = estudiantesDemo.value.filter(
    (e) => e.NIE.toLowerCase().includes(termino)
  );
};

const seleccionarEstudiante = (estudiante) => {
  matriculaStore.seleccionarEstudiante(estudiante);
};

const volverASeleccionTipo = () => {
  matriculaStore.tipoMatricula = "";
  matriculaStore.pasoAntiguo = "busqueda";
};

const hasBusqueda = computed(() => nieBusqueda.value.trim().length > 0);
</script>

<template>
  <div class="animate-fade-in max-w-2xl mx-auto">
    <div class="flex items-center gap-4 mb-6">
      <button
        @click="volverASeleccionTipo"
        class="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-gray-600"
      >
        <i class="pi pi-arrow-left text-xl"></i>
      </button>
      <h2 class="text-xl font-semibold text-gray-800">Buscar Estudiante</h2>
    </div>

    <p class="text-gray-500 text-sm mb-6">
      Ingresa el NIE del estudiante que deseas matricular en el nuevo ciclo.
    </p>

    <div class="flex gap-3 mb-6">
      <input
        v-model="nieBusqueda"
        @keyup.enter="buscarEstudiante"
        type="text"
        placeholder="Número de Identidad (NIE)"
        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <button
        @click="buscarEstudiante"
        class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
      >
        <i class="pi pi-search"></i>
        Buscar
      </button>
    </div>

    <div v-if="resultadosBusqueda.length > 0" class="space-y-3">
      <div
        v-for="est in resultadosBusqueda"
        :key="est.id"
        @click="seleccionarEstudiante(est)"
        class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition flex items-center gap-4"
      >
        <div
          class="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden"
        >
          <img v-if="est.foto" :src="est.foto" class="w-full h-full object-cover" />
          <i v-else class="pi pi-user text-xl text-gray-400"></i>
        </div>
        <div class="flex-1">
          <p class="font-medium text-gray-800">{{ est.nombres }}</p>
          <p class="text-sm text-gray-500">NIE: {{ est.NIE }}</p>
          <p class="text-xs text-gray-400">
            Grados actuales: {{ est.gradoActual }} - {{ est.turnoActual }}
          </p>
        </div>
        <i class="pi pi-chevron-right text-gray-400"></i>
      </div>
    </div>

    <div
      v-else-if="hasBusqueda && !resultadosBusqueda.length"
      class="text-center py-8 text-gray-400"
    >
      <i class="pi pi-search text-3xl mb-2"></i>
      <p>No se encontraron estudiantes con el NIE ingresado.</p>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>