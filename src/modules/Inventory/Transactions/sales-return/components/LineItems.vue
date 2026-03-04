<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import ItemSelectionDialog from "@/modules/Inventory/shared/components/ItemSelectionDialog.vue";
import SalesQuantitySerialDialog from "@/modules/Inventory/shared/components/SalesQuantitySerialDialog.vue";

const { t } = useI18n();
const emit = defineEmits(["next", "prev"]);

import { useSalesReturnForm } from "../composables/useSalesReturnForm";
import type { Item, Unit } from "../types/SalesReturn";
import StorageLocationPicker from "@/modules/Inventory/shared/components/StorageLocationPicker.vue";
import ItemBalance from "../../sales-waybill/components/ItemBalance.vue";
const {
  itemsLookups,
  WarehouseHierarchyLookups,
  lineItems,
  totalUnits
} = useSalesReturnForm();

// --- Computed ---
const columns = computed(() => [
  { field: "itemCode", header: t("itemsList.itemCode") },
  { field: "itemName", header: t("itemsList.itemName") },
  { field: "documentNumber", header: t("ReturnItems.Waybill") },
  { field: "uom", header: t("itemsList.uom") },
  { field: 'shipped', header: t('ReturnItems.Shipped') },
  { field: "ReturnQTY", header: t("ReturnItems.ReturnQTY") },
  { field: "warehouse", header: t("ReturnItems.warehouse") },
  { field: "zone", header: t("itemsList.zone") },
  { field: "Balance", header: t("purchaseReturn.Balance") },
  { field: "action", header: "" },
]);

// --- Item Selection Dialog ---
const showItemDialog = ref(false);
const availableItems = computed(() =>
  itemsLookups.value.map((item) => ({
    ...item,
    label: item.name,
    value: item.id,
  })),
);

const warehouseLookups = computed(() =>
  WarehouseHierarchyLookups.value.map((wh) => ({
    label: wh.warehouseName,
    value: wh.warehouseId,
  })),
);

// --- Location Picker ---
const locationPickerFlag = ref<boolean>(false);
const currentLocations = ref<any[]>([]);
const selectedLocationId = ref<string | null>(null);
const selectedItem = ref<Item | null>(null);

const getCurrentLocations = (warehouseId: string) => {
  currentLocations.value = [];
  if (warehouseId) {
    const wh = WarehouseHierarchyLookups.value.find(w => w.warehouseId === warehouseId);
    currentLocations.value = wh?.locations || [];
  }
};

const showlocationPicker = (data: Item) => {
  selectedItem.value = data;
  locationPickerFlag.value = true;
  selectedLocationId.value = data.locationId || null;
  getCurrentLocations(data.warehouseId as string);
  currentItem.value = data;
};

const handleSelectLocation = (location: any) => {
  let item: Item | null | undefined = null;
  if (selectedItem.value?.sourceLineId) {
    item = lineItems.value.find(li => li.sourceLineId === selectedItem.value?.sourceLineId);
  } else {
    item = lineItems.value.find(li => li.itemId === selectedItem.value?.itemId);
  }
  if (item) {
    item.locationId = location.locationId;
    item.zoneId = location.zoneId;
    item.locationName = `${location.zoneName} - ${location.locationCode}`;
  }
  locationPickerFlag.value = false;
};

const isProf = (warehouseId: string) => {
  const wh = WarehouseHierarchyLookups.value.find(w => w.warehouseId === warehouseId);
  return wh?.warehouseType === "Professional";
};

const openItemDialog = () => {
  showItemDialog.value = true;
};

const handleSelectItem = (item: any) => {
  lineItems.value.push({
    itemId: item.id,
    itemName: item.name,
    itemCode: item.code,
    unitId: item.baseUnitId,
    documentNumber: null,
    quantity: 0,
    warehouseId: null,
    zoneId: null,
    locationId: null,
    sourceLineId: null,
    originalWaybillId: null,
    trackingType: item.trackingType,
    units: item.units.map((unit: Unit) => ({
      label: `${unit.unitName} (${unit.unitCode})`,
      value: unit.unitId,
    })),
    serials: [],
  });
  showItemDialog.value = false;
};

// --- Quantity/Serial Dialog ---
const showQtyDialog = ref(false);
const currentItem = ref<any>(null);

const openQtyDialog = (item: any) => {
  currentItem.value = item;
  showQtyDialog.value = true;
};

const handleSaveSerials = (payload: any) => {
  if (currentItem.value) {
    currentItem.value.serials = payload.serials?.map((serial: any) => ({
      ...serial,
      quantity: serial.qty || 0,
    }));
    currentItem.value.quantity = payload.totalQty;
  }
};

const removeItem = (data: any) => {
  const index = lineItems.value.findIndex((item) => item.itemId === data.itemId);
  if (index !== -1) {
    lineItems.value.splice(index, 1);
  }
};

</script>

