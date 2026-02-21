<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
    visible: boolean;
    item: any;
    initialSerials?: any[];
}>();

const emit = defineEmits(['update:visible', 'save']);

const localVisible = ref(props.visible);

const serialInput = ref('');
const qtyInput = ref<string>("");
const batchInput = ref('');
const expireDateInput = ref();
const commentInput = ref('');

const serialList = ref<any[]>(props.initialSerials ? [...props.initialSerials] : []);

const columns = computed(() => [
    { field: 'serial', header: t('serial.serial') },
    { field: 'qty', header: t('serial.qty') },
    { field: 'batch', header: t('serial.batch') },
    { field: 'expire', header: t('serial.expire') },
    { field: 'serialNumber2', header: t('serial.serialNumber2') },
    { field: 'comment', header: t('serial.comment') },
    { field: 'action', header: '' }
]);

const totalQty = computed(() =>
    serialList.value.reduce((acc, curr) => acc + Number(curr.qty), 0)
);

const addSerial = () => {
    if (!serialInput.value && !qtyInput.value) return;

    serialList.value.push({
        serial: serialInput.value,
        qty: qtyInput.value || "0",
        batch: batchInput.value,
        expire: expireDateInput.value,
        comment: commentInput.value
    });

    serialInput.value = '';
    qtyInput.value = "";
    batchInput.value = '';
    expireDateInput.value = undefined;
    commentInput.value = '';
};

const removeSerial = (data: any) => {
    const index = serialList.value.indexOf(data);
    if (index !== -1) {
        serialList.value.splice(index, 1);
    }
};

const save = () => {
    emit('save', { serials: serialList.value, totalQty: totalQty.value });
    localVisible.value = false;
};

const close = () => {
    localVisible.value = false;
};

watch(() => props.visible, (newVal) => {
    localVisible.value = newVal;
    if (newVal && props.initialSerials) {
        serialList.value = [...props.initialSerials];
    }
});

watch(localVisible, (newVal) => emit('update:visible', newVal));

</script>

<template>
    <Dialog v-model:visible="localVisible" modal :closable="false">
        <div class="flex flex-col md:flex-row h-[610px]">

            <!-- Left Form Panel -->
            <div class="w-full md:w-[350px] flex flex-col gap-5 p-2 pr-6 border-r border-gray-100">

                <div class="flex justify-between items-center">
                    <h3 class="font-bold text-lg text-gray-900">
                        {{ t('serial.selectQuantity') }}
                    </h3>

                    <BaseButton :label="t('import')" icon="DocumentUpload" size="small" variant="outline-primary"
                        class="px-2 py-1 text-xs" />
                         <BaseButton :label="t('export')" icon="DocumentUpload" size="small" variant="outline-primary"
                        class="px-2 py-1 text-xs" />
                </div>

                <div class="flex flex-col gap-4">

                    <div class="flex flex-col gap-1">
                        <label class="text-xs text-gray-600 font-medium">
                            {{ t('serial.serialNumber') }}
                        </label>
                        <InputText v-model="serialInput" :placeholder="t('serial.selectSerial')" class="w-full" />
                    </div>


                    <div class="flex flex-col gap-1 w-full">
                        <label class="text-xs text-gray-600 font-medium">
                            {{ t('serial.quantity') }}
                        </label>
                        <InputText v-model.number="qtyInput" :placeholder="t('serial.enterQuantity')" class="w-full" />
                    </div>

                </div>

                <div class="mt-auto flex flex-col gap-3">
                    <BaseButton :label="t('serial.addSerial')"
                        class="w-full bg-primary-600 hover:bg-primary-700 text-white border-0" @click="addSerial" />

                    <BaseButton :label="t('common.cancel')" variant="ghost"
                        class="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-white" @click="close" />
                </div>
            </div>

            <!-- Right List Panel -->
            <div class="w-full flex-1 flex flex-col pl-6 bg-[#F5F8FF]/30">

                <div class="mb-4">
                    <h3 class="font-bold text-lg text-gray-900">
                        {{ t('serial.addedSerial') }}
                    </h3>
                    <p class="text-sm text-gray-500">
                        {{ t('serial.identifyItems') }}
                    </p>
                </div>

                <div class="flex-1 overflow-hidden rounded-lg bg-[#EFF4FF] border border-gray-100">
                    <DynamicTable :columns="columns" :data="serialList" :paginator="false" :showView="false"
                        :showEdit="false" :showDelete="false" class="h-full bg-transparent">
                        <template #col-batch="{ data }">
                            <span
                                class="text-xs uppercase bg-white border border-gray-200 px-2 py-1 rounded text-gray-600">
                                {{ data.batch }}
                            </span>
                        </template>

                        <template #col-expire="{ data }">
                            <span class="text-gray-500">
                                {{ data.expire ? new Date(data.expire).toLocaleDateString() : '-' }}
                            </span>
                        </template>

                        <template #col-qty="{ data }">
                            <span class="font-semibold text-gray-900">
                                {{ data.qty }}
                            </span>
                        </template>

                        <template #col-action="{ data }">
                            <button class="text-red-400 hover:text-red-600" @click="removeSerial(data)">
                                <VsxIcon iconName="Trash" :size="20" type="linear" color="#F04438" />
                            </button>
                        </template>
                    </DynamicTable>
                </div>

                <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div class="flex flex-col">
                        <span class="text-xs text-gray-500 font-medium">
                            {{ t('serial.totalQty') }}
                        </span>
                        <span class="text-2xl font-bold text-primary-600">
                            {{ totalQty }}
                        </span>
                    </div>

                    <div class="flex gap-3">
                        <BaseButton :label="t('common.cancel')" variant="ghost"
                            class="w-24 border-gray-300 text-gray-700 hover:bg-gray-50 bg-white" @click="close" />

                        <BaseButton :label="t('serial.finalizeSave')"
                            class="w-40 bg-primary-600 hover:bg-primary-700 text-white border-0" @click="save" />
                    </div>
                </div>

            </div>
        </div>
    </Dialog>
</template>

<style scoped>
:deep(.p-dialog-content) {
    padding: 24px;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: #E2E8F0;
    color: #475569;
    font-weight: 700;
}
</style>
