<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useUiStore } from "@/stores/ui";
import SidebarCliente from "./SidebarCliente.vue";

const uiStore = useUiStore();
const { sidebarOpen } = storeToRefs(uiStore);
const route = useRoute();
const router = useRouter();

const pestañaActiva = ref("dato");

const estudiante = ref({
  nombres: "",
  NIE: "",
});
const tipoMatricula = ref("");
const fotoEstudiante = ref(null);
const fotoPreview = ref("");
const gradoSelected = ref("");
const turnoSelected = ref("");
const repiteGrado = ref("");

// --- DATOS DEL ENCARGADO ---
const encargado = ref({
  nombres: "",
  dui: "",
  telefono: "",
  parentescoId: "",
});

const salud = ref({
  enfermedadId: "",
  discapacidadId: "",
  medicamentoId: "",
});

const parentescos = ref([]);
const grados = ref([]);
const turnos = ref([]);
const enfermedades = ref([]);
const discapacidades = ref([]);
const medicamentos = ref([]);
const estadoMatricula = ref("pendiente");

const onFotoChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  fotoEstudiante.value = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    fotoPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const estiloTab = (pest) => {
  return pestañaActiva.value === pest
    ? "border-blue-600 text-blue-600 font-bold bg-blue-50/50"
    : "border-transparent text-gray-500 hover:text-gray-750 hover:bg-gray-50";
};

const especialidadSelected = computed(() => {
  const gradoEncontrado = grados.value.find((g) => g.id === gradoSelected.value);
  if (!gradoEncontrado) return "";
  return gradoEncontrado.especialidad || gradoEncontrado.nivel || "";
});

const sincronizarDesdeRuta = () => {
  estudiante.value.nombres = route.query.estudiante || "";
  estudiante.value.NIE = route.query.NIE || "";
  tipoMatricula.value = route.query.tipo || "";
};

onMounted(async () => {
  sincronizarDesdeRuta();

  try {
    parentescos.value = [];
    grados.value = [];
    turnos.value = [];
    enfermedades.value = [];
    discapacidades.value = [];
    medicamentos.value = [];
  } catch (error) {
    console.error("Error cargando los catálogos:", error);
  }
});

