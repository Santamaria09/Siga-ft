<script setup>
import { ref, onMounted, computed } from "vue";
//import axios from "axios";

const emit = defineEmits(["cerrar", "save"]);

const estudiante = ref({
  nombres: "",
  NIE: "",
  departamentoId: null,
  municipioId: null,
  distritoId: null,
  canton: null,
  telefono: "",
  correo: "",
  direccion: "",
  genero: ""
});

const distritos = ref([]);
const departamentoNombre = ref("");
const municipioNombre = ref("");

const filtroTexto = ref("");
const mostrarSugerencias = ref(false);

const distritosFiltrados = computed(() => {
  if (!filtroTexto.value) return [];
  return distritos.value.filter(d =>
    d.nombre.toLowerCase().includes(filtroTexto.value.toLowerCase())
  );
});

onMounted(async () => {
  await cargarDistritos();
});

const cargarDistritos = async () => {
  try {
    const { data } = await axios.get("/api/distritos");
    distritos.value = data;
  } catch (error) {
    console.error(error);
  }
};

const seleccionarDistrito = async (distrito) => {
  filtroTexto.value = distrito.nombre;
  estudiante.value.distritoId = distrito.id;
  mostrarSugerencias.value = false;

  try {
    const { data } = await axios.get(
      `/api/distritos/${estudiante.value.distritoId}/ubicacion`
    );

    // Asignación de tus atributos originales
    estudiante.value.departamentoId = data.departamento.id;
    estudiante.value.municipioId = data.municipio.id;
    estudiante.value.distritoId = data.distrito.id;

    departamentoNombre.value = data.departamento.nombre;
    municipioNombre.value = data.municipio.nombre;

  } catch (error) {
    console.error(error);
  }
};

// Limpia el estado si el usuario borra por completo el buscador
const verificarLimpieza = () => {
  if (!filtroTexto.value) {
    estudiante.value.distritoId = null;
    estudiante.value.departamentoId = null;
    estudiante.value.municipioId = null;
    departamentoNombre.value = "";
    municipioNombre.value = "";
  }
};

const guardarEstudiante = () => {
  if (
    !estudiante.value.nombres ||
    !estudiante.value.NIE ||
    !estudiante.value.genero ||
    !estudiante.value.distritoId
  ) {
    alert("Complete todos los campos obligatorios.");
    return;
  }

  emit("save", {
    ...estudiante.value
  });
};

const cancelar = () => {
  emit("cerrar");
};
</script>

<template>
  <div class="w-full">
    <form @submit.prevent="guardarEstudiante" class="space-y-6">

      <!-- Nombre completo -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Nombre completo
        </label>
        <input
          v-model="estudiante.nombres"
          type="text"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Ingrese el nombre completo"
        />
      </div>

      <!-- Lugar de nacimiento -->
      <div>
        <h3 class="text-sm font-semibold text-gray-700 mb-3">
          Lugar de nacimiento
        </h3>

        <div class="grid md:grid-cols-3 gap-4">

          <!-- Buscador de Distrito con Autocompletado -->
          <div class="relative">
            <label class="text-sm text-gray-600">
              Distrito
            </label>
            <input
              v-model="filtroTexto"
              type="text"
              @input="verificarLimpieza"
              @focus="mostrarSugerencias = true"
              @blur="setTimeout(() => mostrarSugerencias = false, 200)"
              class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Escribe el distrito..."
            />
            <ul
              v-if="mostrarSugerencias && distritosFiltrados.length > 0"
              class="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg"
            >
              <li
                v-for="distrito in distritosFiltrados"
                :key="distrito.id"
                @mousedown="seleccionarDistrito(distrito)"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {{ distrito.nombre }}
              </li>
            </ul>
          </div>

          <div>
            <label class="text-sm text-gray-600">
              Municipio
            </label>
            <input
              :value="municipioNombre"
              readonly
              class="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-100"
              placeholder="Automático"
            />
          </div>

          <div>
            <label class="text-sm text-gray-600">
              Departamento
            </label>
            <input
              :value="departamentoNombre"
              readonly
              class="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-100"
              placeholder="Automático"
            />
          </div>

        </div>
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">
          Cantón
        </label>
        <textarea
          v-model="estudiante.canton"
          rows="2"
          class="w-full px-4 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Escriba el cantón o caserío correspondiente..."
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">
          Correo electrónico
        </label>
        <input
          v-model="estudiante.correo"
          type="email"
          class="w-full px-4 py-2 border rounded-lg"
          placeholder="ejemplo@correo.com"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">
          Dirección
        </label>
        <textarea
          v-model="estudiante.direccion"
          rows="3"
          class="w-full px-4 py-2 border rounded-lg resize-none"
          placeholder="Ingrese la dirección completa"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Género
        </label>
        <div class="flex gap-8">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="M"
              v-model="estudiante.genero"
            />
            Masculino
          </label>

          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="F"
              v-model="estudiante.genero"
            />
            Femenino
          </label>
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-4">
        <button
          type="button"
          @click="cancelar"
          class="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancelar
        </button>

        <button
          type="submit"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Guardar estudiante
        </button>
      </div>

    </form>
  </div>
</template>
