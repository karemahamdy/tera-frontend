<script setup lang="ts">
import loginFrameImage from "@/assets/images/login-frame.png";
import activity from "@/assets/images/login-frame-activity.png";
import customers from "@/assets/images/login-frame-customers.png";
import overview from "@/assets/images/login-frame-overview.png";
</script>
<template>
  <div class="p-5">
    <div
      class="relative w-full h-full bg-cover bg-center rounded"
      :style="`background-image: url(${loginFrameImage})`"
    >
      <div class="absolute inset-0 text-center flex flex-col justify-between items-center p-5">
        <div>
            <h1 class="text-9xl text-[#FFFFFF52] mt-5">TERA ERP</h1>
            <p class="text-4xl text-[#D5D7DA] px-5 mt-5">
              {{ $t('auth.loginFrameTagline') }}
            </p>
        </div>

        <div class="relative w-60 mx-auto mt-5">
          <!-- Main Image -->
          <img :src="overview" alt="overview" class="w-full" />

          <!-- Customers on top-right -->
          <img
            :src="customers"
            alt="customers"
            class="w-20 absolute bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4"
          />

          <!-- Activity on bottom-left -->
          <img
            :src="activity"
            alt="activity"
            class="w-30 absolute top-0 right-0 transform translate-x-2/4 -translate-y-1/4"
          />
        </div>

        <div class="flex justify-center">
          <div class="relative w-24/25 flex items-center justify-center">
            <div
              class="bg-white/20 opacity-85 backdrop-blur-md rounded-xl p-4 text-white text-lg font-bold text-center border border-white/30"
            >
              {{ $t('auth.loginFrameNote') }}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<style scoped></style>
