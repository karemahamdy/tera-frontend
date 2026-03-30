<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
    lineItems?: any[];
    disabled?: boolean;
}>();

const emit = defineEmits(['next', 'prev', 'update']);
const items = ref<any[]>([]);

const columns = computed(() => [
    { field: 'code', header: t('BOM.Seq') },
    { field: 'Process', header: t('BOM.Process') },
    { field: 'Process', header: t('BOM.Machine') },
    { field: 'quantity', header: t('BOM.RenTime') },
    { field: 'quantity', header: t('BOM.Setuptime') },
    // ...(props.disabled ? [] : [{ field: 'action', header: '' }])
]);

</script>

<template>
    <div class="flex flex-col h-full bg-white rounded-xl ">
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
