<template>
    <Dialog v-model:visible="isVisible" modal :closable="!loading" :dismissableMask="!loading"
        :style="{ width: '28rem' }">
        <template #header>
            <div class="flex items-center gap-3">
                <div :class="['flex items-center justify-center rounded-full', statusConfig.iconBg]"
                    style="width: 48px; height: 48px;">
                    <i :class="['text-2xl', statusConfig.icon, statusConfig.iconColor]" />
                </div>
            </div>
        </template>

        <div class="py-4">
            <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
            <p v-if="description" class="text-gray-600">{{ description }}</p>
        </div>

        <template #footer>
            <div v-if="loading" class="flex justify-center py-2">
                <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" />
            </div>
            <div v-else class="flex gap-2 justify-end">
                <Button v-if="cancelText" :label="cancelText" severity="secondary" @click="handleCancel" outlined />
                <Button :label="confirmText || 'OK'" :severity="buttonSeverity" @click="handleConfirm" />
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import { computed } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';

const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    status: {
        type: String,
        required: true,
        validator: (value) => ['success', 'danger', 'delete', 'download'].includes(value)
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    loading: {
        type: Boolean,
        default: false
    },
    confirmText: {
        type: String,
        default: 'OK'
    },
    cancelText: {
        type: String,
        default: ''
    },
    onConfirm: {
        type: Function,
        default: null
    },
    onCancel: {
        type: Function,
        default: null
    }
});

const emit = defineEmits(['update:visible', 'confirm', 'cancel']);

const isVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
});

const statusConfigs = {
    success: {
        icon: 'pi pi-check',
        iconColor: 'text-green-600',
        iconBg: 'bg-green-100'
    },
    danger: {
        icon: 'pi pi-exclamation-triangle',
        iconColor: 'text-red-600',
        iconBg: 'bg-red-100'
    },
    delete: {
        icon: 'pi pi-trash',
        iconColor: 'text-red-600',
        iconBg: 'bg-red-100'
    },
    download: {
        icon: 'pi pi-download',
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100'
    }
};

const statusConfig = computed(() => statusConfigs[props.status]);

const buttonSeverity = computed(() => {
    switch (props.status) {
        case 'danger':
        case 'delete':
            return 'danger';
        case 'success':
            return 'success';
        default:
            return 'primary';
    }
});

const handleConfirm = () => {
    if (props.onConfirm) {
        props.onConfirm();
    }
    emit('confirm');
};

const handleCancel = () => {
    if (props.onCancel) {
        props.onCancel();
    }
    emit('cancel');
    isVisible.value = false;
};
</script>
