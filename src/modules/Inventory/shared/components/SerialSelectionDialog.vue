<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { toastService } from "@/app/services/toastService";

const { t } = useI18n();

const props = defineProps<{
    visible: boolean;
    serials: any[];
}>();

const emit = defineEmits(['update:visible', 'select']);

const selectedSerial = ref<any>(null);
const selectedSerials = ref<any>([]);

const isVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
});
const availableSerials = computed(() => props.serials.map(item => ({ ...item, label: item.mainSerial, value: item.mainSerial })));

const selectItem = () => {
    const selected = props.serials.find(serial => serial.mainSerial === selectedSerial.value);
    if (selected) {
        selectedSerials.value.push(selected);
    }
    selectedSerial.value = null;
};

const selectSerials = () => {
    if (selectedSerials.value.length === 0) {
        toastService.error(t('serial.selectAtLeastOneSerial'));
    } else {
        emit('select', selectedSerials.value);
        isVisible.value = false;
    }
};

const totalQuantity = computed(() => selectedSerials.value.reduce((total: number, serial: any) => total + serial.availableQuantity, 0));

const columns = computed(() => [
    { field: 'mainSerial', header: t('serial.serial') },
    { field: 'availableQuantity', header: t('serial.qty') },
    { field: 'batchNumber', header: t('serial.batch') },
    { field: 'expireDate', header: t('serial.expire'), type: 'date' },
    { field: 'serialNumber2', header: t('serial.serialNumber2') },
    { field: 'comment', header: t('serial.comment') },
    { field: 'action', header: '' }
]);

const removeSerial = (data: any) => {
    const index = selectedSerials.value.indexOf(data);
    if (index !== -1) {
        selectedSerials.value.splice(index, 1);
    }
};

</script>

<template>
    <Dialog v-model:visible="isVisible" modal :closable="false">
        <div class="grid grid-cols-3 gap-4 p-4">
            <div class="p-5 bg-white col-span-1">
                <div class="h-full flex flex-col justify-between">
                    <div class="mb-56">
                        <p class="font-bold text-xl">{{ $t('serial.selectSerialAndQuantity') }}</p>
                        <FormDropdown class="w-full mt-5" :label="$t('serial.serialNumber')" :options="availableSerials"
                            v-model="selectedSerial" :placeholder="$t('serial.selectSerial')" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <BaseButton label="serial.addSerial" variant="primary" block @click="selectItem" />
                        <BaseButton label="button.cancel" variant="ghost" block @click="isVisible = false" />
                    </div>
                </div>
            </div>
            <div class="rounded-xl p-0 bg-primary-50 col-span-2 flex flex-col justify-between">
                <div class="p-5">
                    <PageHeader title="serial.addedSerial" subtitle="serial.identifyItems" :showSearch="false" />
                    <DynamicTable :columns="columns" :data="selectedSerials" :paginator="false"
                        class="h-full bg-transparent">
                        <template #col-batchNumber="{ data }">
                            <span class="uppercase bg-white border border-gray-200 px-2 py-1 rounded text-gray-600">
                                {{ data.batchNumber }}
                            </span>
                        </template>
                        <template #col-serialNumber2="{ data }">
                            <span class="uppercase bg-white border border-gray-200 px-2 py-1 rounded text-gray-600">
                                {{ data.serialNumber2 }}
                                <br>
                                {{ data.serialNumber3 }}
                            </span>
                        </template>
                        <template #col-action="{ data }">
                            <button class="text-red-400 hover:text-red-600" @click="removeSerial(data)">
                                <VsxIcon iconName="Trash" :size="20" type="linear" color="#F04438" />
                            </button>
                        </template>
                    </DynamicTable>

                    <p v-if="selectedSerials.length === 0" class="text-center text-danger-500">{{ $t('serial.selectAtLeastOneSerial') }}</p>
                </div>
                <div class="grid grid-cols-4 justify-between bg-white py-5">
                    <div class="col-span-1">
                        <p class="text-gray-500">{{ $t('serial.totalQty') }}</p>
                        <p class="text-primary-500 font-bold">{{ totalQuantity }}</p>
                    </div>
                    <div class="col-span-1"></div>
                    <div class="col-span-2 flex gap-1 ">
                        <BaseButton label="button.cancel" variant="ghost" block @click="isVisible = false" />
                        <BaseButton label="serial.finalizeSave" variant="primary" block @click="selectSerials" />
                    </div>
                </div>

            </div>
        </div>
    </Dialog>
</template>

<style scoped>
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
