<script setup>
import { computed } from 'vue';
import BaseButton from './BaseButton.vue';

const props = defineProps({
    visible: Boolean,
    icon: String,
    title: String,
    description: String,
    timer: String,
    showSpinner: Boolean,
    buttons: Array,
    loading: Boolean,
    closable: {
        type: Boolean,
        default: true
    },
    width: {
        type: String,
        default: '30rem'
    }
});

// EMITS
const emit = defineEmits(['update:visible', 'confirm', 'cancel', 'action']);

// V-MODEL BINDING
const isVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
});

// HANDLE BUTTON ACTIONS
const handleAction = (action) => {

    if (action === 'cancel') {
        emit('cancel');
        isVisible.value = false;
    } else if (action === 'confirm') {
        emit('confirm');
    } else {
        emit('action', action);
    }
};

const canClose = computed(() => props.closable && !props.loading);
</script>

<template>
    <Dialog v-model:visible="isVisible" modal :closable="canClose" :dismissableMask="canClose"
        :style="{ width: width }">
        <!-- Header  -->
        <template #header>
            <div v-if="icon" class="flex items-center gap-3 mt-4 justify-center">
                <img :src="icon" :alt="title || 'dialog icon'" />
            </div>
        </template>

        <!-- Content -->
        <div class="py-3">
            <h3 class="text-3xl font-semibold mb-4 text-center text-gray-700 px-4">
                {{ title }}
            </h3>
            <p v-if="description" class="text-gray-600 px-3 text-center font-normal">
                {{ description }}
            </p>
            <h3 v-if="timer" class="text-3xl font-semibold  text-center text-primary-500 px-4">
                {{ timer }}
            </h3>
        </div>

        <!-- Footer -->
        <template #footer>
            <!-- Spinner -->
            <div v-if="showSpinner" class="flex justify-center m-auto">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="6" fill="transparent"
                    animationDuration="2s" stroke="#3f5fac" />
            </div>

            <!-- Buttons -->
            <div v-else-if="buttons && buttons.length > 0" class="flex gap-2 justify-center w-full">
                <BaseButton v-for="(btn, index) in buttons" :key="index" :label="btn.label" :variant="btn.variant" block
                    :disabled="loading || btn.disabled" @click="handleAction(btn.action)" />
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
.p-progressspinner-circle {
    stroke: #3f5fac !important;
}
</style>