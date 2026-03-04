<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
    visible: boolean;
    initialSerials: any[];
}>();

const emit = defineEmits(['update:visible']);

const isVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
});


const columns = computed(() => [
    { field: 'mainSerial', header: t('serial.serial') },
    { field: 'quantity', header: t('serial.qty') },
    { field: 'batchNumber', header: t('serial.batch') },
    { field: 'expireDate', header: t('serial.expire'), type: 'date' },
    { field: 'serialNumber2', header: t('serial.serialNumber2') },
    { field: 'serialNumber3', header: t('serial.serialNumber3') },
    { field: 'comment', header: t('serial.comment') },
]);

const totalQty = computed(() =>
    props.initialSerials?.reduce((acc, curr) => acc + Number(curr.quantity), 0)
);

</script>

<template>
    <Dialog v-model:visible="isVisible" modal :closable="true" :header="t('serial.selectQuantity')">
        <template #header>
            <div class="flex items-center justify-between w-full pr-8">
                <span class="text-xl font-bold">{{ t('serial.addedSerial') }}</span>
            </div>
        </template>

        <div class="w-full flex-1 flex flex-col pl-6 bg-[#F5F8FF]/30">
            <div class="flex-1 overflow-hidden rounded-lg bg-[#EFF4FF] border border-gray-100">
                <DynamicTable :columns="columns" :data="initialSerials" :paginator="false" :showView="false"
                    :showEdit="false" :showDelete="false" class="h-full bg-transparent">
                    <template #col-qty="{ data }"><span class="font-semibold text-gray-900">{{ data.qty
                    }}</span></template>
                </DynamicTable>
            </div>
            <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <div class="flex flex-col">
                    <span class="text-xs text-gray-500 font-medium">{{ t('serial.totalQty') }}</span>
                    <span class="text-2xl font-bold text-primary-600">{{ totalQty }}</span>
                </div>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
:deep(.p-dialog-content) {
    padding: 0 24px 24px 24px;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: #E2E8F0;
    color: #475569;
    font-weight: 700;
}
</style>
