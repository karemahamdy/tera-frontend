<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ItemSelectionDialog from '@/modules/Inventory/shared/components/ItemSelectionDialog.vue';
import QuantitySerialDialog from '@/modules/Inventory/shared/components/QuantitySerialDialog.vue';
import StorageLocationPicker from '@/modules/Inventory/shared/components/StorageLocationPicker.vue';
import FormDropdown from '@/sharedComponents/inputs/FormDropdown.vue';
import { useInventoryLookups } from '@/composables/useInventoryLookups';
import type { LineItem } from '../types/PurchaseWaybill';

const props = withDefaults(defineProps<{
  lineItems?: LineItem[] | null;
  disabled?: boolean;
  errors?: Record<string, string>;
}>(), {
  lineItems: null,
  disabled: false,
  errors: () => ({}),
});

const { t } = useI18n();
const emit = defineEmits(['next', 'prev', 'update']);
const { getItemsLookups, itemsLookups, getUnitsLookups, getWarehouseHierarchyLookups, WarehouseHierarchyLookups, getWarehouseLookups, WarehouseLookups } = useInventoryLookups();

const unitOptionsMap = ref<Record<number | string, any[]>>({});

function calcTotal(qty: number, price: number, _tax?: number) {
  return (qty || 0) * (price || 0);
}

function mapApiItem(item: LineItem) {
  unitOptionsMap.value[item.id] = [{ label: item.unitName, value: item.unitName, unitId: item.unitId, conversionFactor: 1 }];
  return {
    id: item.id,
    lineNumber: item.lineNumber,
    itemId: item.itemId,
    code: item.itemCode,
    name: item.itemName,
    quantity: item.quantity,
    uom: item.unitName,
    unitId: item.unitId,
    itemType: '',
    warehouse: item.warehouseName,
    warehouseId: item.warehouseId,
    zone: item.zoneName ?? '',
    zoneId: item.zoneId ?? null,
    unitPrice: Number(item.unitPrice) || 0,
    tax: Number(item.unitTaxPercent) || 0,
    total: item.lineTotal,
    serials: (item.serials ?? []).map((s: any) => ({
      id: s.id, mainSerial: s.mainSerial, qty: s.quantity, batchNumber: s.batchNumber, expireDate: s.expireDate
    })),
    isBlocked: item.isBlocked,
    // tracked: (item.serials && item.serials.length > 0) || item.quantity > 0,
    trackingType: item.trackingType
  };
}

const items = ref<any[]>((props.lineItems ?? []).map(mapApiItem));
const itemsError = ref("");

function emitUpdate() {
  emit('update', items.value);
}

function validate(): boolean {
  itemsError.value = items.value.length > 0 ? "" : t("validation.atLeastOneItem");
  return !itemsError.value;
}

defineExpose({ validate });

const subtotal = computed(() => items.value.reduce((sum: number, item: any) => sum + (item.total || 0), 0));

const columns = computed(() => [
  { field: 'code', header: t('itemsList.itemCode') },
  { field: 'name', header: t('itemsList.itemName') },
  { field: 'quantity', header: t('itemsList.quantity') },
  { field: 'uom', header: t('itemsList.uom') },
  { field: 'warehouse', header: t('itemsList.warehouse') },
  { field: 'zone', header: t('itemsList.zone') },
  { field: 'unitPrice', header: t('itemsList.unitPrice') },
  { field: 'tax', header: t('itemsList.tax') },
  { field: 'total', header: t('itemsList.total') },
  ...(props.disabled ? [] : [{ field: 'action', header: '' }])
]);

const showItemDialog = ref(false);
const availableItems = computed(() => itemsLookups.value.map(item => ({ ...item, label: item.name, value: item.id })));

const openItemDialog = async () => {
  await getItemsLookups();
  showItemDialog.value = true;
};

