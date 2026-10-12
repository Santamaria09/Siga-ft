<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { profesorService } from '@/services/profesorService';
import api from '@/services/api';

const emit = defineEmits(["cerrar", "guardado"]);

const profesor = ref({
  user_id: "",
  nombre: "",
  dui: "",
  codigo: "",
  fecha_nacimiento: "",
  telefono: "",
  direccion: ""
});

const guardando = ref(false);

// --- NUEVO: Lógica para cargar usuarios desde Laravel ---
const usuarios = ref([]);
const cargandoUsuarios = ref(false);

const cargarUsuarios = async () => {
  try {
    cargandoUsuarios.value = true;
    // Hacemos la petición a la ruta de usuarios (Ajusta a '/users' si en api.php está en inglés)
    const response = await api.get('/usuarios'); 
    
    // Asignamos la respuesta al arreglo de usuarios
    usuarios.value = response.data.usuarios || response.data || [];
  } catch (error) {
    console.error("Error al cargar los usuarios:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar las cuentas de usuario.'
    });
  } finally {
    cargandoUsuarios.value = false;
  }
};

// Se ejecuta automáticamente al abrir el formulario
onMounted(() => {
  cargarUsuarios();
});
// --------------------------------------------------------

const guardarProfesor = async () => {
  // Validación básica del frontend
  if (!profesor.value.nombre || !profesor.value.dui || !profesor.value.codigo || !profesor.value.user_id) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor ingresa todos los campos obligatorios.'
    });
    return;
  }

  try {
    guardando.value = true;
    
    // Llamada al servicio para guardar en Laravel
    await profesorService.create(profesor.value);
    
    Swal.fire({ 
      icon: 'success', 
      title: '¡Registrado!', 
      text: 'El profesor se guardó correctamente.', 
      timer: 2000, 
      showConfirmButton: false 
    });

    // Avisamos a la Vista que ya terminamos para que cierre el modal y actualice la tabla
    emit("guardado"); 

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error de validación',
      text: error.response?.data?.message || 'Error al conectar con el servidor.'
    });
  } finally {
    guardando.value = false;
  }
};

const cerrar = () => {
  emit("cerrar");
};
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in">
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-2xl font-bold text-gray-800">Registrar Profesor</h2>
        <button @click="cerrar" class="text-gray-400 hover:text-gray-600">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <div class="p-6">
        <form @submit.prevent="guardarProfesor" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- NUEVO: Select dinámico de usuarios -->
            <div>
              <label class="block text-sm font-medium mb-2">Vincular a Cuenta de Usuario *</label>
              <select v-model="profesor.user_id" required class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="" disabled>
                  {{ cargandoUsuarios ? 'Cargando usuarios...' : 'Seleccione una cuenta...' }}
                </option>
                
                <!-- Ciclo que renderiza los usuarios reales de la base de datos -->
                <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
                  {{ usuario.email }} <!-- Muestra el correo. Puedes cambiarlo a usuario.name si prefieres -->
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Nombre Completo *</label>
              <input v-model="profesor.nombre" required type="text" class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">DUI *</label>
              <input v-model="profesor.dui" required type="text" placeholder="00000000-0" class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Código de Profesor *</label>
              <input v-model="profesor.codigo" required type="text" placeholder="PROF-001" class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Fecha de Nacimiento *</label>
              <input v-model="profesor.fecha_nacimiento" required type="date" class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Teléfono *</label>
              <input v-model="profesor.telefono" required type="tel" placeholder="0000-0000" class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Dirección *</label>
            <textarea v-model="profesor.direccion" required rows="3" placeholder="Ingrese la dirección completa..." class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t">
            <button type="button" @click="cerrar" class="px-4 py-2 border rounded-lg hover:bg-gray-100 transition font-medium">
              Cancelar
            </button>
            <button type="submit" :disabled="guardando" class="px-5 py-2 bg-blue-600 border border-transparent text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 flex items-center gap-2">
              <i v-if="guardando" class="pi pi-spin pi-spinner"></i>
              Guardar Profesor
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