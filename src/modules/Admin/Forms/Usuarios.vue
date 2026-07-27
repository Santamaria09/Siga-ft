<script setup>
import { ref } from "vue";

const emit = defineEmits(["cerrar"]);

const formData = ref({
  name: "",
  email: "",
  dui: "",
  role: "",
  password: "",
  confirmPassword: "",
  status: ""
});

const guardarForm = () => {
  console.log("Datos del formulario:", formData.value);

  alert("Usuario registrado correctamente");

  emit("cerrar");

  formData.value = {
    name: "",
    email: "",
    dui: "",
    role: "",
    password: "",
    confirmPassword: "",
    status: ""
  };
};

const cerrar = () => {
  emit("cerrar");
};
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-3xl shadow-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-slate-900">
          Registrar Usuario
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Nombre Completo
          </label>

          <input
            v-model="formData.name"
            type="text"
            class="w-full h-11 px-4 border border-slate-300 rounded-lg focus:border-gray-500 focus:outline-none"
            placeholder="Ingrese el nombre"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Correo Electrónico
          </label>

          <input
            v-model="formData.email"
            type="email"
            class="w-full h-11 px-4 border border-slate-300 rounded-lg focus:border-gray-500 focus:outline-none"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            DUI
          </label>

          <input
            v-model="formData.dui"
            type="text"
            class="w-full h-11 px-4 border border-slate-300 rounded-lg focus:border-gray-500 focus:outline-none"
            placeholder="00000000-0"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Rol
          </label>

          <select
            v-model="formData.role"
            class="w-full h-11 px-4 border border-slate-300 rounded-lg focus:border-gray-500 focus:outline-none"
          >
            <option value="">Seleccione un rol</option>
            <option value="Administrador">Administrador</option>
            <option value="Profesor">Profesor</option>
            <option value="Cliente">Cliente</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Contraseña
          </label>

          <input
            v-model="formData.password"
            type="password"
            class="w-full h-11 px-4 border border-slate-300 rounded-lg focus:border-gray-500 focus:outline-none"
            placeholder="********"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Confirmar Contraseña
          </label>

          <input
            v-model="formData.confirmPassword"
            type="password"
            class="w-full h-11 px-4 border border-slate-300 rounded-lg focus:border-gray-500 focus:outline-none"
            placeholder="********"
          />
        </div>

      </div>

      <div class="flex justify-end gap-4 mt-8 pt-6 border-t">
        <button
          @click="cerrar"
          class="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Cancelar
        </button>

        <button
          @click="guardarForm"
          class="px-6 py-2 rounded-lg border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Registrar Usuario
        </button>
      </div>
    </div>
  </div>
</template>