const handleSelectItem = (selectedItem: any) => {
  console.log(selectedItem);
  
  showItemDialog.value = false;
  const originalItem = itemsLookups.value.find(i => i.id === selectedItem.id);
  const units = originalItem?.units || selectedItem.units || [];
  const baseUnit = units.find((u: any) => u.isBaseUnit);
  const rowId = Date.now();

  unitOptionsMap.value[rowId] = units.map((u: any) => ({
    label: u.unitCode ? `${u.unitName} (${u.unitCode})` : u.unitName,
    value: u.unitName,
    unitId: u.unitId,
    conversionFactor: u.conversionFactor
  }));

  const qty = 1, price = 0, tax = 0;
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
    warehouse: '',
    warehouseId: '',
    zone: '',
    zoneId: null,
    unitPrice: price,
    tax: tax,
    total: calcTotal(qty, price, tax),
    serials: [],
    trackingType: selectedItem.trackingType || null, 
  };
  items.value.push(newItem);
  emitUpdate();
};

const showQtyDialog = ref(false);
const currentItem = ref<any>(null);

const openQtyDialog = (item: any) => {
  currentItem.value = item;
  showQtyDialog.value = true;
};

const handleSaveSerials = (payload: any) => {
  showQtyDialog.value = false;
  if (currentItem.value) {
    currentItem.value.serials = payload.serials;
    currentItem.value.quantity = payload.totalQty;
    currentItem.value.total = calcTotal(payload.totalQty, currentItem.value.unitPrice, currentItem.value.tax);
  }
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
    getWarehouseLookups(),
    getWarehouseHierarchyLookups()
  ]);
});

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
  if (!item.warehouseId) return;
  const wh = WarehouseHierarchyLookups.value.find(w => w.warehouseId === item.warehouseId);
  if (wh?.warehouseType === 'Professional') {
    locationPickerTarget.value = item;
    showLocationPicker.value = true;
  }
};

const handleSelectLocation = (location: any) => {
  if (locationPickerTarget.value) {
    locationPickerTarget.value.zone = location.zoneName;
    locationPickerTarget.value.zoneId = location.zoneId;
    locationPickerTarget.value.locationCode = location.locationCode;
    locationPickerTarget.value.row = location.row;
    locationPickerTarget.value.column = location.column;
    locationPickerTarget.value.rack = location.rack;
  }
  emitUpdate();
};

const handleWarehouseChange = async (item: any) => {
  const wh = WarehouseLookups.value.find(w => w.value === item.warehouseId);
  if (wh) {
    item.warehouse = wh.label;
    // Reset zone/location when warehouse changes
    item.zone = '';
    item.zoneId = null;
    item.locationCode = '';
    // If Professional, fetch hierarchy first then auto-open picker
    if (wh.type === 'Professional') {
      isLoadingLocation.value = true;
      loadingLocationItemId.value = item.id;
      try {
        await getWarehouseHierarchyLookups();
      } finally {
        isLoadingLocation.value = false;
        loadingLocationItemId.value = null;
      }
      openLocationPicker(item);
    }
  }
  emitUpdate();
};

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

    <!-- Validation error -->
    <div v-if="itemsError" class="mb-4 px-4 py-2 bg-red-50 border border-red-300 text-red-600 rounded-lg text-sm">
      {{ itemsError }}
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <DynamicTable :columns="columns" :data="items" :paginator="false" :showView="false" :showEdit="false"
        :showDelete="false">
        <template #col-code="{ data }">
          <div class="flex items-center gap-2 rounded">
            <Badge v-if="data.trackingType === 'Serial'" severity="success" class="circle-badge-sm">
              <VsxIcon iconName="Brodcast" :size="20" type="linear" />
            </Badge>
            <Badge v-else severity="transparent" class="circle-badge">
              <VsxIcon iconName="Brodcast" :size="20" type="linear" class="icon-transparent" />
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
             <InputText
  :value="data.quantity"
  class="w-20 p-inputtext-sm"
  :disabled="disabled"
  @input="(e: any) => {
    const v = Number(e.target.value) || 0;
    data.quantity = v;
    data.total = calcTotal(v, data.unitPrice, data.tax);
    emitUpdate();
  }"
