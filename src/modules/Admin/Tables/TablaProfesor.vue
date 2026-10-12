<script setup>
import { computed, ref, onMounted } from "vue";
import { profesorService } from '@/services/profesorService';
import Swal from 'sweetalert2';

// Emitimos un evento para que la vista padre abra el formulario
const emit = defineEmits(["abrir-formulario"]);

const search = ref("");
const cargando = ref(false);
const profesoresDB = ref([]);
const activeSection = ref("Profesores");

// Método para cargar datos. Lo exponemos abajo para que la Vista lo pueda ejecutar
const cargarProfesores = async () => {
  try {
    cargando.value = true;
    const response = await profesorService.getAll();
    profesoresDB.value = response.profesores || response.data || [];
  } catch (error) {
    Swal.fire('Error', 'No se pudieron cargar los profesores.', 'error');
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  cargarProfesores();
});

defineExpose({ cargarProfesores });

const filteredProfesores = computed(() => {
  if (!search.value) return profesoresDB.value;
  return profesoresDB.value.filter((p) => 
    p.nombre?.toLowerCase().includes(search.value.toLowerCase()) ||
    p.codigo?.toLowerCase().includes(search.value.toLowerCase())
  );
});

const eliminarProfesor = async (id, nombre) => {
  const confirmacion = await Swal.fire({
    title: `¿Eliminar a ${nombre}?`,
    text: "Esta acción no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Sí, eliminar'
  });

  if (confirmacion.isConfirmed) {
    try {
      await profesorService.delete(id);
      Swal.fire('Eliminado', 'El registro ha sido borrado.', 'success');
      cargarProfesores(); // Recargamos la tabla
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el profesor. Puede que tenga registros asociados.', 'error');
    }
  }
};

const tabClass = (name) => [
  "px-8 py-2 rounded-t-[24px] border border-transparent font-semibold text-lg transition-all duration-200",
  activeSection.value === name ? "bg-white text-slate-900 relative z-20 -mb-[2px]" : "bg-slate-200 text-slate-600 hover:bg-slate-300",
];
</script>

<template>
  <div class="bg-white rounded-b-3xl rounded-r-3xl shadow-xl p-6 overflow-hidden mt-2">
    <section v-if="activeSection === 'Profesores'">
      <div class="flex items-center gap-4 mb-6">
        <div class="relative w-full max-w-sm">
          <input v-model="search" type="text" placeholder="Buscar por nombre o código..." class="w-full h-11 pl-10 pr-4 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
          <i class="pi pi-search absolute left-3 top-3.5 text-slate-400"></i>
        </div>
        
        <!-- Al hacer clic, le avisa a la Vista que debe mostrar el Modal -->
        <button @click="$emit('abrir-formulario')" class="ml-auto h-11 px-5 rounded-lg bg-blue-600 border border-transparent text-white font-semibold hover:bg-blue-700 transition flex items-center gap-2">
          <i class="pi pi-plus"></i> Agregar
        </button>
      </div>

      <div class="overflow-x-auto relative min-h-[200px]">
        <div v-if="cargando" class="absolute inset-0 bg-white/80 flex justify-center items-center z-10">
          <i class="pi pi-spin pi-spinner text-3xl text-blue-600"></i>
        </div>

        <table class="w-full min-w-[1000px] border-collapse">
          <thead>
            <tr>
              <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold rounded-tl-lg">Nombre</th>
              <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">Código</th>
              <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">DUI</th>
              <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">Teléfono</th>
              <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">Dirección</th>
              <th class="text-center bg-slate-100 px-4 py-3 text-slate-600 font-semibold rounded-tr-lg">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="profesor in filteredProfesores" :key="profesor.id" class="hover:bg-slate-50 transition border-b border-slate-100 last:border-0">
              <td class="px-4 py-4 text-slate-800 font-medium">
                {{ profesor.nombre }}
              </td>
              <td class="px-4 py-4 text-slate-600">{{ profesor.codigo }}</td>
              <td class="px-4 py-4 text-slate-600">{{ profesor.dui }}</td>
              <td class="px-4 py-4 text-slate-600">{{ profesor.telefono }}</td>
              <td class="px-4 py-4 text-slate-600 truncate max-w-[200px]" :title="profesor.direccion">{{ profesor.direccion }}</td>
              <td class="px-6 py-4">
                <div class="flex justify-center gap-3">
                  <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition">
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button @click="eliminarProfesor(profesor.id, profesor.nombre)" class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition">
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!cargando && filteredProfesores.length === 0">
              <td colspan="6" class="text-center py-10 text-slate-500">No se encontraron profesores registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>