<script setup>
import { ref, computed } from "vue";
import Swal from 'sweetalert2';
import api from '@/services/api'; // Importamos axios para conectar al backend

const emit = defineEmits(["cerrar", "save"]);

// ==========================================
// 1. LÓGICA DE UBICACIÓN (Intacta)
// ==========================================
const listaDepartamentos = ref([{ id: 1, nombre: "Chalatenango" }, { id: 2, nombre: "San Salvador" }]);
const listaMunicipios = ref({
  1: [{ id: 101, nombre: "Chalatenango Sur" }, { id: 102, nombre: "Chalatenango Norte" }, { id: 103, nombre: "Chalatenango Centro" }],
  2: [{ id: 201, nombre: "San Salvador Centro" }, { id: 202, nombre: "San Salvador Oeste" }]
});
const listaDistritos = ref({
  102: [{ id: 1001, nombre: "Citalá" }, { id: 1002, nombre: "La Palma" }, { id: 1003, nombre: "San Ignacio" }],
  101: [{ id: 1004, nombre: "Arcatao" }, { id: 1005, nombre: "San José Las Flores" }]
});

const estudiante = ref({
  nombres: "", nie: "", departamento_id: null, municipio_id: null,
  distrito_id: null, canton: "", telefono: "", correo: "", direccion: "", genero: ""
});

