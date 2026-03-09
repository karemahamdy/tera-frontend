<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ItemSelectionDialog from '@/modules/Inventory/shared/components/ItemSelectionDialog.vue';
import { useInventoryLookups } from '@/composables/useInventoryLookups';

const props = withDefaults(defineProps<{
    lineItems?: any[] | null;
    disabled?: boolean;
}>(), {
    lineItems: null,
    disabled: false,
});

const { t } = useI18n();
const emit = defineEmits(['next', 'prev', 'update']);
const { getItemsLookups, itemsLookups, getUnitsLookups } = useInventoryLookups();

const unitOptionsMap = ref<Record<number | string, any[]>>({});

function mapApiItem(item: any) {
    if (!unitOptionsMap.value[item.id]) {
        unitOptionsMap.value[item.id] = [{ label: item.unitName || item.uom, value: item.unitName || item.uom, unitId: item.unitId, conversionFactor: 1 }];
    }
    return {
        id: item.id || Date.now() + Math.random(),
        lineNumber: item.lineNumber,
        itemId: item.itemId,
        code: item.itemCode || item.code,
        name: item.itemName || item.name,
        quantity: item.quantity || 0,
        uom: item.unitName || item.uom,
        unitId: item.unitId,
        itemType: item.itemType || '',
        isBlocked: item.isBlocked || false,
        tracked: item.trackingType === 'Serial' || item.trackingType === 'None' || item.tracked,
        isSerialTracked: item.trackingType === 'Serial',
    };
}

const items = ref<any[]>((props.lineItems ?? []).map(mapApiItem));

function emitUpdate() {
    emit('update', [...items.value]);
}

const subtotal = computed(() => {
    return items.value.length;
});

const columns = computed(() => [
    { field: 'code', header: t('itemsList.itemCode') },
    { field: 'name', header: t('itemsList.itemName') },
    { field: 'quantity', header: t('itemsList.quantity') },
    { field: 'uom', header: t('itemsList.uom') },
    ...(props.disabled ? [] : [{ field: 'action', header: '' }])
]);

const showItemDialog = ref(false);
const availableItems = computed(() => itemsLookups.value.map(item => ({ ...item, label: item.name, value: item.id })));

const openItemDialog = async () => {
    await getItemsLookups();
    showItemDialog.value = true;
};

const handleSelectItem = (selectedItem: any) => {
    showItemDialog.value = false;
    const originalItem = itemsLookups.value.find(i => i.id === selectedItem.id);
    const units = originalItem?.units || selectedItem.units || [];
    const baseUnit = units.find((u: any) => u.isBaseUnit);
    const rowId = Date.now() + Math.random();

    unitOptionsMap.value[rowId] = units.map((u: any) => ({
        label: u.unitCode ? `${u.unitName} (${u.unitCode})` : u.unitName,
        value: u.unitName,
        unitId: u.unitId,
        conversionFactor: u.conversionFactor
    }));

    const qty = 1;
    const newItem = {
        id: rowId,
        itemId: selectedItem.id,
        code: selectedItem.code,
        name: selectedItem.name,
        barcode: selectedItem.barcode || '',
        itemType: selectedItem.itemType || '',
        quantity: qty,
        uom: baseUnit ? baseUnit.unitName : (selectedItem.baseUnitName || ''),
        unitId: baseUnit ? baseUnit.unitId : (selectedItem.baseUnitId || ''),
        serials: [],
        tracked: true,
        isSerialTracked: originalItem?.trackingType === 'Serial'
    };
    items.value.push(newItem);
    emitUpdate();
};

const removeItem = (data: any) => {
    const index = items.value.findIndex(item => item.id === data.id);
    if (index !== -1) {
        items.value.splice(index, 1);
        delete unitOptionsMap.value[data.id];
    }
    emitUpdate();
};

onMounted(async () => {
    await Promise.all([
        getUnitsLookups(),
    ]);
});

</script>

<template>
    <div class="flex flex-col h-full bg-white rounded-xl">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-xl font-bold text-gray-900">{{ t('itemsList.title') }}</h2>
                <p class="text-gray-500 text-sm">{{ t('itemsList.description') }}</p>
            </div>
            <BaseButton v-if="!disabled" :label="t('itemsList.addItem')"
                class="bg-primary-600 border-none hover:bg-primary-700 font-semibold px-4 py-2 rounded-lg"
                @click="openItemDialog" />
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <DynamicTable :columns="columns" :data="items" :paginator="false" :showView="false" :showEdit="false"
                :showDelete="false">
                <template #col-code="{ data }">
                    <div class="flex items-center gap-2 rounded">
                        <Badge v-if="data.isSerialTracked" severity="success" class="circle-badge-sm">
                            <VsxIcon iconName="Brodcast" :size="20" type="linear" />
                        </Badge>
                        <div class="text-base text-gray-700">{{ data.code }}</div>
                    </div>
                </template>

                <template #col-quantity="{ data }">
                    <div class="flex items-center gap-2">
                        <InputText v-model="data.quantity" class="w-20 p-inputtext-sm" :disabled="disabled"
                            @update:modelValue="emitUpdate" />
                    </div>
                </template>
                <!-- select -->
                <template #col-uom="{ data }">
                    <span v-if="disabled || !unitOptionsMap[data.id]" class="text-gray-700">
                        {{ data.uom }}
                    </span>

                    <div v-else class="min-w-24">
                        <FormDropdown :modelValue="data.uom" :options="unitOptionsMap[data.id] ?? []" label=""
                            :placeholder="t('items.uom')" optionLabel="label" optionValue="value" class="uom-dropdown"
                            @update:modelValue="(v: any) => {
                                data.uom = v;
                                const opt = (unitOptionsMap[data.id] ?? [])
                                    .find((o: any) => o.value === v);
                                if (opt) {
                                    data.unitId = opt.unitId;
                                }
                                emitUpdate();
                            }" />
                    </div>
                </template>


                <template #col-action="{ data }">
                    <button v-if="!disabled" class="text-red-400 hover:text-red-600" @click="removeItem(data)">
                        <VsxIcon iconName="Trash" :size="20" type="linear" color="#F04438" />
                    </button>
                </template>
            </DynamicTable>
        </div>

        <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
            <span class="text-gray-600 font-medium">
                {{ t('itemsList.Showing') }} {{ items.length }} {{ t('itemsList.items') }} {{ t('itemsList.selected') }}
            </span>
            <span class="text-xl font-bold text-primary-600">{{ subtotal }} {{ t('itemsList.items') }}</span>
        </div>

        <ItemSelectionDialog v-if="showItemDialog" v-model:visible="showItemDialog" :items="availableItems"
            @select="handleSelectItem" />

    </div>
</template>

<style scoped>
:deep(.warehouse-dropdown .p-dropdown) {
    background-color: #f9fafb;
    border-color: #f3f4f6;
    border-radius: 0.5rem;
    font-size: 0.875rem;
}
:deep(.warehouse-dropdown label) {
    display: none;
}
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
