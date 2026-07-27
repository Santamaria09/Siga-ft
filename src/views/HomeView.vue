<template>
  <Navbar />

  <!-- Card -->
  <div class="container mx-auto px-6 py-10">
    <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div class="md:flex">
        <!-- Content -->
        <div class="p-8 md:w-1/2">
          <h1 class="text-4xl font-bold mb-4 text-gray-800">Bienvenido/@s</h1>

          <p class="text-gray-600 text-lg leading-relaxed">
            La educación es el arma más poderosa que puedes usar para cambiar el mundo.
          </p>

          <button
            class="mt-6 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            Conocer más..
          </button>
        </div>

        <!-- Image (right on md+) -->
        <div class="md:w-1/2">
          <img
            src="https://bpic.588ku.com/back_pic/23/04/29/cec7a25ddadab201b8429c4e13a57f96.png"
            alt="banner"
            class="w-full h-72 md:h-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Colored 4x1 Grid - Blue pastel educational tiles -->
  <div class="container mx-auto px-6 py-4">
    <ColoredGrid />
  </div>

  <!-- Overlapping Image - PrimeVue style -->
  <div class="container mx-auto px-6 pb-10">
    <OverlappingImage alt="Institución educativa">
      <template #image>
        <div class="relative overflow-hidden rounded-3xl shadow-2xl">
          <img
            src="https://i1-c.pinimg.com/736x/75/67/2c/75672cbf28a357f022bfb097b07feab0.jpg"
            alt="Campus educativo"
            class="w-full h-80 object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      </template>

      <template #overlay>
        <div class="flex gap-6 justify-center">
          <div
            class="bg-white/15 backdrop-blur-md rounded-2xl p-6 shadow-xl text-white border border-white/20 w-56 hover:bg-white/25 transition cursor-pointer"
          >
            <i class="pi pi-book text-4xl mb-3 text-blue-200"></i>
            <h3 class="font-bold text-lg mb-1 text-white">Misión</h3>
            <p class="text-sm text-white/80">
              Formamos ciudadanos íntegros con valores y excelencia académica.
            </p>
          </div>

          <div
            class="bg-white/15 backdrop-blur-md rounded-2xl p-6 shadow-xl text-white border border-white/20 w-56 hover:bg-white/25 transition cursor-pointer mt-10"
          >
            <i class="pi pi-eye text-4xl mb-3 text-green-200"></i>
            <h3 class="font-bold text-lg mb-1 text-white">Visión</h3>
            <p class="text-sm text-white/80">
              Ser referentes en educación de calidad e innovación pedagógica.
            </p>
          </div>

          <div
            class="bg-white/15 backdrop-blur-md rounded-2xl p-6 shadow-xl text-white border border-white/20 w-56 hover:bg-white/25 transition cursor-pointer mt-5"
          >
            <i class="pi pi-users text-4xl mb-3 text-yellow-200"></i>
            <h3 class="font-bold text-lg mb-1 text-white">Comunidad</h3>
            <p class="text-sm text-white/80">
              Más de 500 estudiantes, docentes y familias unidos por el aprendizaje.
            </p>
          </div>
        </div>
      </template>
    </OverlappingImage>
  </div>

  <!-- Footer siempre visible -->
  <Footer />
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import ColoredGrid from "@/components/ColoredGrid.vue";
import OverlappingImage from "@/components/OverlappingImage.vue";
</script>
