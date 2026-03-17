<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import ItemSelectionDialog from '@/modules/Inventory/shared/components/ItemSelectionDialog.vue';
import QuantitySerialDialog from '@/modules/Inventory/shared/components/QuantitySerialDialog.vue';
import SalesQuantitySerialDialog from '@/modules/Inventory/shared/components/SalesQuantitySerialDialog.vue';
import StorageLocationPicker from '@/modules/Inventory/shared/components/StorageLocationPicker.vue';
import { useInventoryLookups } from '@/composables/useInventoryLookups';

const props = withDefaults(defineProps<{
  lineItems?: any[] | null;
  direction?: string;
  disabled?: boolean;
}>(), {
  lineItems: null,
  direction: 'Inbound',
  disabled: false,
});

const { t } = useI18n();
const emit = defineEmits(['update']);
const {
  getItemsLookups, itemsLookups,
  getUnitsLookups, UnitsLookups,
  getWarehouseHierarchyLookups, WarehouseHierarchyLookups,
  getWarehouseLookups, WarehouseLookups,
  getItemBalance
} = useInventoryLookups();

const unitOptionsMap = ref<Record<number | string, any[]>>({});

function calcTotal(qty: number, price: number) {
  return (qty || 0) * (price || 0);
}

function mapApiItem(item: any) {
  unitOptionsMap.value[item.id || item.itemId] = [{
    label: item.unitName || item.unitOfMeasureName,
    value: item.unitName || item.unitOfMeasureName,
    unitId: item.unitOfMeasure || item.unitOfMeasureId,
    conversionFactor: 1
  }];
  // Infer trackingType from serialLots if not explicitly provided
  const hasSerials = (item.serialLots || []).length > 0;
  const trackingType = item.trackingType || (hasSerials ? 'Serial' : null);
  return {
    id: item.id || Date.now() + Math.random(),
    itemId: item.itemId,
    trackingType,
    code: item.itemCode,
    name: item.itemName,
    quantity: item.quantity,
    uom: item.unitName || item.unitOfMeasureName || '',
    unitId: item.unitOfMeasure || item.unitOfMeasureId,
    warehouse: item.warehouseName,
    warehouseId: item.warehouseId,
    zone: item.zoneName ?? '',
    zoneId: item.zoneId ?? null,
    locationId: item.locationId ?? null,
    locationCode: item.locationCode ?? '',
    unitPrice: Number(item.unitPrice) || 0,
    total: Number(item.total) || calcTotal(item.quantity, item.unitPrice),
    row: item.row ?? '',
    column: item.column ?? '',
    rack: item.rack ?? '',
    serials: (item.serialLots || []).map((s: any) => ({
      id: s.id,
      mainSerial: s.mainSerial,
      qty: s.availableQuantity ?? s.qty ?? 0,
      batchNumber: s.batchNumber ?? s.batch ?? null,
      expireDate: s.expireDate ?? s.expire ?? null,
      serialNumber2: s.serialNumber2 ?? null,
      serialNumber3: s.serialNumber3 ?? null,
      comment: s.comment ?? null,
    })),
    balance: item.balance || 0,
    tracked: true,
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
  { field: 'uom', header: t('itemsList.uom') },
  { field: 'warehouse', header: t('itemsList.warehouse') },
  { field: 'zone', header: t('itemsList.zone') },
  { field: 'quantity', header: t('itemsList.quantity') },
  { field: 'unitPrice', header: t('itemsList.unitPrice') },
  { field: 'balance', header: t('itemList.balance') },
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
  showItemDialog.value = false;
  const originalItem = itemsLookups.value.find(i => i.id === selectedItem.id);
  const units = originalItem?.units || selectedItem.units || [];
  const baseUnit = units.find((u: any) => u.isBaseUnit);
  const rowId = Date.now();

  unitOptionsMap.value[rowId] = units.map((u: any) => ({
    label: u.unitCode ? `${u.unitName} (${u.unitCode})` : u.unitName,
    value: u.unitName,
    unitId: u.unitId || u.id,
    conversionFactor: u.conversionFactor
  }));

  // Get the first unit as fallback if no base unit found
  const defaultUnit = baseUnit || units[0];
  const unitIdValue = defaultUnit?.unitId || defaultUnit?.id || selectedItem.baseUnitId || null;

  const newItem = {
    id: rowId,
    itemId: selectedItem.id,
    trackingType: selectedItem.trackingType || null,
    code: selectedItem.code,
    name: selectedItem.name,
    quantity: 1,
    uom: defaultUnit ? defaultUnit.unitName : (selectedItem.baseUnitName || ''),
    unitId: unitIdValue,
    warehouse: '',
    warehouseId: '',
    zone: '',
    zoneId: null,
    locationId: null,
    locationCode: '',
    unitPrice: 0,
    total: 0,
    balance: 0,
    serials: [],
    tracked: true
  };
  items.value.push(newItem);
  emitUpdate();
};

const showQtyDialog = ref(false);
const currentItem = ref<any>(null);
const qtyDialogKey = ref(0);

const openQtyDialog = (item: any) => {
  currentItem.value = null;
  qtyDialogKey.value++;
  nextTick(() => {
    currentItem.value = item;
    showQtyDialog.value = true;
  });
};

const handleSaveSerials = (payload: any) => {
  showQtyDialog.value = false;
  if (currentItem.value) {
    currentItem.value.serials = payload.serials;
    currentItem.value.quantity = payload.totalQty;
    currentItem.value.total = calcTotal(payload.totalQty, currentItem.value.unitPrice);
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
    getWarehouseHierarchyLookups(),
    getItemsLookups()
  ]);

  // For existing items in edit mode, sync their units from itemsLookups
  if (items.value.length > 0) {
    items.value.forEach(item => {
      const originalItem = itemsLookups.value.find(i => i.id === item.itemId);
      if (originalItem?.units) {
        unitOptionsMap.value[item.id] = originalItem.units.map((u: any) => ({
          label: u.unitCode ? `${u.unitName} (${u.unitCode})` : u.unitName,
          value: u.unitName,
          unitId: u.unitId || u.id,
          conversionFactor: u.conversionFactor
        }));

        // If uom name is missing, try to resolve it from the newly synced options
        if (!item.uom && item.unitId) {
          const opt = unitOptionsMap.value[item.id]?.find((o: any) => o.unitId === item.unitId);
          if (opt) item.uom = opt.value;
        }
      }
    });
  }
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

const handleSelectLocation = async (location: any) => {
  if (locationPickerTarget.value) {
    locationPickerTarget.value.zone = location.zoneName;
    locationPickerTarget.value.zoneId = location.zoneId;
    locationPickerTarget.value.locationId = location.id || location.locationId;
    locationPickerTarget.value.locationCode = location.locationCode;
    locationPickerTarget.value.row = location.row;
    locationPickerTarget.value.column = location.column;
    locationPickerTarget.value.rack = location.rack;

    // Fetch balance
    await fetchItemBalance(locationPickerTarget.value);
  }
  emitUpdate();
};

const handleWarehouseChange = async (item: any) => {
  const wh = WarehouseLookups.value.find(w => w.value === item.warehouseId);
  if (wh) {
    item.warehouse = wh.label;
    item.zone = '';
    item.zoneId = null;
    item.locationCode = '';
    item.locationId = null;
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
    } else {
      // Fetch balance for standard warehouse
      await fetchItemBalance(item);
    }
  }
  emitUpdate();
};