watch(
  () => ({
    tipo: route.query.tipo,
    estudiante: route.query.estudiante,
    NIE: route.query.NIE,
  }),
  () => {
    sincronizarDesdeRuta();
  },
  { deep: true },
);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const confirmarMatricula = async () => {
  const payload = {
    encargado: encargado.value,
    estudiante: {
      ...estudiante.value,
      foto: fotoPreview.value,
    },
    matriculaDetails: {
      tipo: tipoMatricula.value,
      gradoId: gradoSelected.value,
      especialidad: especialidadSelected.value,
      turnoId: turnoSelected.value,
      repiteGrado: tipoMatricula.value === "antiguo" ? repiteGrado.value : null,
    },
    salud: salud.value,
  };

  try {
    console.log("Enviando matrícula:", payload);
    alert("Matrícula procesada exitosamente.");
    router.push("/cliente/registro");
  } catch (error) {
    alert("Hubo un error al procesar la matrícula.");
  }
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-100 md:flex">
    <SidebarCliente
      :open="sidebarOpen"
      :matriculaEstado="estadoMatricula"
      @close="uiStore.setSidebarOpen(false)"
    />

    <main
      :class="[
        'flex-1 transition-all duration-300 flex flex-col',
        sidebarOpen ? 'md:ml-64' : 'ml-0',
      ]"
    >
      <div class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              @click="toggleSidebar"
              class="p-2 rounded-lg border border-transparent bg-white hover:bg-gray-100 transition text-gray-600"
            >
              <i :class="['text-xl transition', sidebarOpen ? 'pi pi-times' : 'pi pi-bars']"></i>
            </button>
            <div>
              <h1 class="text-3xl font-bold text-gray-800">Ficha de Matrícula</h1>
            </div>
          </div>

          <span
            class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700"
          >
            {{ tipoMatricula === "antiguo" ? "Antiguo Ingreso" : "Nuevo Ingreso" }}
          </span>
        </div>
      </div>

      <div class="p-6 flex-1">
        <div class="w-full">
          <div class="flex border-b border-gray-200 bg-gray-50/50">
            <button
              @click="pestañaActiva = 'dato'"
              :class="[
                'flex-1 text-center py-4 text-sm font-semibold border-b-2 transition-all duration-200 outline-none',
                estiloTab('dato'),
              ]"
            >
              Datos Academicos
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

          <div class="p-8 w-full">
            <div
              v-if="pestañaActiva === 'dato'"
              class="animate-fade-in flex flex-col lg:flex-row gap-10"
            >
              <!-- Izquierda: Foto -->
              <div class="flex flex-col items-center text-center space-y-4 lg:w-1/3">
                <div
                  v-if="fotoPreview"
                  class="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0"
                >
                  <img :src="fotoPreview" class="w-full h-full object-cover" />
                </div>
                <div
                  v-else
                  class="w-40 h-40 rounded-full bg-gray-50 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 shadow-inner text-sm font-medium px-4"
                >
                  <i class="pi pi-camera text-4xl mb-2 text-gray-300"></i>
                  Añadir Foto
                </div>
                <div class="w-full">
                  <input
                    type="file"
                    accept="image/*"
                    @change="onFotoChange"
                    class="block w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer text-center"
                  />
                </div>
              </div>

              <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Nombre Completo del Estudiante</label
                  >
                  <input
                    v-model="estudiante.nombres"
                    type="text"
                    placeholder="Ingrese el nombre"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">NIE</label>
                  <input
                    v-model="estudiante.NIE"
                    type="text"
                    :disabled="tipoMatricula === 'antiguo'"
                    placeholder="Número de Identidad"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Grado a Matricular</label
                  >
                  <select
                    v-model="gradoSelected"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Seleccionar grado</option>
                    <option v-for="grado in grados" :key="grado.id" :value="grado.id">
                      {{ grado.nombre }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Especialidad / Nivel</label
                  >
                  <input
                    :value="especialidadSelected"
                    type="text"
                    disabled
                    placeholder="Automático según el grado"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Turno</label>
                  <select
                    v-model="turnoSelected"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Seleccionar turno</option>
                    <option v-for="turno in turnos" :key="turno.id" :value="turno.id">
                      {{ turno.nombre }}
                    </option>
                  </select>
                </div>

                <div v-if="tipoMatricula === 'antiguo'" class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >¿Repite el grado seleccionado?</label
                  >
                  <select
                    v-model="repiteGrado"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Seleccionar respuesta</option>
                    <option value="Sí">Sí, repite grado</option>
                    <option value="No">No, es nuevo en el grado</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >¿Padece alguna enfermedad?</label
                >
                <select
                  v-model="salud.enfermedadId"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Seleccione una opción</option>
                  <option v-for="enf in enfermedades" :key="enf.id" :value="enf.id">
                    {{ enf.nombre }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >¿Presenta alguna discapacidad?</label
                >
                <select
                  v-model="salud.discapacidadId"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Seleccione una opción</option>
                  <option v-for="disc in discapacidades" :key="disc.id" :value="disc.id">
                    {{ disc.nombre }}
                  </option>
                </select>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >¿Toma algún medicamento frecuente?</label
                >
                <select
                  v-model="salud.medicamentoId"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Seleccione una opción</option>
                  <option v-for="med in medicamentos" :key="med.id" :value="med.id">
                    {{ med.nombre }}
                  </option>
                </select>
              </div>
            </div>

            <div
              v-if="pestañaActiva === 'encar'"
              class="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto"
            >
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Nombre Completo del Responsable</label
                >
                <input
                  v-model="encargado.nombres"
                  type="text"
                  placeholder="Ej. María Elena López"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Parentesco con el Alumno</label
                >
                <select
                  v-model="encargado.parentescoId"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Seleccionar parentesco</option>
                  <option v-for="parent in parentescos" :key="parent.id" :value="parent.id">
                    {{ parent.nombre }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">DUI</label>
                <input
                  v-model="encargado.dui"
                  type="text"
                  placeholder="00000000-0"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Teléfono de Contacto</label
                >
                <input
                  v-model="encargado.telefono"
                  type="text"
                  placeholder="7000-0000"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div
            class="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between"
          >
            <button
              @click="router.push('/cliente/registro')"
              type="button"
              class="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium text-sm"
            >
              Cancelar Todo
            </button>

            <button
              @click="confirmarMatricula"
              type="button"
              class="px-8 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium shadow-sm flex items-center gap-2 text-sm"
            >
              Confirmar Matrícula
              <i class="pi pi-check"></i>
            </button>
          </div>
        </div>
      </div>
    </main>

    <div
      v-if="sidebarOpen"
      @click="toggleSidebar"
      class="md:hidden fixed inset-0 bg-black/30 z-20"
    ></div>
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
