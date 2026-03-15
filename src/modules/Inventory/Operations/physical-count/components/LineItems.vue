<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import ItemSelectionDialog from "@/modules/Inventory/shared/components/ItemSelectionDialog.vue";
import SalesQuantitySerialDialog from "@/modules/Inventory/shared/components/SalesQuantitySerialDialog.vue";

const { t } = useI18n();
const emit = defineEmits(["next", "prev"]);

import { usePhysicalCountForm } from "../composables/usePhysicalCountForm";
import type { Item } from "../types/PhysicalCount";
import StorageLocationPicker from "@/modules/Inventory/shared/components/StorageLocationPicker.vue";
import ItemBalance from "@/modules/Inventory/Transactions/sales-waybill/components/ItemBalance.vue";
const { itemsLookups, WarehouseHierarchyLookups, physicalCountLines } =
  usePhysicalCountForm();

// --- Computed ---
const columns = computed(() => [
  { field: "itemCode", header: t("PhysicalCount.ItemCode") },
  { field: "itemName", header: t("PhysicalCount.ItemName") },
  { field: "warehouse", header: t("PhysicalCount.warehouse") },
  { field: "zone", header: t("PhysicalCount.zone") },
  { field: "Balance", header: t('PhysicalCount.SystemBalance') },
  { field: "CountedQTY", header: t("PhysicalCount.CountedQTY") },
  { field: "variances", header: t("PhysicalCount.Variances") },
  { field: "serial", header: t("serial.serial") },
  { field: "action", header: t("action") },
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
    const wh = WarehouseHierarchyLookups.value.find(
      (w) => w.warehouseId === warehouseId,
    );
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
  let item = physicalCountLines.value.find(
    (li) => li.itemId === selectedItem.value?.itemId,
  );
  if (item) {
    item.locationId = location.locationId;
    item.zoneId = location.zoneId;
    item.locationName = `${location.zoneName} - ${location.locationCode}`;
  }
  locationPickerFlag.value = false;
};

const isProf = (warehouseId: string) => {
  const wh = WarehouseHierarchyLookups.value.find(
    (w) => w.warehouseId === warehouseId,
  );
  return wh?.warehouseType === "Professional";
};

const openItemDialog = () => {
  showItemDialog.value = true;
};

const handleSelectItem = (item: any) => {
  physicalCountLines.value.push({
    itemId: item.id,
    itemName: item.name,
    itemCode: item.code,
    countedQty: 0,
    warehouseId: null,
    zoneId: null,
    locationId: null,
    trackingType: item.trackingType,
    locationName: "",
    physicalCountSerials: [],
  });
  showItemDialog.value = false;
};

// --- Quantity/Serial Dialog ---
const showQtyDialog = ref(false);
const currentItem = ref<any>(null);

const openQtyDialog = (item: any) => {
  item.serials = item.serials.map((serial: any) => ({
    ...serial,
    qty: serial.quantity,
  }));
  currentItem.value = item;
  showQtyDialog.value = true;
};

const handleSaveSerials = (payload: any) => {
  if (currentItem.value) {
    currentItem.value.serials = payload.serials?.map((serial: any) => ({
      ...serial,
      quantity: serial.qty || 0,
    }));
    currentItem.value.countedQty = payload.totalQty;
  }
};

const removeItem = (data: any) => {
  const index = physicalCountLines.value.findIndex(
    (item) => item.itemId === data.itemId,
  );
  if (index !== -1) {
    physicalCountLines.value.splice(index, 1);
  }
};
</script>

<template>
  <div class="flex flex-col h-full bg-white rounded-xl">
    <PageHeader
      title="PhysicalCount.LineItems"
      subtitle="PhysicalCount.LineItemsInfo"
      :showSearch="false"
      :mainBtn="true"
      :mainBtnText="t('itemsList.addItem')"
      :onMainBtnClick="openItemDialog"
    />

    <!-- Table -->
    <div class="overflow-x-auto">
      <DynamicTable
        :columns="columns"
        :data="physicalCountLines"
        :paginator="false"
        :showView="false"
        :showEdit="false"
        :showDelete="false"
      >
        <!-- item code -->
        <template #col-itemCode="{ data }">
          <div class="flex items-center gap-2 rounded">
            <Badge
              v-if="data.trackingType === 'Serial'"
              severity="success"
              class="circle-badge-sm"
            >
              <VsxIcon iconName="Brodcast" :size="20" type="linear" />
            </Badge>
            <Badge v-else severity="transparent" class="circle-badge">
              <VsxIcon
                iconName="Brodcast"
                :size="20"
                type="linear"
                class="icon-transparent"
              />
            </Badge>
            <div
              v-tooltip="data.itemCode"
              class="text-base text-gray-700 truncate w-16"
            >
              {{ data.itemCode }}
            </div>
          </div>
        </template>

        <template #col-itemName="{ data }">
          <div v-tooltip="data.itemName" class="text-gray-600 truncate w-16">
            {{ data.itemName }}
          </div>
        </template>
        <template #col-CountedQTY="{ data }">
          <div
            v-if="data.trackingType === 'Serial'"
            class="flex justify-center items-center gap-2"
          >
            <span class="text-gray-500">({{ data.countedQty }})</span>
          </div>
          <div v-else>
            <InputNumber v-model="data.countedQty" :min="0" />
          </div>
        </template>

        <template #col-serial="{ data }">
          <div v-if="data.trackingType === 'Serial'">
            <VsxIcon
              class="cursor-pointer text-primary-500"
              iconName="Eye"
              :size="24"
              type="linear"
            />
          </div>
        </template>

        <template #col-warehouse="{ data }">
          <FormDropdown
            v-model="data.warehouseId"
            :options="warehouseLookups"
            class="w-32 p-inputtext-sm text-sm"
          />
        </template>

        <template #col-zone="{ data }">
          <div>
            <div
              v-if="data.warehouseId && isProf(data.warehouseId)"
              @click="showlocationPicker(data)"
              class="w-28 truncate text-sm rounded-xl p-3 cursor-pointer border border-gray-300 bg-gray-50 text-gray-500"
            >
              <span class="text-black" v-if="data.locationName">{{
                data.locationName
              }}</span>
              <span v-else>{{ $t("SalesReturn.ZonePlaceholder") }}</span>
            </div>
            <div v-else class="text-gray-500 text-sm">
              {{ $t("itemsList.zoneDisabled") }}
            </div>
          </div>
        </template>

        <template #col-Balance="{ data }">
          <ItemBalance
            v-if="data.itemId && data.warehouseId"
            :itemId="data.itemId"
            :warehouseId="data.warehouseId"
            :zoneId="data.zoneId"
            :locationId="data.locationId"
          />
        </template>
        <template #col-action="{ data }">
          <button
            class="text-red-400 hover:text-red-600"
            @click="removeItem(data)"
          >
            <VsxIcon
              iconName="Trash"
              :size="20"
              type="linear"
              color="#F04438"
            />
          </button>
        </template>
      </DynamicTable>
    </div>

    <ItemSelectionDialog
      v-model:visible="showItemDialog"
      :items="availableItems"
      @select="handleSelectItem"
    />

    <SalesQuantitySerialDialog
      v-if="currentItem"
      v-model:visible="showQtyDialog"
      :item="currentItem"
      :warehouseId="currentItem.warehouseId"
      :zoneId="currentItem.zoneId"
      :locationId="currentItem.locationId"
      :initialSerials="currentItem.serials"
      @save="handleSaveSerials"
    />

    <StorageLocationPicker
      v-if="locationPickerFlag"
      v-model:visible="locationPickerFlag"
      @select="handleSelectLocation"
      :locations="currentLocations"
      :selectedLocationId="selectedLocationId"
    />
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
