<script setup lang="ts">
import LoginForm from '../components/LoginForm.vue';
import LoginFrame from '../components/LoginFrame.vue';

</script>
<template>
    <div class="p-4 flex flex-col md:flex-row md:justify-center md:items-center gap-6 h-screen w-full overflow-hidden">
        <LoginFrame class="hidden md:block h-screen w-1/2 overflow-hidden" />
        <LoginForm class="h-screen w-full md:w-1/2" />
    </div>
</template>
<style scoped></style>