/>
            </template>
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

        <template #col-warehouse="{ data }">
          <span v-if="disabled" class="text-gray-700">{{ data.warehouse }}</span>
          <div v-else class="min-w-32">
            <FormDropdown :modelValue="data.warehouseId" :options="WarehouseLookups" label=""
              :placeholder="t('items.warehouse')"
              @update:modelValue="(v: any) => { data.warehouseId = v; handleWarehouseChange(data); }"
              class="warehouse-dropdown" />
          </div>
        </template>

        <template #col-zone="{ data }">
          <div class="flex flex-col gap-1">
            <template
              v-if="WarehouseHierarchyLookups.find(w => w.warehouseId === data.warehouseId)?.warehouseType === 'Professional' || (isLoadingLocation && loadingLocationItemId === data.id)">
              <!-- Loading spinner while fetching hierarchy -->
              <div v-if="isLoadingLocation && loadingLocationItemId === data.id"
                class="flex items-center gap-2 text-xs text-primary-500 font-medium py-1 px-2 border border-primary-200 rounded-lg">
                <ProgressSpinner style="width:14px;height:14px" strokeWidth="6" />
                <span>Loading...</span>
              </div>
              <BaseButton
                v-else-if="!disabled"
                :label="data.locationCode || data.zone || t('itemList.selectZone')"
                variant="outline-primary" class="!px-3 !py-1.5 !text-xs !rounded-lg !border-primary-200"
                @click="openLocationPicker(data)" />
              <span v-else-if="disabled" class="text-gray-700">{{ data.locationCode || data.zone || '—' }}</span>
              <!-- <div v-if="data.locationCode || data.zone" class="text-[10px] text-gray-400 font-medium leading-tight">
                {{ data.zone }} <template v-if="data.row">(R:{{ data.row }} C:{{ data.column }} R:{{ data.rack
                  }})</template>
                  
                </div> -->
                <span v-else-if="!disabled" class="text-gray-400 italic text-xs">{{ t('itemList.zoneDisabled') }}</span>
            </template>
            <template v-else-if="data.warehouseId">
              <!-- In view mode show zone name if available; in edit mode show disabled hint -->
              <span v-if="disabled && data.zone" class="text-gray-700">{{ data.zone }}</span>
              <span v-else-if="!disabled" class="text-gray-400 italic text-xs">{{ t('itemList.zoneDisabled') }}</span>
            </template>
          </div>
        </template>

        <template #col-unitPrice="{ data }">
          <span v-if="disabled" class="text-gray-700">{{ data.unitPrice }}</span>
          <InputText v-else v-model.number="data.unitPrice" class="w-20 p-inputtext-sm" :disabled="disabled" @input="() => {
            data.total = calcTotal(data.quantity, data.unitPrice, data.tax);
            emitUpdate();
          }" />
        </template>

        <template #col-tax="{ data }">
          <span v-if="disabled" class="text-gray-700">{{ data.tax }}%</span>
          <InputText  v-else v-model.number="data.tax" class="w-16 p-inputtext-sm" :disabled="disabled" @input="() => {
            data.total = calcTotal(data.quantity, data.unitPrice, data.tax);
            emitUpdate();
          }" />
        </template>

        <template #col-total="{ data }">
          <span class="font-medium text-gray-900">{{ Number(data.total).toFixed(2) }}</span>
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
        {{ t('itemsList.subtotal') }} ({{ items.length }} {{ t('itemsList.items') }})
      </span>
      <span class="text-xl font-bold text-primary-600">{{ subtotal.toFixed(2) }}</span>
    </div>

    <ItemSelectionDialog v-if="showItemDialog" v-model:visible="showItemDialog" :items="availableItems"
      @select="handleSelectItem" />

    <QuantitySerialDialog v-if="showQtyDialog && currentItem" v-model:visible="showQtyDialog" :item="currentItem"
      :initialSerials="currentItem.serials" :disabled="disabled" @save="handleSaveSerials" />
      
    <StorageLocationPicker v-if="showLocationPicker" v-model:visible="showLocationPicker" :locations="currentLocations"
      :selectedLocationId="locationPickerTarget?.locationId" @select="handleSelectLocation" />
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
