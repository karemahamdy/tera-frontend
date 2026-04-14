<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useInventoryLookups } from '@/composables/useInventoryLookups';

const { t } = useI18n();
const { getItemSerials, serialsLookups } = useInventoryLookups();

const props = defineProps<{
    visible: boolean;
    item: any;
    initialSerials?: any[];
    warehouseId?: string | null;
    zoneId?: string | null;
    locationId?: string | null;
    disabled?: boolean;
}>();

const emit = defineEmits(['update:visible', 'save']);

const isVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
});

const serialInput = ref('');
const qtyInput = ref<number>(1);
const isProcessing = ref(false);
const serialError = ref(false);

const serialList = ref<any[]>(props.initialSerials ? [...props.initialSerials] : []);

const columns = computed(() => [
    { field: 'mainSerial', header: t('serial.serial') },
    { field: 'qty', header: t('serial.qty') },
    { field: 'batchNumber', header: t('serial.batch') },
    { field: 'expireDate', header: t('serial.expire'), type: 'date' },
    { field: 'serialNumber2', header: t('serial.serialNumber2') },
    { field: 'serialNumber3', header: t('serial.serialNumber3') },
    { field: 'comment', header: t('serial.comment') },
    ...(props.disabled ? [] : [{ field: 'action', header: '' }])
]);

const totalQty = computed(() =>
    serialList.value.reduce((acc, curr) => acc + Number(curr.qty), 0)
);

const addSerial = () => {
    if (!serialInput.value) {
        serialError.value = true;
        return;
    }
    serialError.value = false;
    
    const found = serialsLookups.value.find(s => s.mainSerial === serialInput.value);

    serialList.value.push({
        mainSerial: serialInput.value,
        qty: qtyInput.value || 0,
        batchNumber: found?.batchNumber || '',
        expireDate: found?.expireDate || null,
        serialNumber2: found?.serialNumber2 || '',
        serialNumber3: found?.serialNumber3 || '',
        comment: found?.comment || '',
        availableQuantity: found?.availableQuantity || 0
    });

    serialInput.value = '';
    qtyInput.value = 1;
};

const removeSerial = (data: any) => {
    const index = serialList.value.indexOf(data);
    if (index !== -1) {
        serialList.value.splice(index, 1);
    }
};

const save = () => {
    isVisible.value = false;
    emit('save', { serials: serialList.value, totalQty: totalQty.value });
};

const close = () => {
    isVisible.value = false;
};

const availableSerialsOptions = computed(() => 
    serialsLookups.value.map(s => ({
        label: `${s.mainSerial} (Qty: ${s.availableQuantity})`,
        value: s.mainSerial,
        qty: s.availableQuantity,
    }))
);

const fetchSerials = async () => {
    if (props.item?.itemId && props.warehouseId) {
        isProcessing.value = true;
        await getItemSerials(props.item.itemId, props.warehouseId, props.zoneId, props.locationId);
        isProcessing.value = false;
    }
};

onMounted(() => {
    fetchSerials();
});

watch(() => props.visible, (newVal) => {
    if (newVal) {
        if (props.initialSerials) {
            serialList.value = [...props.initialSerials];
        }
        fetchSerials();
    }
});
</script>

<template>
    <Dialog v-model:visible="isVisible" modal :closable="false" :header="t('serial.selectQuantity')">
        <template #header>
            <div class="flex items-center justify-between w-full pr-8">
                <span class="text-xl font-bold">{{ t('serial.selectQuantity') }}</span>
                <ProgressSpinner v-if="isProcessing" style="width: 20px; height: 20px" strokeWidth="4" />
            </div>
        </template>

        <div class="flex flex-col md:flex-row min-w-[30vw] min-h-[40vh]">
            <!-- Left Form Panel -->
            <div v-if="!disabled" class="w-full md:w-[350px] flex flex-col gap-5 p-2 pr-6 border-r border-gray-100">
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1">
                        <label class="text-xs text-gray-600 font-medium">{{ t('serial.serialNumber') }}</label>
                        <Dropdown 
                            v-model="serialInput" 
                            :options="availableSerialsOptions" 
                            optionLabel="label" 
                            optionValue="value"
                            filter 
                            :placeholder="t('serial.selectSerial')" 
                            class="w-full"
                            :class="{ 'p-invalid border-red-500': serialError }"
                        />
                        <small v-if="serialError" class="text-red-500 text-xs">{{ t('form.fieldRequired') }}</small>
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-xs text-gray-600 font-medium">{{ t('serial.quantity') }}</label>
                        <InputNumber v-model="qtyInput" :placeholder="t('serial.enterQuantity')" class="w-full" :min="1" />
                    </div>
                </div>
                <div class="mt-auto flex flex-col gap-3">
                    <BaseButton :label="t('serial.addSerial')" class="w-full bg-primary-600 hover:bg-primary-700 text-white border-0" @click="addSerial" />
                    <BaseButton :label="t('common.cancel')" variant="ghost" class="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-white" @click="close" />
                </div>
            </div>

            <!-- Right List Panel -->
            <div class="w-full flex-1 flex flex-col pl-6 bg-[#F5F8FF]/30">
                <div class="mb-4">
                    <h3 class="font-bold text-lg text-gray-900">{{ t('serial.addedSerial') }}</h3>
                </div>
                <div class="flex-1 overflow-hidden rounded-lg bg-[#EFF4FF] border border-gray-100">
                    <DynamicTable :columns="columns" :data="serialList" :paginator="false" :showView="false" :showEdit="false" :showDelete="false" class="h-full bg-transparent">
                        <template #col-qty="{ data }"><span class="font-semibold text-gray-900">{{ data.qty }}</span></template>
                        <template #col-action="{ data }">
                            <button v-if="!disabled" class="text-red-400 hover:text-red-600" @click="removeSerial(data)">
                                <VsxIcon iconName="Trash" :size="20" type="linear" color="#F04438" />
                            </button>
                        </template>
                    </DynamicTable>
                </div>
                <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div class="flex flex-col">
                        <span class="text-xs text-gray-500 font-medium">{{ t('serial.totalQty') }}</span>
                        <span class="text-2xl font-bold text-primary-600">{{ totalQty }}</span>
                    </div>
                    <div class="flex gap-3">
                        <BaseButton v-if="!disabled" :label="t('common.cancel')" variant="ghost" class="w-24 border-gray-300 text-gray-700 hover:bg-gray-50 bg-white" @click="close" />
                        <BaseButton :label="disabled ? t('common.close') : t('serial.finalizeSave')" class="w-40 bg-primary-600 hover:bg-primary-700 text-white border-0" @click="disabled ? close() : save()" />
                    </div>
                </div>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
:deep(.p-dialog-content) { padding: 0 24px 24px 24px; }
:deep(.p-datatable .p-datatable-thead > tr > th) { background-color: #E2E8F0; color: #475569; font-weight: 700; }
</style>
