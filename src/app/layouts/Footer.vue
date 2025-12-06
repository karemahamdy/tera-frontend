<template>
  <footer class="p-5 text-sm text-gray-500 flex items-center justify-center bg-white/60 shadow">
    <div>
        {{ $t('layout.copyRight', { year: new Date().getFullYear() }) }}
    </div>
  </footer>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({})
</script>