const todosLosDistritos = computed(() => {
  const distritosPlanos = [];
  for (const idMunicipio in listaDistritos.value) {
    listaDistritos.value[idMunicipio].forEach(distrito => {
      distritosPlanos.push({ ...distrito, municipioPadreId: parseInt(idMunicipio) });
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
      const perteneceAlDepto = listaMunicipios.value[idDepto].some(m => m.id === distritoEncontrado.municipioPadreId);
      if (perteneceAlDepto) {
        estudiante.value.departamento_id = parseInt(idDepto);
        break;
      }
    }
  }
};

const busquedaDistrito = ref("");
const mostrarDropdownDistrito = ref(false);

const distritosFiltrados = computed(() => {
  if (!busquedaDistrito.value) return todosLosDistritos.value;
  const busqueda = busquedaDistrito.value.toLowerCase();
  return todosLosDistritos.value.filter(d => d.nombre.toLowerCase().includes(busqueda));
});

const seleccionarDistrito = (distrito) => {
  estudiante.value.distrito_id = distrito.id;
  busquedaDistrito.value = distrito.nombre; 
  mostrarDropdownDistrito.value = false; 
  alCambiarDistrito(); 
};

const verificarInputDistrito = () => {
  if (busquedaDistrito.value === "") {
    estudiante.value.distrito_id = null;
    alCambiarDistrito();
  }
};

// ==========================================
// 2. LÓGICA DE PADRES Y BÚSQUEDA
// ==========================================
const padreDesconocido = ref(false);
const madreDesconocida = ref(false);

// Inputs de búsqueda
const duiPadreBuscado = ref("");
const duiMadreBuscada = ref("");

// Resultados de búsqueda (Objetos de la base de datos)
const padreEncontrado = ref(null);
const madreEncontrada = ref(null);

// Manejo de errores y estado de carga
const errorPadre = ref("");
const errorMadre = ref("");
const cargandoPadre = ref(false);
const cargandoMadre = ref(false);

// Método genérico para buscar por DUI en el backend
const buscarPorDui = async (tipo) => {
  const dui = tipo === 'padre' ? duiPadreBuscado.value : duiMadreBuscada.value;
  if (!dui) return;

  const errorRef = tipo === 'padre' ? errorPadre : errorMadre;
  const resultRef = tipo === 'padre' ? padreEncontrado : madreEncontrada;
  const loadingRef = tipo === 'padre' ? cargandoPadre : cargandoMadre;

  loadingRef.value = true;
  errorRef.value = "";
  resultRef.value = null;

  try {
    const response = await api.post('/padres/buscar-dui', { dui });
    if (response.data && response.data.padre) {
      resultRef.value = response.data.padre;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorRef.value = "DUI incorrecto o padre no registrado.";
    } else {
      errorRef.value = "Error al conectar con el servidor.";
    }
  } finally {
    loadingRef.value = false;
  }
};

const limpiarPadre = (tipo) => {
  if (tipo === 'padre') {
    padreEncontrado.value = null;
    duiPadreBuscado.value = "";
  } else {
    madreEncontrada.value = null;
    duiMadreBuscada.value = "";
  }
};

// ==========================================
// 3. LÓGICA DEL MODAL DE REGISTRO
// ==========================================
const mostrarModalRegistroPadre = ref(false);
const tipoRegistroActivo = ref(""); // Para saber si estamos registrando "Padre" o "Madre"
const nuevoPadreForm = ref({ nombre: "", relacion: "Padre", dui: "", telefono: "", correo: "" });
const guardandoNuevoPadre = ref(false);

const abrirModalPadre = (tipo) => {
  tipoRegistroActivo.value = tipo;
  nuevoPadreForm.value = {
    nombre: "",
    relacion: tipo === 'padre' ? 'Padre' : 'Madre',
    dui: tipo === 'padre' ? duiPadreBuscado.value : duiMadreBuscada.value, // Autocompleta el DUI buscado
    telefono: "",
    correo: "",
    es_encargado: false // Asumimos false por defecto
  };
  mostrarModalRegistroPadre.value = true;
};

const guardarNuevoPadreBD = async () => {
  guardandoNuevoPadre.value = true;
  try {
    const payload = {
      nombre: nuevoPadreForm.value.nombre,
      dui: nuevoPadreForm.value.dui,
      telefono: nuevoPadreForm.value.telefono,
      email: nuevoPadreForm.value.correo,
      es_encargado: nuevoPadreForm.value.es_encargado
    };

    // Petición al controlador que creamos en los pasos anteriores
    const res = await api.post('/padres', payload);

    if (res.data && res.data.padre) {
      // Si fue exitoso, cerramos el modal y asignamos automáticamente al padre creado
      if (tipoRegistroActivo.value === 'padre') {
        padreEncontrado.value = res.data.padre;
        duiPadreBuscado.value = res.data.padre.dui;
        errorPadre.value = "";
      } else {
        madreEncontrada.value = res.data.padre;
        duiMadreBuscada.value = res.data.padre.dui;
        errorMadre.value = "";
      }
      mostrarModalRegistroPadre.value = false;
      Swal.fire({ icon: 'success', title: 'Registrado', text: 'El padre fue registrado correctamente.', timer: 1500, showConfirmButton: false });
    }
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Error al guardar el padre.' });
  } finally {
    guardandoNuevoPadre.value = false;
  }
};

// ==========================================
// 4. GUARDAR ESTUDIANTE
// ==========================================
const guardarEstudiante = () => {
  if (!estudiante.value.nombres || !estudiante.value.nie || !estudiante.value.genero || !estudiante.value.distrito_id) {
    Swal.fire({ title: 'Campos incompletos', text: 'Por favor, complete todos los campos obligatorios.', icon: 'warning', confirmButtonColor: '#2563eb' });
    return;
  }

  // Preparamos el payload incluyendo los IDs de los padres si fueron encontrados
  const payload = {
    ...estudiante.value,
    padre_id: padreDesconocido.value ? null : padreEncontrado.value?.id,
    madre_id: madreDesconocida.value ? null : madreEncontrada.value?.id,
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
  <div class="w-full relative">
    <form @submit.prevent="guardarEstudiante" class="space-y-6">
      
      <!-- Campos de estudiante (Intactos) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
        <input v-model="estudiante.nombres" type="text" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ingrese el nombre completo" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Género</label>
        <div class="flex gap-8">
          <label class="flex items-center gap-2 cursor-pointer"><input type="radio" value="M" v-model="estudiante.genero" /> Masculino</label>
          <label class="flex items-center gap-2 cursor-pointer"><input type="radio" value="F" v-model="estudiante.genero" /> Femenino</label>
        </div>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Lugar de nacimiento</h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="relative">
            <label class="block text-sm text-gray-600 mb-1">Distrito</label>
            <div class="relative">
              <input type="text" v-model="busquedaDistrito" @focus="mostrarDropdownDistrito = true" @blur="setTimeout(() => mostrarDropdownDistrito = false, 200)" @input="verificarInputDistrito" placeholder="Buscar distrito..." class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10" />
              <i class="pi pi-search absolute right-3 top-3 text-gray-400"></i>
            </div>
            <ul v-if="mostrarDropdownDistrito" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
              <li v-for="distrito in distritosFiltrados" :key="distrito.id" @click="seleccionarDistrito(distrito)" class="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 transition">{{ distrito.nombre }}</li>
              <li v-if="distritosFiltrados.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">No se encontraron resultados</li>
            </ul>
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Municipio</label>
            <select v-model="estudiante.municipio_id" disabled class="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed outline-none">
              <option :value="null">Seleccione...</option>
              <optgroup v-for="(municipios, idDepto) in listaMunicipios" :key="idDepto">
                <option v-for="municipio in municipios" :key="municipio.id" :value="municipio.id">{{ municipio.nombre }}</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Departamento</label>
            <select v-model="estudiante.departamento_id" disabled class="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed outline-none">
              <option :value="null">Seleccione...</option>
              <option v-for="departamento in listaDepartamentos" :key="departamento.id" :value="departamento.id">{{ departamento.nombre }}</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">Cantón</label>
        <textarea v-model="estudiante.canton" rows="2" class="w-full px-4 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Escriba el cantón o caserío correspondiente..." />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">Dirección</label>
        <textarea v-model="estudiante.direccion" rows="3" class="w-full px-4 py-2 border rounded-lg resize-none" placeholder="Ingrese la dirección completa" />
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Teléfono</label>
          <input v-model="estudiante.telefono" type="text" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Teléfono" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Correo electrónico</label>
          <input v-model="estudiante.correo" type="email" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ejemplo@correo.com" />
        </div>
      </div>
      <!-- ===================================== -->
      <!-- NUEVA SECCIÓN DE PADRES -->
      <!-- ===================================== -->
      <div class="border-t pt-6 mt-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-4 flex justify-between items-center">Información de los padres</h3>
        
        <!-- SECCIÓN PADRE -->
        <div class="border rounded-xl p-5 mb-4 bg-gray-50/50">
          <div class="flex items-center gap-2 mb-4">
            <input type="checkbox" id="padreDesconocido" v-model="padreDesconocido" class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            <label for="padreDesconocido" class="text-sm font-bold text-gray-700 cursor-pointer">Padre desconocido</label>
          </div>
          
          <div v-if="!padreDesconocido" class="animate-fade-in">
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar Padre por DUI</label>
            
            <!-- Modo Buscador -->
            <div v-if="!padreEncontrado" class="flex gap-2">
              <input v-model="duiPadreBuscado" type="text" placeholder="00000000-0" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm" />
              <button type="button" @click="buscarPorDui('padre')" :disabled="cargandoPadre" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50">
                <i :class="cargandoPadre ? 'pi pi-spin pi-spinner' : 'pi pi-search'"></i>
              </button>
              <button type="button" @click="abrirModalPadre('padre')" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition" title="Registrar nuevo padre">
                <i class="pi pi-user-plus"></i>
              </button>
            </div>
            
            <!-- Error de Búsqueda -->
            <p v-if="errorPadre && !padreEncontrado" class="text-red-500 text-sm mt-1 flex items-center gap-1">
              <i class="pi pi-times-circle"></i> {{ errorPadre }}
            </p>

            <!-- Modo Encontrado (Tarjeta de éxito) -->
            <div v-if="padreEncontrado" class="mt-2 p-4 border border-blue-200 bg-blue-50 rounded-lg flex justify-between items-center shadow-sm">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <i class="pi pi-user"></i>
                </div>
                <div>
                  <p class="font-bold text-gray-800">{{ padreEncontrado.nombre }}</p>
                  <p class="text-xs text-gray-500">DUI: {{ padreEncontrado.dui }}</p>
                </div>
              </div>
              <button type="button" @click="limpiarPadre('padre')" class="text-red-500 hover:bg-red-100 p-2 rounded-lg transition" title="Cambiar padre">
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- SECCIÓN MADRE -->
        <div class="border rounded-xl p-5 bg-gray-50/50">
          <div class="flex items-center gap-2 mb-4">
            <input type="checkbox" id="madreDesconocida" v-model="madreDesconocida" class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            <label for="madreDesconocida" class="text-sm font-bold text-gray-700 cursor-pointer">Madre desconocida</label>
          </div>
          
          <div v-if="!madreDesconocida" class="animate-fade-in">
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar Madre por DUI</label>
            
            <!-- Modo Buscador -->
            <div v-if="!madreEncontrada" class="flex gap-2">
              <input v-model="duiMadreBuscada" type="text" placeholder="00000000-0" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm" />
              <button type="button" @click="buscarPorDui('madre')" :disabled="cargandoMadre" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50">
                <i :class="cargandoMadre ? 'pi pi-spin pi-spinner' : 'pi pi-search'"></i>
              </button>
              <button type="button" @click="abrirModalPadre('madre')" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition" title="Registrar nueva madre">
                <i class="pi pi-user-plus"></i>
              </button>
            </div>
            
            <!-- Error de Búsqueda -->
            <p v-if="errorMadre && !madreEncontrada" class="text-red-500 text-sm mt-1 flex items-center gap-1">
              <i class="pi pi-times-circle"></i> {{ errorMadre }}
            </p>

            <!-- Modo Encontrado (Tarjeta de éxito) -->
            <div v-if="madreEncontrada" class="mt-2 p-4 border border-pink-200 bg-pink-50 rounded-lg flex justify-between items-center shadow-sm">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center shrink-0">
                  <i class="pi pi-user"></i>
                </div>
                <div>
                  <p class="font-bold text-gray-800">{{ madreEncontrada.nombre }}</p>
                  <p class="text-xs text-gray-500">DUI: {{ madreEncontrada.dui }}</p>
                </div>
              </div>
              <button type="button" @click="limpiarPadre('madre')" class="text-red-500 hover:bg-red-100 p-2 rounded-lg transition" title="Cambiar madre">
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-4">
        <button type="button" @click="cancelar" class="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium">Cancelar</button>
        <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Guardar estudiante</button>
      </div>
    </form>

    <!-- ===================================== -->
    <!-- MODAL PARA REGISTRAR PADRE/MADRE NUEVO -->
    <!-- ===================================== -->
    <div v-if="mostrarModalRegistroPadre" class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-fade-in">
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-xl font-bold text-gray-800">Nuevo Registro</h2>
          <button type="button" @click="mostrarModalRegistroPadre = false" class="text-gray-400 hover:text-gray-600">
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="guardarNuevoPadreBD" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Parentesco</label>
            <select v-model="nuevoPadreForm.relacion" disabled class="w-full px-4 py-2 border rounded-lg bg-gray-100 outline-none">
              <option value="Padre">Padre</option>
              <option value="Madre">Madre</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input v-model="nuevoPadreForm.nombre" type="text" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">DUI</label>
            <input v-model="nuevoPadreForm.dui" type="text" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input v-model="nuevoPadreForm.telefono" type="text" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Correo</label>
              <input v-model="nuevoPadreForm.correo" type="email" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          
          <div class="flex justify-end gap-3 pt-4 mt-2 border-t">
            <button type="button" @click="mostrarModalRegistroPadre = false" class="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition">
              Cancelar
            </button>
            <button type="submit" :disabled="guardandoNuevoPadre" class="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-50 flex items-center gap-2">
              <i v-if="guardandoNuevoPadre" class="pi pi-spin pi-spinner"></i>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>