<script setup>
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useMatriculaStore } from "@/stores/matricula";
import Swal from 'sweetalert2';
import SelectorTipoMatricula from "@/modules/Cliente/SelectorTipoMatricula.vue";
import BusquedaEstudiante from "@/modules/Cliente/BusquedaEstudiante.vue";
import FichaDatosAcademicos from "@/modules/Cliente/FichaDatosAcademicos.vue";
import FichaEncargado from "@/modules/Cliente/FichaEncargado.vue";

const router = useRouter();
const matriculaStore = useMatriculaStore();
const {
  estadoMatricula,
  pestañaActiva,
  tipoMatricula,
  pasoAntiguo,
  estudianteSeleccionado,
  labelTipoMatricula,
  esNuevoIngreso,
  esAntiguoIngreso,
} = storeToRefs(matriculaStore);

const estiloTab = (pest) =>
  pestañaActiva.value === pest
    ? "border-blue-600 text-blue-600 font-bold bg-blue-50/50"
    : "border-transparent text-gray-500 hover:text-gray-750 hover:bg-gray-50";

const cancelarTodo = () => {
  matriculaStore.resetearTodo();
};

const confirmarMatricula = async () => {
  const datosEncargado =
    esAntiguoIngreso.value &&
    !matriculaStore.encargadoManual &&
    matriculaStore.encargadoSeleccionado
      ? matriculaStore.encargadoSeleccionado
      : matriculaStore.encargado;

  const payload = {
    tipo: tipoMatricula.value,
    estudiante: {
      ...matriculaStore.estudiante,
      foto: matriculaStore.fotoPreview || estudianteSeleccionado.value?.foto || "",
    },
    encargado: datosEncargado,
    salud: matriculaStore.salud,
    matriculaDetails: {
      gradoId: matriculaStore.gradoSelected,
      especialidad: matriculaStore.especialidadSelected,
      turnoId: matriculaStore.turnoSelected,
      repiteGrado: esAntiguoIngreso.value ? matriculaStore.repiteGrado : null,
    },
  };

  try {
    console.log("Enviando matrícula:", payload);
    // Aquí iría tu axios.post()
    
    await Swal.fire({
      title: "¡Matrícula Exitosa!",
      text: "La solicitud ha sido enviada para su revisión.",
      icon: "success",
      confirmButtonColor: "#16a34a"
    });
    
    matriculaStore.resetearTodo();
    router.push("/cliente/registro");
  } catch (error) {
    Swal.fire({
      title: "Error al procesar",
      text: "Hubo un problema al procesar la matrícula. Intente nuevamente.",
      icon: "error",
      confirmButtonColor: "#dc2626"
    });
  }
};
</script>

<template>
  <!-- Contenedor tipo "Tarjeta" que respeta los márgenes del Layout padre -->
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[85vh]">
    
   <!-- Header Limpio -->
<div class="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between">
  <h1 class="text-2xl font-bold text-gray-800">Ficha de Matrícula</h1>

  <span
    v-if="tipoMatricula"
    class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100"
  >
    {{ labelTipoMatricula }}
  </span>
</div>

    <!-- Contenido Principal -->
    <div class="p-6 flex-1 bg-gray-50/50">
      <div class="w-full max-w-5xl mx-auto">
        
        <!-- PASO 0: SELECCIÓN DE TIPO DE MATRÍCULA -->
        <SelectorTipoMatricula v-if="!tipoMatricula" />

        <!-- PASO 1 (Antiguo): BÚSQUEDA DE ESTUDIANTE -->
        <div v-else-if="esAntiguoIngreso && pasoAntiguo === 'busqueda'" class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <BusquedaEstudiante />
        </div>

        <!-- PASO 1+: FORMULARIO DE MATRÍCULA -->
        <div v-else class="animate-fade-in bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <!-- TABS -->
          <div class="flex border-b border-gray-200 bg-gray-50/50">
            <button
              @click="pestañaActiva = 'dato'"
              :class="[
                'flex-1 text-center py-4 text-sm font-semibold border-b-2 transition-all duration-200 outline-none',
                estiloTab('dato'),
              ]"
            >
              {{ esNuevoIngreso ? "Datos del Estudiante" : "Datos Académicos" }}
            </button>
            <button
              @click="pestañaActiva = 'encar'"
              :class="[
                'flex-1 text-center py-4 text-sm font-semibold border-b-2 transition-all duration-200 outline-none',
                estiloTab('encar'),
              ]"
            >
              Encargado
            </button>
          </div>

          <div class="p-6 w-full">
            <div v-if="pestañaActiva === 'dato'" class="animate-fade-in">
              <FichaDatosAcademicos />
            </div>
            <div v-if="pestañaActiva === 'encar'" class="animate-fade-in max-w-3xl mx-auto">
              <FichaEncargado />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer: Botones de Acción -->
    <div
      v-if="tipoMatricula"
      class="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between shrink-0"
    >
      <button
        @click="cancelarTodo"
        type="button"
        class="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium text-sm"
      >
        Cancelar Todo
      </button>
      
      <button
        v-if="
          (esNuevoIngreso && tipoMatricula) || (esAntiguoIngreso && pasoAntiguo === 'formulario')
        "
        @click="confirmarMatricula"
        type="button"
        class="px-8 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium shadow-sm flex items-center gap-2 text-sm"
      >
        Confirmar Matrícula
        <i class="pi pi-check"></i>
      </button>
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
