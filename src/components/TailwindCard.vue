<script setup lang="ts">
import { ref } from "vue";
const likes = ref(0);
const addLike = () => likes.value++;
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8"
  >
    <div
      class="max-w-sm w-full bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-transform hover:scale-105 duration-300"
    >
      <!-- Image -->
      <img
        src="https://shorthand.com/the-craft/types-of-image-file-formats/assets/UPhtO6IIvn/sh-unsplash_4qgbmezb56c-4096x2731.jpeg"
        alt="Random"
        class="w-full h-48 object-cover"
      />

      <!-- Content -->
      <div class="p-6">
        <h2 class="text-2xl font-extrabold text-gray-800 mb-2">
          Tailwind Test Card
        </h2>
        <p class="text-gray-600 mb-4">
          This is a complex component using TailwindCSS to test various styles:
          gradients, shadows, rounded corners, transitions, and hover effects.
        </p>

        <!-- Badges -->
        <div class="flex flex-wrap gap-2 mb-4">
          <span
            class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold"
            >Vue 3</span
          >
          <span
            class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold"
            >TailwindCSS</span
          >
          <span
            class="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-semibold"
            >Component</span
          >
        </div>

        <!-- Button -->
        <button
          @click="addLike"
          class="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-all"
        >
          Like ({{ likes }})
        </button>
      </div>
    </div>
  </div>
</template>

<style>
body {
  font-family: "Arial", sans-serif;
}
</style>
