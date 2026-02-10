<script setup lang="ts">
import { ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
// import BaseButton from '@/sharedComponents/BaseButton.vue';

const props = defineProps<{
  visible: boolean;
  items: any[];
}>();

const emit = defineEmits(['update:visible', 'select']);

const localVisible = ref(props.visible);
const searchQuery = ref('');

watch(() => props.visible, (newVal) => {
  localVisible.value = newVal;
});

watch(localVisible, (newVal) => {
  emit('update:visible', newVal);
});

const selectItem = (item: any) => {
  emit('select', item);
  localVisible.value = false;
};
</script>

<template>
    <Dialog v-model:visible="localVisible" modal header="Select Item" :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '641px': '90vw' }">
        <div class="flex flex-col gap-4">
            <span class="p-input-icon-left w-full">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" placeholder="Search items..." class="w-full bg-gray-50 border-gray-200" />
            </span>
            
            <div class="overflow-y-auto max-h-[400px]">
                <div v-for="item in items" :key="item.code" class="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
                             <i class="pi pi-box"></i>
                        </div>
                        <div>
                            <div class="font-bold text-gray-900">{{ item.code }}</div>
                            <div class="text-sm text-gray-500">{{ item.name }}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="text-gray-500 text-sm">{{ item.unit }}</span>
                        <!-- Using BaseButton as requested -->
                        <BaseButton label="Add" size="small" class="bg-primary-800 hover:bg-primary-900 text-white text-xs px-4" @click="selectItem(item)" />
                    </div>
                </div>
            </div>
        </div>
    </Dialog>
</template>
