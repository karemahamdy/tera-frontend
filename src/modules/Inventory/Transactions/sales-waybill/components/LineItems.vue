<script setup lang="ts">
import ItemSelectionDialog from '@/modules/Inventory/shared/components/ItemSelectionDialog.vue';
import SalesQuantitySerialDialog from '@/modules/Inventory/shared/components/SalesQuantitySerialDialog.vue';
import StorageLocationPicker from '@/modules/Inventory/shared/components/StorageLocationPicker.vue';
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useInventoryLookups } from "@/composables/useInventoryLookups";

const { t } = useI18n();
const {
    getWarehouseLookups, WarehouseLookups,
    getZonesLookups, ZonesLookups,
    getUnitsLookups, UnitsLookups,
    getItemsLookups, itemsLookups,
    getWarehouseHierarchyLookups, WarehouseHierarchyLookups,
    getItemBalance
} = useInventoryLookups();

const props = defineProps<{
    lineItems?: any[];
    disabled?: boolean;
}>();

const emit = defineEmits(['next', 'prev', 'update']);

// const activeZonesLookups = ref<any[]>([]);

// --- State ---
const items = ref<any[]>([]);

onMounted(async () => {
    await Promise.all([
        getWarehouseLookups(),
        getUnitsLookups(),
        getItemsLookups(),
        getWarehouseHierarchyLookups()
    ]);

    if (props.lineItems && props.lineItems.length > 0) {
        items.value = props.lineItems.map(i => ({ ...i, balance: 0, tracked: i.tracked ?? true }));
        // Fetch balances for existing items
        for (const item of items.value) {
            fetchItemBalance(item);
        }
    }
});

function calcTotal(qty: number, price: number, tax: number) {
    const sub = (qty || 0) * (price || 0);
    return sub + (sub * (tax || 0)) / 100;
}

function emitUpdate() {
    emit('update', [...items.value]);
}

// --- Computed ---
const subtotal = computed(() => items.value.reduce((sum: number, item: any) => sum + (Number(item.total) || 0), 0));

const columns = computed(() => [
    { field: 'code', header: t('itemsList.itemCode') },
    { field: 'name', header: t('itemsList.itemName') },
    { field: 'unitId', header: t('itemsList.uom') },
    { field: 'warehouseId', header: t('itemsList.warehouse') },
    { field: 'zoneId', header: t('itemsList.zone') },
    { field: 'quantity', header: t('itemsList.quantity') },
    { field: 'balance', header: t('itemList.balance') },
    { field: 'unitPrice', header: t('itemsList.unitPrice') },
    { field: 'tax', header: t('itemsList.tax') },
    { field: 'total', header: t('itemsList.total') },
    { field: 'action', header: '' }
]);

// --- Item Selection Dialog ---
const showItemDialog = ref(false);
const availableItems = computed(() => itemsLookups.value);

const openItemDialog = () => {
    if (!props.disabled) showItemDialog.value = true;
};

const handleSelectItem = (item: any) => {
    items.value.push({
        // id: Date.now().toString(),
        itemId: item.id || item.itemId,
        trackingType: item.trackingType || null,
        code: item.code,
        name: item.name,
        quantity: 1,
        unitId: item.baseUnitId || null,
        uom: item.baseUnitName || 'PCS',
        warehouse: '',
        warehouseId: null,
        zone: '',
        zoneId: null,
        locationId: null,
        locationCode: '',
        row: '',
        column: '',
        rack: '',
        unitPrice: 0,
        tax: 0,
        total: 0,
        isBlocked: false,
        note: "",
        balance: 0,
        tracked: item.trackingType === 'Serial' || item.trackingType === 'None' || item.tracked,
        serials: []
    });
    emitUpdate();
};

const fetchItemBalance = async (item: any) => {
    if (item.itemId && item.warehouseId) {
        item.balance = await getItemBalance(item.itemId, item.warehouseId, item.zoneId, item.locationId);
    } else {
        item.balance = 0;
    }
};

const handleWarehouseChange = async (val: string, rowData: any) => {
    rowData.warehouseId = val;
    const wh = WarehouseLookups.value.find(w => w.value === val);
    if (wh) {
        rowData.warehouse = wh.label;
        rowData.zone = '';
        rowData.zoneId = null;
        rowData.locationCode = '';
        rowData.locationId = null;

        if (wh.type === 'Professional') {
            isLoadingLocation.value = true;
            loadingLocationItemId.value = rowData.id;
            try {
                await getWarehouseHierarchyLookups();
            } finally {
                isLoadingLocation.value = false;
                loadingLocationItemId.value = null;
            }
            openLocationPicker(rowData);
        } else {
            await getZonesLookups(val);
        }
        await fetchItemBalance(rowData);
    } else {
        rowData.zoneId = null;
        rowData.balance = 0;
    }
    emitUpdate();
};

