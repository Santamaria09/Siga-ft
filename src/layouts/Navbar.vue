<script setup>
const emit = defineEmits(['toggle-sidebar']);
</script>

<template>
  <header class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 z-10">
    <div class="flex items-center gap-3">
      <button
        @click="emit('toggle-sidebar')"
        type="button"
        class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition focus:outline-none"
      >
        <i class="pi pi-bars text-xl"></i>
      </button>


      <h1 class="font-bold text-gray-800 text-sm sm:text-base tracking-tight">
        CENTRO ESCOLAR HACIENDA COLIMA
      </h1>
    </div>
  </header>
</template>