<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["cerrar", "save"]);

// NOTA: Idealmente estos catálogos deben cargarse desde la API 
// para asegurar que los IDs coincidan con la base de datos.
const listaDepartamentos = ref([
  { id: 1, nombre: "Chalatenango" },
  { id: 2, nombre: "San Salvador" }
]);

const listaMunicipios = ref({
  1: [
    { id: 101, nombre: "Chalatenango Sur" },
    { id: 102, nombre: "Chalatenango Norte" },
    { id: 103, nombre: "Chalatenango Centro" }
  ],
  2: [
    { id: 201, nombre: "San Salvador Centro" },
    { id: 202, nombre: "San Salvador Oeste" }
  ]
});

const listaDistritos = ref({
  102: [
    { id: 1001, nombre: "Citalá" },
    { id: 1002, nombre: "La Palma" },
    { id: 1003, nombre: "San Ignacio" }
  ],
  101: [
    { id: 1004, nombre: "Arcatao" },
    { id: 1005, nombre: "San José Las Flores" }
  ]
});

const estudiante = ref({
  nombres: "",
  nie: "",
  departamento_id: null,
  municipio_id: null,
  distrito_id: null,
  canton: "",
  telefono: "",
  correo: "",
  direccion: "",
  genero: ""
});

const todosLosDistritos = computed(() => {
  const distritosPlanos = [];
  for (const idMunicipio in listaDistritos.value) {
    listaDistritos.value[idMunicipio].forEach(distrito => {
      distritosPlanos.push({
        ...distrito,
        municipioPadreId: parseInt(idMunicipio)
      });
    });
  }
  return distritosPlanos.sort((a, b) => a.nombre.localeCompare(b.nombre));
});

const alCambiarDistrito = () => {
  const idDistritoSeleccionado = estudiante.value.distrito_id;
  
  if (!idDistritoSeleccionado) {
    estudiante.value.municipio_id = null;
    estudiante.value.departamento_id = null;
    return;
  }

  const distritoEncontrado = todosLosDistritos.value.find(d => d.id === idDistritoSeleccionado);
  
  if (distritoEncontrado) {
    estudiante.value.municipio_id = distritoEncontrado.municipioPadreId;

    for (const idDepto in listaMunicipios.value) {
      const perteneceAlDepto = listaMunicipios.value[idDepto].some(
        m => m.id === distritoEncontrado.municipioPadreId
      );
      
      if (perteneceAlDepto) {
        estudiante.value.departamento_id = parseInt(idDepto);
        break;
      }
    }
  }
};

const padreDesconocido = ref(false);
const madreDesconocida = ref(false);

const padre = ref({
  nombre: "",
  telefono: "",
  dui: "",
  correo: ""
});

const madre = ref({
  nombre: "",
  telefono: "",
  dui: "",
  correo: ""
});

const togglePadreDesconocido = () => {
  if (padreDesconocido.value) {
    padre.value = { nombre: "", telefono: "", dui: "", correo: "" };
  }
};

const toggleMadreDesconocida = () => {
  if (madreDesconocida.value) {
    madre.value = { nombre: "", telefono: "", dui: "", correo: "" };
  }
};