const fetchItemBalance = async (item: any) => {
  if (item.itemId && item.warehouseId) {
    item.balance = await getItemBalance(item.itemId, item.warehouseId, item.zoneId, item.locationId);
  }
};

</script>

<template>
  <div class="flex flex-col h-full bg-white rounded-xl">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900">{{ t('itemsList.title') }}</h2>
        <p class="text-gray-500 text-sm">{{ t('itemsList.description') }}</p>
      </div>
      <BaseButton v-if="!disabled" :label="t('itemsList.addItem')"
        class="bg-primary-600 border-none hover:bg-primary-700 font-semibold px-4 py-2 rounded-lg"
        @click="openItemDialog" />
    </div>

    <div v-if="itemsError" class="mb-4 px-4 py-2 bg-red-50 border border-red-300 text-red-600 rounded-lg text-sm">
      {{ itemsError }}
    </div>

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
            <!-- Show button when: serial-tracked (create/edit) OR has serials (view) -->
            <template v-if="data.trackingType === 'Serial' || (disabled && data.serials?.length > 0)">
              <BaseButton :label="disabled ? t('button.view') : t('itemsList.add')" variant="outline-primary"
                @click="openQtyDialog(data)" />
              <span class="text-gray-500">({{ data.quantity }})</span>
            </template>
            <template v-else>
              <InputText v-if="!disabled" v-model.number="data.quantity" class="w-20 p-inputtext-sm" @input="() => {
                data.total = calcTotal(data.quantity, data.unitPrice);
                emitUpdate();
              }" />
              <span v-else class="text-gray-700">
                {{ data.quantity }}
              </span>
            </template>
          </div>
        </template>

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
                if (opt?.unitId) {
                  data.unitId = opt.unitId;
                } else {
                  // Fallback: resolve unitId from UnitsLookups by matching label
                    const unitFromLookup = UnitsLookups.find((u: any) => u.label === v);
                    if (unitFromLookup) data.unitId = unitFromLookup.value;
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
              <div v-if="isLoadingLocation && loadingLocationItemId === data.id"
                class="flex items-center gap-2 text-xs text-primary-500 font-medium py-1 px-2 border border-primary-200 rounded-lg">
                <ProgressSpinner style="width:14px;height:14px" strokeWidth="6" />
                <span>Loading...</span>
              </div>
              <BaseButton v-else-if="!disabled" :label="data.locationCode || t('itemList.selectZone')"
                variant="outline-primary" class="!px-3 !py-1.5 !text-xs !rounded-lg !border-primary-200"
                @click="openLocationPicker(data)" />
              <span v-else-if="disabled" class="text-gray-700">{{ data.locationCode || '—' }}</span>
              <div v-if="data.locationCode" class="text-[10px] text-gray-400 font-medium leading-tight">
                {{ data.zone }} <template v-if="data.row">(R:{{ data.row }} C:{{ data.column }} R:{{ data.rack
                }})</template>
              </div>
            </template>
            <template v-else-if="data.warehouseId">
              <span class="text-gray-400 italic text-xs">{{ t('itemList.zoneDisabled') }}</span>
            </template>
          </div>
        </template>

        <template #col-unitPrice="{ data }">
          <span v-if="disabled" class="text-gray-700">{{ data.unitPrice }}</span>
          <InputText v-else v-model.number="data.unitPrice" class="w-24 p-inputtext-sm" :disabled="disabled" @input="() => {
            data.total = calcTotal(data.quantity, data.unitPrice);
            emitUpdate();
          }" />
        </template>

        <template #col-total="{ data }">
          <span class="font-medium text-gray-900">{{ Number(data.total).toFixed(2) }}</span>
        </template>

        <template #col-balance="{ data }">
          <span class="font-bold text-primary-600">{{ data.balance || 0 }}</span>
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
      <span class="text-xl font-bold text-primary-600">${{ subtotal.toFixed(2) }}</span>
    </div>

    <ItemSelectionDialog v-if="showItemDialog" v-model:visible="showItemDialog" :items="availableItems"
      @select="handleSelectItem" />
    <template v-if="showQtyDialog && currentItem">
      <SalesQuantitySerialDialog v-if="direction === 'Transfer' || direction === 'Outbound'" :key="qtyDialogKey" v-model:visible="showQtyDialog"
        :item="currentItem" :initialSerials="currentItem.serials" :warehouseId="currentItem.warehouseId"
        :zoneId="currentItem.zoneId" :locationId="currentItem.locationId" :disabled="disabled"
        @save="handleSaveSerials" />
      <QuantitySerialDialog v-else v-model:visible="showQtyDialog" :item="currentItem"
        :initialSerials="currentItem.serials" :disabled="disabled" @save="handleSaveSerials" />
    </template>
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
.circle-badge {
  background-color: transparent;
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
.icon-transparent {
  color: transparent;
}
</style>