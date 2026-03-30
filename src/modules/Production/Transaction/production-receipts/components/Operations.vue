<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useInventoryLookups } from "@/composables/useInventoryLookups";

const { t } = useI18n();
const { getItemsLookups } = useInventoryLookups();

const props = defineProps<{
    lineItems?: any[];
    disabled?: boolean;
}>();

const emit = defineEmits(['next', 'prev', 'update']);

const items = ref<any[]>([]);

onMounted(async () => {
    await Promise.all([
        getItemsLookups(),
    ]);
});

function emitUpdate() {
    emit('update', [...items.value]);
}

const columns = computed(() => [
    { field: 'code', header: t('BOM.Seq') },
    { field: 'Process', header: t('BOM.Process') },
    { field: 'Process', header: t('BOM.Machine') },
    { field: 'quantity', header: t('BOM.RenTime') },
    { field: 'quantity', header: t('BOM.Setuptime') },
    ...(props.disabled ? [] : [{ field: 'action', header: '' }])
]);

const removeItem = (data: any) => {
    if (props.disabled) return;
    const index = items.value.findIndex(item => item.id === data.id);
    if (index !== -1) {
        items.value.splice(index, 1);
    }
    emitUpdate();
};

</script>

<template>
    <div class="flex flex-col h-full bg-white rounded-xl ">
        <!-- Header -->
        <div class="flex justify-between items-center mb-3">
            <div>
                <h2 class="text-xl font-bold text-gray-900">{{ t('workOrder.Operations') }}</h2>
            </div>
        </div>
        
        <!-- Table -->
        <div class="overflow-x-auto">
            <DynamicTable :columns="columns" :data="items" :paginator="false" :showView="false" :showEdit="false"
                :showDelete="false">
                <template #col-Process="{ data }">
                    <FormDropdown :modelValue="data.Process" optionLabel="label" optionValue="value"
                        class="w-34 p-inputtext-sm text-sm" />
                </template>
               <template #col-quantity="{ data }">
                    <div class="flex items-center gap-2">
                        <InputText v-model.number="data.quantity" class="w-20 p-inputtext-sm" />
                    </div>
                </template>
                <template #col-name="{ data }">
                    <span class="text-gray-600">{{ data.name }}</span>
                </template>
                 <template #col-code="{ data }">
                    <span class="text-primary-600 border border-primary-600 py-4 px-4 rounded-lg">{{ data.code }}</span>
                </template>
                <template #col-action="{ data }">
                    <button  class="text-red-400 hover:text-red-600" @click="removeItem(data)">
                        <VsxIcon iconName="Trash" :size="20" type="linear" color="#F04438" />
                    </button>
                </template>
            </DynamicTable>
        </div>
       
    </div>
</template>

<style scoped>
:deep(.p-select) {
    border-color: #f3f4f6;
    background-color: #f9fafb;
}

:deep(.p-inputtext) {
    border-color: #e5e7eb;
    background-color: #f9fafb;
}

:deep(.p-inputtext:focus) {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb;
}

.circle-badge-sm {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
}

.circle-badge {
    background-color: transparent;
}

.icon-transparent {
    color: transparent;
}
</style>
