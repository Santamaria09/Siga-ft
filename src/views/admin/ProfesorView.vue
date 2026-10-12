<script setup>
import { ref } from 'vue'

import FormProfesor from '@/modules/Admin/Forms/Profesores.vue'
import TableProfesor from '@/modules/Admin/Tables/TablaProfesor.vue'

const mostrarFormulario = ref(false)
const tablaRef = ref(null)

const abrirModal = () => {
  mostrarFormulario.value = true
}

const cerrarModal = () => {
  mostrarFormulario.value = false
}

const actualizarTabla = () => {
  mostrarFormulario.value = false 
  if (tablaRef.value) {
    tablaRef.value.cargarProfesores() 
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">
    
    <nav class="flex gap-4">
      <div class="px-8 py-2 rounded-t-[24px] bg-white text-slate-900 font-semibold text-lg relative z-20 -mb-[2px]">
        Gestión de Profesores
      </div>
    </nav>

    <FormProfesor 
      v-if="mostrarFormulario" 
      @cerrar="cerrarModal" 
      @guardado="actualizarTabla" 
    />
    
    <TableProfesor 
      ref="tablaRef" 
      @abrir-formulario="abrirModal" 
    />

  </div>
</template>