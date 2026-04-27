<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLookups } from '@/composables/useLookups';

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

const operationsError = ref('');
const rowErrors = ref<Record<string, { operationId?: string; machineId?: string; }>>({});

const validate = async () => {
  operationsError.value = '';
  rowErrors.value = {};
  let isValid = true;

  if (items.value.length === 0) {
    operationsError.value = t('validation.atLeastOneOperation');
    return false;
  }

  items.value.forEach((item) => {
    const errors: any = {};
    if (!item.operationId) {
      errors.operationId = t('validation.processRequired');
      isValid = false;
    }
    if (!item.machineId) {
      errors.machineId = t('validation.machineRequired');
      isValid = false;
    }
    
    if (Object.keys(errors).length > 0) {
      rowErrors.value[item.id] = errors;
    }
  });

  return isValid;
};

const addEmptyRow = () => {
    items.value.push({
        id: Date.now().toString(),
        sequence: items.value.length + 1,
        operationId: null,
        machineId: null,
        runTimeHours: 0,
        runTimeMinutes: 0,
        setupTimeHours: 0,
        setupTimeMinutes: 0,
        get runTime() { return this.runTimeHours + this.runTimeMinutes / 60; },
        get setupTime() { return this.setupTimeHours + this.setupTimeMinutes / 60; },
        notes: '',
    });
    emitUpdate();
};

const setItems = (newItems: any[]) => {
    items.value = newItems.map((item, index) => {
        const runH = Math.floor(item.runTime || 0);
        const runM = Math.round(((item.runTime || 0) - runH) * 60);
        const setH = Math.floor(item.setupTime || 0);
        const setM = Math.round(((item.setupTime || 0) - setH) * 60);

        return {
            id: item.id || Date.now().toString() + index,
            sequence: item.sequence,
            operationId: item.operationId,
            machineId: item.machineId,
            runTimeHours: runH,
            runTimeMinutes: runM,
            setupTimeHours: setH,
            setupTimeMinutes: setM,
            get runTime() { return this.runTimeHours + this.runTimeMinutes / 60; },
            get setupTime() { return this.setupTimeHours + this.setupTimeMinutes / 60; },
            notes: item.notes || '',
        };
    });
};

defineExpose({ 
  getItems: () => items.value,
  validate,
  setItems,
});

const removeItem = (data: any) => {
    if (props.disabled) return;
    const index = items.value.findIndex(item => item.id === data.id);
    if (index !== -1) {
        items.value.splice(index, 1);
        items.value.forEach((item, i) => {
            item.sequence = i + 1;
        });
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

        <!-- Operation validation error -->
        <div v-if="operationsError" class="text-danger-500 text-sm mb-2">
            {{ operationsError }}
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <DynamicTable :columns="columns" :data="items" :paginator="false" :showView="false" :showEdit="false"
                :showDelete="false">
                <template #col-operationId="{ data }">
                    <div>
                        <FormDropdown :options="processLookups" v-model="data.operationId" optionLabel="label"
                            optionValue="value" class="w-fit-content p-inputtext-sm text-sm"
                            :invalid="!!rowErrors[data.id]?.operationId" />
                        <small v-if="rowErrors[data.id]?.operationId" class="text-danger-500 text-xs">
                            {{ rowErrors[data?.id]?.operationId }}
                        </small>
                    </div>
                </template>
                <template #col-machineId="{ data }">
                    <div>
                        <FormDropdown :options="machineLookups" v-model="data.machineId" optionLabel="label"
                            optionValue="value" class="w-fit-content p-inputtext-sm text-sm"
                            :invalid="!!rowErrors[data.id]?.machineId" />
                        <small v-if="rowErrors[data.id]?.machineId" class="text-danger-500 text-xs">
                            {{ rowErrors[data?.id]?.machineId }}
                        </small>
                    </div>
                </template>
                <!-- RunTime -->
                <template #col-runTime="{ data }">
                    <div class="flex items-center gap-1">
                        <div class="flex flex-col items-center">
                            <small class="text-xs text-gray-400 mb-1">{{ t('BOM.hours') }}</small>
                            <InputText v-model.number="data.runTimeHours" class="w-16 p-inputtext-sm text-center"
                                :min="0" @update:modelValue="emitUpdate" />
                        </div>
                        <span class="mt-4 text-gray-400">:</span>
                        <div class="flex flex-col items-center">
                            <small class="text-xs text-gray-400 mb-1">{{ t('BOM.minutes') }}</small>
                            <InputText v-model.number="data.runTimeMinutes" class="w-16 p-inputtext-sm text-center"
                                :min="0" :max="59" @update:modelValue="(val) => {
                                    const num = Number(val) || 0;
                                    data.runTimeMinutes = num > 59 ? 59 : num;
                                    emitUpdate();
                                }" />
                        </div>
                        <small class="mt-4 text-xs text-gray-500">
                            = {{ (data.runTimeHours + data.runTimeMinutes / 60).toFixed(2) }}h
                        </small>
                    </div>
                </template>

                <!-- SetupTime -->
                <template #col-setupTime="{ data }">
                    <div class="flex items-center gap-1">
                        <div class="flex flex-col items-center">
                            <small class="text-xs text-gray-400 mb-1">{{ t('BOM.hours') }}</small>
                            <InputText v-model.number="data.setupTimeHours" class="w-16 p-inputtext-sm text-center"
                                :min="0" @update:modelValue="emitUpdate" />
                        </div>
                        <span class="mt-4 text-gray-400">:</span>
                        <div class="flex flex-col items-center">
                            <small class="text-xs text-gray-400 mb-1">{{ t('BOM.minutes') }}</small>
                            <InputText v-model.number="data.setupTimeMinutes" class="w-16 p-inputtext-sm text-center"
                                :min="0" :max="59" @update:modelValue="(val) => {
                                    const num = Number(val) || 0;
                                    data.setupTimeMinutes = num > 59 ? 59 : num;
                                    emitUpdate();
                                }" />
                        </div>
                        <small class="mt-4 text-xs text-gray-500">
                            = {{ (data.setupTimeHours + data.setupTimeMinutes / 60).toFixed(2) }}h
                        </small>
                    </div>
                </template>
                <template #col-name="{ data }">
                    <span class="text-gray-600">{{ data.name }}</span>
                </template>
                <template #col-notes="{ data }">
                    <div class="flex items-center gap-2">
                        <InputText v-model="data.notes" class="w-28 p-inputtext-sm" />
                    </div>
                </template>
                <template #col-sequence="{ data }">
                    <span class="text-primary-600 border border-primary-600 py-4 px-4 rounded-lg">{{ data.sequence
                    }}</span>
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