const guardarEstudiante = () => {
  if (
    !estudiante.value.nombres ||
    !estudiante.value.nie ||
    !estudiante.value.genero ||
    !estudiante.value.distrito_id
  ) {
    alert("Complete todos los campos obligatorios del estudiante.");
    return;
  }

  // Payload estructurado en snake_case para Laravel
  const payload = {
    ...estudiante.value,
    padre: padreDesconocido.value ? null : { ...padre.value },
    madre: madreDesconocida.value ? null : { ...madre.value },
    padre_desconocido: padreDesconocido.value,
    madre_desconocida: madreDesconocida.value
  };

  emit("save", payload);
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

      <!-- NIE -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          NIE
        </label>
        <input
          v-model="estudiante.nie"
          type="text"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Ingrese el NIE"
        />
      </div>

      <!-- Género -->
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

      <!-- Lugar de nacimiento (Distrito primero) -->
      <div>
        <h3 class="text-sm font-semibold text-gray-700 mb-3">
          Lugar de nacimiento
        </h3>
        <div class="grid md:grid-cols-3 gap-4">
          
          <!-- 1. Distrito (Primero en la línea) -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Distrito
            </label>
            <select
              v-model="estudiante.distrito_id"
              @change="alCambiarDistrito"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option :value="null">Seleccione...</option>
              <option
                v-for="distrito in todosLosDistritos"
                :key="distrito.id"
                :value="distrito.id"
              >
                {{ distrito.nombre }}
              </option>
            </select>
          </div>

          <!-- 2. Municipio (Read-only / Autocompletado) -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Municipio
            </label>
            <select
              v-model="estudiante.municipio_id"
              disabled
              class="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
            >
              <option :value="null">Seleccione...</option>
              <optgroup v-for="(municipios, idDepto) in listaMunicipios" :key="idDepto">
                <option v-for="municipio in municipios" :key="municipio.id" :value="municipio.id">
                  {{ municipio.nombre }}
                </option>
              </optgroup>
            </select>
          </div>

          <!-- 3. Departamento (Read-only / Autocompletado) -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Departamento
            </label>
            <select
              v-model="estudiante.departamento_id"
              disabled
              class="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
            >
              <option :value="null">Seleccione...</option>
              <option
                v-for="departamento in listaDepartamentos"
                :key="departamento.id"
                :value="departamento.id"
              >
                {{ departamento.nombre }}
              </option>
            </select>
          </div>

        </div>
      </div>

      <!-- Cantón -->
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

      <!-- Dirección -->
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

      <!-- Teléfono y Correo -->
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">
            Teléfono
          </label>
          <input
            v-model="estudiante.telefono"
            type="text"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Teléfono"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">
            Correo electrónico
          </label>
          <input
            v-model="estudiante.correo"
            type="email"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="ejemplo@correo.com"
          />
        </div>
      </div>

      <!-- Información de los padres -->
      <div class="border-t pt-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">
          Información de los padres
        </h3>

        <!-- Padre -->
        <div class="border rounded-lg p-4 space-y-4">
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="padreDesconocido"
              v-model="padreDesconocido"
              @change="togglePadreDesconocido"
            />
            <label for="padreDesconocido" class="text-sm font-medium text-gray-700 cursor-pointer">
              Padre desconocido
            </label>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-sm text-gray-600 mb-1">
                Nombre
              </label>
              <input
                v-model="padre.nombre"
                :disabled="padreDesconocido"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Nombre del padre"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">
                Teléfono
              </label>
              <input
                v-model="padre.telefono"
                :disabled="padreDesconocido"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Teléfono del padre"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">
                DUI
              </label>
              <input
                v-model="padre.dui"
                :disabled="padreDesconocido"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="DUI del padre"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">
                Correo electrónico
              </label>
              <input
                v-model="padre.correo"
                :disabled="padreDesconocido"
                type="email"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Correo del padre"
              />
            </div>
          </div>
        </div>

        <!-- Madre -->
        <div class="border rounded-lg p-4 space-y-4 mt-4">
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="madreDesconocida"
              v-model="madreDesconocida"
              @change="toggleMadreDesconocida"
            />
            <label for="madreDesconocida" class="text-sm font-medium text-gray-700 cursor-pointer">
              Madre desconocida
            </label>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-sm text-gray-600 mb-1">
                Nombre
              </label>
              <input
                v-model="madre.nombre"
                :disabled="madreDesconocida"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Nombre de la madre"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">
                Teléfono
              </label>
              <input
                v-model="madre.telefono"
                :disabled="madreDesconocida"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Teléfono de la madre"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">
                DUI
              </label>
              <input
                v-model="madre.dui"
                :disabled="madreDesconocida"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="DUI de la madre"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">
                Correo electrónico
              </label>
              <input
                v-model="madre.correo"
                :disabled="madreDesconocida"
                type="email"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Correo de la madre"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
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