const showLocationPicker = ref(false);
const locationPickerTarget = ref<any>(null);
const isLoadingLocation = ref(false);
const loadingLocationItemId = ref<any>(null);

const currentLocations = computed(() => {
    if (!locationPickerTarget.value) return [];
    const wh = WarehouseHierarchyLookups.value.find(w => w.warehouseId === locationPickerTarget.value.warehouseId);
    return wh?.locations || [];
});

const openLocationPicker = (item: any) => {
    if (!item.warehouseId || props.disabled) return;
    const wh = WarehouseHierarchyLookups.value.find(w => w.warehouseId === item.warehouseId);
    if (wh?.warehouseType === 'Professional') {
        locationPickerTarget.value = item;
        showLocationPicker.value = true;
    }
};

const handleSelectLocation = async (location: any) => {
    if (locationPickerTarget.value) {
        locationPickerTarget.value.zone = location.zoneName;
        locationPickerTarget.value.zoneId = location.zoneId;
        locationPickerTarget.value.locationId = location.locationId;
        locationPickerTarget.value.locationCode = location.locationCode;
        locationPickerTarget.value.row = location.row;
        locationPickerTarget.value.column = location.column;
        locationPickerTarget.value.rack = location.rack;
        // Refresh balance after location selection
        await fetchItemBalance(locationPickerTarget.value);
    }
    emitUpdate();
};

// --- Quantity/Serial Dialog ---
const showQtyDialog = ref(false);
const currentItem = ref<any>(null);

const openQtyDialog = (item: any) => {
    if (props.disabled) return;
    currentItem.value = item;
    showQtyDialog.value = true;
};

