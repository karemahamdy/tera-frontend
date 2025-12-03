<script setup>
import { computed } from 'vue';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import BaseButton from './BaseButton.vue';

import downloadIcon from '@/assets/images/download.png';
import dangerIcon from '@/assets/images/danger.png';
import successIcon from '@/assets/images/success.png';
import alertIcon from '@/assets/images/alert.png';


// PROPS
const props = defineProps({
    visible: Boolean,
    status: String,
    title: String,
    description: String,
    loading: Boolean
});

// EMITS
const emit = defineEmits(['update:visible', 'confirm']);


// V-MODEL BINDING
const isVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
});


// ICON CONFIGS
const statusConfigs = {
    success: { icon: successIcon, alt: 'success' },
    danger: { icon: dangerIcon, alt: 'danger' },
    delete: { icon: alertIcon, alt: 'delete' },
    download: { icon: downloadIcon, alt: 'download' }
};

const statusConfig = computed(() => statusConfigs[props.status]);


// ACTIONS
const closeDialog = () => isVisible.value = false;
const confirmAction = () => emit('confirm');

</script>

<template>
    <Dialog v-model:visible="isVisible" modal :closable="!loading" :dismissableMask="!loading"
        :style="{ width: '28rem' }">

        <template #header>
            <div class="flex items-center gap-3 mt-4 justify-center">
                <img :src="statusConfig.icon" :alt="statusConfig.alt" />
            </div>
        </template>

        <div class="py-3">
            <h3 class="text-3xl font-semibold mb-4 text-center text-gray-700 px-4">{{ title }}</h3>
            <p v-if="description" class="text-gray-600 px-3 text-center font-normal">{{ description }}</p>
        </div>

        <template #footer>

            <!-- success + danger → loading spinner -->
            <div v-if="['success', 'danger'].includes(status)" class="flex justify-center m-auto ">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="6" fill="transparent"
            animationDuration="2s" aria-label="Custom ProgressSpinner" class="custom-spinner" stroke="#3f5fac" />
            </div>

            <!-- delete dialog -->
            <div v-else-if="status === 'delete'" class="flex gap-2 justify-end">
                <BaseButton label="Cancel" variant="ghost" @click="closeDialog" />
                <BaseButton label="Yes, Delete" variant="danger" @click="confirmAction" />
            </div>

            <!-- download dialog -->
            <div v-else-if="status === 'download'" class="flex gap-2 justify-end">
                <BaseButton label="Cancel" variant="ghost" @click="closeDialog" />
                <BaseButton label="Download" variant="primary" @click="confirmAction" />
            </div>

        </template>
    </Dialog>
</template>

<style scoped>  
.p-progressspinner-circle.animation {
  stroke: #3f5fac !important;
}
</style>