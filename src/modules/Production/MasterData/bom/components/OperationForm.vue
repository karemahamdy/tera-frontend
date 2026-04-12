<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLookups } from '@/composables/useLookups';
import { routingSchema } from '../validation/BOMSchema';
import { useForm } from 'vee-validate';

const { t } = useI18n();
const { getProcessLookups, processLookups, getMachineLookups, machineLookups } = useLookups();

const props = defineProps<{
    lineItems?: any[];
    disabled?: boolean;
}>();

const emit = defineEmits(['next', 'prev', 'update']);

const items = ref<any[]>([]);

onMounted(async () => {
    await Promise.all([
        getProcessLookups(),
        getMachineLookups(),
    ]);
});

function emitUpdate() {
    emit('update', [...items.value]);
}

const columns = computed(() => [
  { field: 'sequence', header: t('BOM.Seq') },
  { field: 'operationId', header: t('BOM.Process') },
  { field: 'machineId', header: t('BOM.Machine') },
  { field: 'runTime', header: t('BOM.RenTime') },
  { field: 'setupTime', header: t('BOM.Setuptime') },
  { field: 'notes', header: t('downtime.notes') },
  ...(props.disabled ? [] : [{ field: 'action', header: '' }])
]);

const {  } = useForm({
  validationSchema: routingSchema,
  initialValues: [],
});

const addEmptyRow = () => {
  items.value.push({
    sequence: items.value.length + 1,
    operationId: null,
    machineId: null,
    runTime: 0,
    setupTime: 0,
    notes: '',
  });
  emitUpdate();
};

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
            <BaseButton v-if="!disabled" :label="t('workOrder.NewRow')" icon="AddSquare"
                class="bg-primary-600 border-none hover:bg-primary-700 font-semibold px-4 py-2 rounded-lg"
                @click="addEmptyRow" />
        </div>
        
        <!-- Table -->
        <div class="overflow-x-auto">
            <DynamicTable :columns="columns" :data="items" :paginator="false" :showView="false" :showEdit="false"
                :showDelete="false">
                <template #col-operationId="{ data }">
                    <FormDropdown :modelValue="data.operationId" :options="processLookups" optionLabel="label" optionValue="value"
                        class="w-fit-content p-inputtext-sm text-sm" />
                </template>
                <template #col-machineId="{ data }">
                    <FormDropdown :modelValue="data.machineId" :options="machineLookups" optionLabel="label" optionValue="value"
                        class="w-fit-content p-inputtext-sm text-sm" />
                </template>
                <template #col-runTime="{ data }">
                    <InputText  v-model.number="data.runTime" class="w-20 p-inputtext-sm" />
                </template>
                <template #col-setupTime="{ data }">
                    <InputText  v-model.number="data.setupTime" class="w-20 p-inputtext-sm" />
                    </template>
                <template #col-name="{ data }">
                    <span class="text-gray-600">{{ data.name }}</span>
                </template>
                  <template #col-notes="{ data }">
                    <div class="flex items-center gap-2">
                            <InputText  v-model.number="data.quantity" class="w-28 p-inputtext-sm" />
                    </div>
                </template>
                 <template #col-sequence="{ data }">
                    <span class="text-primary-600 border border-primary-600 py-4 px-4 rounded-lg">{{ data.sequence }}</span>
                </template>
                <template #col-action="{ data }">
                    <button v-if="!disabled" class="text-red-400 hover:text-red-600" @click="removeItem(data)">
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
