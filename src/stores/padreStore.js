import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api';

export const usePadreStore = defineStore('padre', () => {
  const padres = ref([]);
  const cargando = ref(false);

  // Obtener la lista de padres (Asumiendo que tienes el método index en tu PadreController)
  const obtenerPadres = async () => {
    try {
      cargando.value = true;
      const response = await api.get('/padres');
      padres.value = response.data.padres || response.data.data || [];
    } catch (error) {
      console.error("Error al cargar la lista de padres:", error);
    } finally {
      cargando.value = false;
    }
  };

  // Registrar un nuevo padre
  const registrarPadre = async (datosPadre) => {
    cargando.value = true;
    try {
      const response = await api.post('/padres', datosPadre);
      padres.value.push(response.data.padre); // Agrega el nuevo registro a la vista
      return { exito: true, mensaje: response.data.message };
    } catch (error) {
      // Retornamos los errores de validación (ej. DUI duplicado)
      return { 
        exito: false, 
        errores: error.response?.data?.errors || { general: ['Ocurrió un error en el servidor'] } 
      };
    } finally {
      cargando.value = false;
    }
  };

  return { padres, cargando, obtenerPadres, registrarPadre };
});