const handleSaveSerials = (payload: any) => {
    if (currentItem.value) {
        currentItem.value.serials = payload.serials;
        currentItem.value.quantity = payload.totalQty;
        currentItem.value.total = calcTotal(payload.totalQty, currentItem.value.unitPrice, currentItem.value.tax);
    }
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
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-xl font-bold text-gray-900">{{ t('itemsList.title') }}</h2>
                <p class="text-gray-500 text-sm">
                    {{ t('itemsList.description') }}
                </p>
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
                        <Badge v-if="data.trackingType === 'Serial'" severity="success" class="circle-badge-sm">
                            <VsxIcon iconName="Airdrop" :size="20" type="linear" />
                        </Badge>
                        <Badge v-else severity="transparent" class="circle-badge">
                            <VsxIcon iconName="Airdrop" :size="20" type="linear" class="icon-transparent" />
                        </Badge>
                        <div class="text-base text-gray-700">{{ data.code }}</div>
                        </div>       
                    </template>

                     <template #col-quantity="{ data }">
          <div class="flex items-center gap-2">
            <template v-if="data.trackingType === 'Serial'">
              <BaseButton :label="disabled ? t('button.view') : t('itemsList.add')" variant="outline-primary"
                @click="openQtyDialog(data)" />
              <span class="text-gray-500">({{ data.quantity }})</span>
            </template>
            <template v-else>
              <InputText v-if="!disabled" v-model.number="data.quantity" class="w-20 p-inputtext-sm" @input="() => {
                data.total = calcTotal(data.quantity, data.tax, data.unitPrice);
                emitUpdate();
              }" />
              <span v-else class="text-gray-700">
                {{ data.quantity }}
              </span>
            </template>
          </div>
        </template>

                <template #col-name="{ data }">
                    <span class="text-gray-600">{{ data.name }}</span>
                </template>

                <!-- <template #col-quantity="{ data }">
                    <div class="flex items-center gap-2">
                        <BaseButton v-if="!disabled" :label="t('itemsList.add')" variant="outline-primary"
                            @click="openQtyDialog(data)" />
                        <span class="text-gray-500">({{ data.quantity }})</span>
                    </div>
                </template> -->

                <template #col-unitId="{ data }">
                    <FormDropdown :modelValue="data.unitId" :options="UnitsLookups" optionLabel="label"
                        optionValue="value" class="w-24 p-inputtext-sm text-sm" :disabled="disabled" @update:modelValue="(v: any) => {
                            data.unitId = v;
                            const unit = UnitsLookups.find(u => u.value === v);
                            if (unit) data.uom = unit.label;
                            emitUpdate();
                        }" />
                </template>

                <template #col-warehouseId="{ data }">
                    <FormDropdown :modelValue="data.warehouseId"
                        @update:modelValue="handleWarehouseChange($event, data)" :options="WarehouseLookups"
                        optionLabel="label" optionValue="value" class="w-28 p-inputtext-sm text-sm"
                        :placeholder="t('items.warehouse')" :disabled="disabled" />
                </template>

                <template #col-zoneId="{ data }">
                    <div class="flex flex-col gap-1">
                        <template
                            v-if="WarehouseHierarchyLookups.find(w => w.warehouseId === data.warehouseId)?.warehouseType === 'Professional' || (isLoadingLocation && loadingLocationItemId === data.id)">
                            <!-- Loading spinner while fetching hierarchy -->
                            <div v-if="isLoadingLocation && loadingLocationItemId === data.id"
                                class="flex items-center gap-2 text-xs text-primary-500 font-medium py-1 px-2 border border-primary-200 rounded-lg">
                                <ProgressSpinner style="width:14px;height:14px" strokeWidth="6" />
                                <span>Loading...</span>
                            </div>
                            <BaseButton v-else-if="!disabled" :label="data.locationCode || t('itemList.selectZone')"
                                variant="outline-primary"
                                class="!px-3 !py-1.5 !text-xs !rounded-lg !border-primary-200 min-w-28 text-center justify-center flex"
                                @click="openLocationPicker(data)" />

                            <span v-else-if="disabled" class="text-gray-700">{{ data.locationCode || '—' }}</span>

                            <div v-if="data.locationCode" class="text-[10px] text-gray-400 font-medium leading-tight">
                                {{ data.zone }} <template v-if="data.row">(R:{{ data.row }} C:{{ data.column }} R:{{
                                    data.rack }})</template>
                            </div>
                        </template>
                        <template v-else-if="data.warehouseId">
                            <FormDropdown v-model="data.zoneId" :options="ZonesLookups" optionLabel="label"
                                optionValue="value" class="w-28 p-inputtext-sm text-sm" :placeholder="t('items.zone')"
                                :disabled="disabled" />
                        </template>
                    </div>
                </template>

                <template #col-balance="{ data }">
                    <div class="flex items-center gap-1.5">
                        <span>
                            {{ data.balance || 0 }}
                        </span>
                        <span class="text-[10px] text-gray-400 font-medium uppercase">{{ data.uom || 'PCS' }}</span>
                    </div>
                </template>

                <template #col-unitPrice="{ data }">
                    <InputText v-model.number="data.unitPrice" class="w-20 p-inputtext-sm" :disabled="disabled" @input="(e: any) => {
                        const v = Number(e.target.value) || 0;
                        data.unitPrice = v;
                        data.total = calcTotal(data.quantity, v, data.tax);
                        emitUpdate();
                    }" />
                </template>

                <template #col-tax="{ data }">
                    <InputText v-model.number="data.tax" class="w-16 p-inputtext-sm" prefix="%" :disabled="disabled"
                        @input="(e: any) => {
                            const v = Number(e.target.value) || 0;
                            data.tax = v;
                            data.total = calcTotal(data.quantity, data.unitPrice, v);
                            emitUpdate();
                        }" />
                </template>

                <template #col-total="{ data }">
                    <span class="font-medium text-gray-900">{{ Number(data.total || 0).toFixed(2) }}</span>
                </template>

                <template #col-action="{ data }">
                    <button v-if="!disabled" class="text-red-400 hover:text-red-600" @click="removeItem(data)">
                        <VsxIcon iconName="Trash" :size="20" type="linear" color="#F04438" />
                    </button>
                </template>
            </DynamicTable>
        </div>

        <!-- Subtotal Footer -->
        <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
            <span class="text-gray-600 font-medium">
                {{ t('itemsList.subtotal') }} ({{ items.length }} {{ t('itemsList.items') }})
            </span>
            <span class="text-xl font-bold text-primary-600">
                ${{ subtotal.toFixed(2) }}
            </span>
        </div>

        <ItemSelectionDialog v-model:visible="showItemDialog" :items="availableItems" @select="handleSelectItem" />
        <SalesQuantitySerialDialog v-if="currentItem" v-model:visible="showQtyDialog" :item="currentItem"
            :initialSerials="currentItem.serials" :warehouseId="currentItem.warehouseId" :zoneId="currentItem.zoneId"
            :locationId="currentItem.locationId" @save="handleSaveSerials" />
        <StorageLocationPicker v-if="showLocationPicker" v-model:visible="showLocationPicker"
            :locations="currentLocations" :selectedLocationId="locationPickerTarget?.locationId"
            @select="handleSelectLocation" />

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