<template>
  <div class="flex flex-col h-full bg-white rounded-xl">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900">
          {{ t("ReturnItems.title") }}
        </h2>
        <p class="text-gray-500 text-sm">
          {{ t("ReturnItems.description") }}
        </p>
      </div>
      <BaseButton :label="t('itemsList.addItem')" icon="AddSquare"
        class="bg-primary-600 border-none hover:bg-primary-700 font-semibold px-4 py-2 rounded-lg"
        @click="openItemDialog" />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <DynamicTable :columns="columns" :data="lineItems" :paginator="false" :showView="false" :showEdit="false"
        :showDelete="false">
        <!-- item code -->
        <template #col-itemCode="{ data }">
          <div class="flex items-center gap-2 rounded">
            <Badge v-if="data.trackingType === 'Serial'" severity="success" class="circle-badge-sm">
              <VsxIcon iconName="Brodcast" :size="20" type="linear" />
            </Badge>
            <Badge v-else severity="transparent" class="circle-badge">
              <VsxIcon iconName="Brodcast" :size="20" type="linear" class="icon-transparent" />
            </Badge>
            <div v-tooltip="data.itemCode" class="text-base text-gray-700 truncate w-16">{{ data.itemCode }}</div>
          </div>
        </template>

        <template #col-itemName="{ data }">
          <div v-tooltip="data.itemName" class="text-gray-600 truncate w-16">{{ data.itemName }}</div>
        </template>
        <!-- documentNumber -->
        <template #col-documentNumber="{ data }">
          <div v-tooltip="data.documentNumber" class="truncate w-16">{{ data.documentNumber }}</div>
        </template>

        <template #col-uom="{ data }">
          <FormDropdown v-model="data.unitId" :options="data.units" class="w-32 p-inputtext-sm text-sm" />
        </template>

        <template #col-ReturnQTY="{ data }">
          <div v-if="data.trackingType === 'Serial'" class="flex items-center gap-2">
            <BaseButton :label="t('itemsList.add')" variant="outline-primary" @click="openQtyDialog(data)" />
            <span class="text-gray-500">({{ data.quantity }})</span>
          </div>
          <div v-else>
            <InputNumber v-model="data.quantity" :min="0" :max="data.shipped" />
          </div>
        </template>

        <template #col-warehouse="{ data }">
          <FormDropdown v-model="data.warehouseId" :options="warehouseLookups" class="w-32 p-inputtext-sm text-sm" />
        </template>

        <template #col-zone="{ data }">
          <div>
            <div v-if="data.warehouseId && isProf(data.warehouseId)" @click="showlocationPicker(data)"
              class="w-28 truncate text-sm rounded-xl p-3 cursor-pointer border border-gray-300 bg-gray-50 text-gray-500 ">
              <span class="text-black" v-if="data.locationName">{{ data.locationName }}</span>
              <span v-else>{{ $t("SalesReturn.ZonePlaceholder") }}</span>
            </div>
            <div v-else class="text-gray-500 text-sm">{{ $t("itemsList.zoneDisabled") }}</div>
          </div>
        </template>

        <template #col-Balance="{ data }">
          <ItemBalance v-if="data.itemId && data.warehouseId" :itemId="data.itemId" :warehouseId="data.warehouseId"
            :zoneId="data.zoneId" :locationId="data.locationId" />
        </template>
        <template #col-action="{ data }">
          <button class="text-red-400 hover:text-red-600" @click="removeItem(data)">
            <VsxIcon iconName="Trash" :size="20" type="linear" color="#F04438" />
          </button>
        </template>

      </DynamicTable>
    </div>

    <!-- Subtotal Footer -->
    <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
      <span class="text-gray-600 font-medium">
        {{ t("purchaseReturn.selectedReturnItems", { count: lineItems?.length }) }}
      </span>
      <span class="font-bold">
        <span>{{ t("purchaseReturn.totalReturnItems") }}</span>
        <span class="text-primary-500">{{ t("purchaseReturn.units", { count: totalUnits ?? 0 }) }}</span>
      </span>
    </div>

    <ItemSelectionDialog v-model:visible="showItemDialog" :items="availableItems" @select="handleSelectItem" />

    <SalesQuantitySerialDialog v-if="currentItem" v-model:visible="showQtyDialog" :item="currentItem"
      :warehouseId="currentItem.warehouseId" :zoneId="currentItem.zoneId" :locationId="currentItem.locationId"
      :initialSerials="currentItem.serials" @save="handleSaveSerials" />


    <StorageLocationPicker v-model:visible="locationPickerFlag" @select="handleSelectLocation"
      :locations="currentLocations" :selectedLocationId="selectedLocationId" />
  </div>
</template>

<style scoped>
/* Custom Table Styles override if needed, using tailwind classes mostly */
:deep(.p-select) {
  border-color: #f3f4f6;
  background-color: #f9fafb;
}

:deep(.p-inputtext) {
  border-color: #e5e7eb;
  background-color: #f9fafb;
  width: 7rem;
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
