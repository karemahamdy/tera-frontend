<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useForm } from "vee-validate";
import { useI18n } from 'vue-i18n';
import { useLookups } from '@/composables/useLookups';
import { materialSchema } from '../validation/BOMSchema';
import ItemSelectionDialog from '@/modules/Production/sharedComponents/ItemSelectionDialog.vue';

const { t } = useI18n();
const { GetAllItemRawLockUp, itemsRowLookups } = useLookups();
const { } = useForm({ validationSchema: materialSchema });
const showItemDialog = ref(false);
const items = ref<any[]>([]);

const emit = defineEmits(['next', 'prev', 'update']);
const props = defineProps<{
    lineItems?: any[];
    disabled?: boolean;
}>();

const columns = computed(() => [
    { field: 'itemCode', header: t('itemList.itemCode') },
    { field: 'itemName', header: t('itemList.itemName') },
    { field: 'quantity', header: t('itemList.quantity') },
    { field: 'unitId', header: t('itemList.UOM') },
    { field: 'scrap', header: t('BOM.scrap') },
    { field: 'notes', header: t('downtime.notes') },
    ...(props.disabled ? [] : [{ field: 'action', header: '' }])
]);
const availableItems = computed(() => itemsRowLookups.value);
onMounted(async () => {
    await Promise.all([
        GetAllItemRawLockUp(),
    ]);
});

function emitUpdate() {
    emit('update', [...items.value]);
}
const openItemDialog = () => {
    if (!props.disabled) showItemDialog.value = true;
};
const handleSelectItem = (item: any) => {
    const mappedUnits = item.units?.map((unit: any) => ({
        label: `${unit.unitName} (${unit.unitCode})`,
        value: unit.unitId,
    })) ?? [];
    const baseUnit = item.units?.find((unit: any) => unit.isBase === true);
    items.value.push({
        itemId: item.itemId,
        tracked: item.tracked || null,
        itemCode: item.itemCode,
        itemName: item.itemName,
        unitId: baseUnit?.unitId ?? mappedUnits[0]?.value,
        quantity: 1,
        scrap: 0,
        units: mappedUnits,
        notes: '',
    });
    emitUpdate();
};

function getQtyError(item: any): string {
    if ( item.quantity <= 0) {
        return t("validation.invalidQuantity");
    }
    return "";
}

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
                <h2 class="text-xl font-bold text-gray-900">{{ t('steps.Materials') }}</h2>
            </div>
            <BaseButton v-if="!disabled" :label="t('workOrder.addItem')" icon="AddSquare"
                class="bg-primary-600 border-none hover:bg-primary-700 font-semibold px-4 py-2 rounded-lg"
                @click="openItemDialog" />
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <DynamicTable :columns="columns" :data="items" :paginator="false" :showView="false" :showEdit="false"
                :showDelete="false">
                <template #col-itemCode="{ data }">
                    <div class="flex items-center gap-2 rounded">
                        <Badge v-if="data.tracked" severity="success" class="circle-badge-sm">
                            <VsxIcon iconName="Brodcast" :size="20" type="linear" />
                        </Badge>
                        <Badge v-else severity="transparent" class="circle-badge">
                            <VsxIcon iconName="Brodcast" :size="20" type="linear" class="icon-transparent" />
                        </Badge>
                        <div class="text-base text-gray-700">{{ data.itemCode }}</div>
                    </div>
                </template>
                <template #col-quantity="{ data }">
                    <div class="flex items-center gap-2">
                        <InputText v-model.number="data.quantity" type="number" class="w-20 p-inputtext-sm" />
                        <small v-if="getQtyError(data)" class="text-danger-300 text-xs">
                            {{ getQtyError(data) }}
                        </small>
                    </div>
                </template>
                <template #col-scrap="{ data }">
                    <div class="flex items-center gap-2">
                        <InputText v-model.number="data.scrap" type="number" class="w-20 p-inputtext-sm" />
                    </div>
                </template>
                <template #col-notes="{ data }">
                    <div class="flex items-center gap-2">
                        <InputText v-model="data.notes" class="w-28 p-inputtext-sm" />
                    </div>
                </template>
                <template #col-unitId="{ data }">
                    <FormDropdown v-model="data.unitId" :options="data.units" optionLabel="label" optionValue="value"
                        class="w-34 p-inputtext-sm text-sm" />
                </template>
                <template #col-itemName="{ data }">
                    <span class="text-gray-600">{{ data.itemName }}</span>
                </template>
                <template #col-action="{ data }">
                    <button v-if="!disabled" class="text-red-400 hover:text-red-600" @click="removeItem(data)">
                        <VsxIcon iconName="Trash" :size="20" type="linear" color="#F04438" />
                    </button>
                </template>
            </DynamicTable>
        </div>
        <ItemSelectionDialog v-model:visible="showItemDialog" :items="availableItems" @select="handleSelectItem" />

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
