<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";
import { usePurchaseReturnForm } from "../composables/usePurchasReturnForm";
import { formatDateTimeLang } from "@/app/utils/dates";
import SerialTableDialog from "@/modules/Inventory/shared/components/SerialTableDialog.vue";
import type { UnitLookup } from "../types/PurchaseReturn";
const { t } = useI18n();

const {
  getWarehouseName,
  getLocationName,
  getZoneName,
  documentNumber,
  originalWaybillIds,
  returnDate,
  returnReason,
  warehouseId,
  zoneId,
  lineItems
} = usePurchaseReturnForm();

const selectedSerial = ref<any[]>([])
const showSerialDialog = ref<boolean>(false)

const columns = computed(() => [
  { field: "code", header: t("itemsList.itemCode") },
  { field: "name", header: t("itemsList.itemName") },
  { field: "uom", header: t("itemsList.uom") },
  { field: "warehouse", header: t("ReturnItems.warehouse") },
  { field: "zone", header: t("itemsList.zone") },
  { field: "purchased", header: t("purchaseReturn.Purchased") },
  { field: 'quantity', header: t('ReturnItems.ReturnQTY') },
  { field: "serial", header: t("purchaseReturn.serial") },
]);

const getSerialTableDialog = (data: any) => {
  selectedSerial.value = data.serials;
  showSerialDialog.value = true;
}

const getUOMName = (units: UnitLookup[], id: string) => {
  const unit = units.find((u: UnitLookup) => u.value === id);
  if (unit) return unit.label;
}
</script>

<template>
  <div class="flex flex-col gap-6 bg-white rounded-xl p-6">
    <!-- Review Summary -->
    <div>
      <h3 class="text-lg font-bold text-gray-800 mb-6">
        {{ t("purchaseReturn.ReviewSummary") }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12">
        <div>
          <p class="text-sm font-medium text-gray-400 mb-1">
            {{ t("purchaseReturn.ReturnNumber") }}
          </p>
          <p class="text-base font-semibold text-gray-700">
            {{ documentNumber }}
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-400 mb-1">
            {{ t("purchaseReturn.OriginalWaybill") }}
          </p>
          <p class="text-base font-semibold text-gray-700">
            {{ $t('itemsList.numSelected', { count: originalWaybillIds?.length ?? 0 }) }}
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-400 mb-1">
            {{ t("purchaseReturn.ReturnDate") }}
          </p>
          <p class="text-base font-semibold text-gray-700">
            {{ formatDateTimeLang(returnDate) }}
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-400 mb-1">
            {{ t("purchaseReturn.ReturnReason") }}
          </p>
          <p class="text-base font-semibold text-gray-700">
            {{ returnReason }}
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-400 mb-1">
            {{ t("purchaseReturn.ReceivingWarehouse") }}
          </p>
          <p class="text-base font-semibold text-gray-700">
            {{ getWarehouseName() }}
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-400 mb-1">
            {{ t("purchaseReturn.ZoneLocation") }}
          </p>
          <p class="text-base font-semibold text-gray-700">
            {{ getZoneName(warehouseId, zoneId) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Line Items -->
    <div>
      <h3 class="text-lg font-bold text-gray-800 mb-4">
        {{ t("purchaseReturn.LineItem") }}
      </h3>
      <DynamicTable :columns="columns" :data="lineItems" :paginator="false" :showView="false" :showEdit="false"
        :showDelete="false">
        <template v-slot:["col-code"]="{ data }">
          <div class="flex items-center gap-2 rounded">
            <Badge v-if="data.trackingType == 'Serial'" severity="success" class="circle-badge-sm">
              <VsxIcon iconName="Brodcast" :size="20" type="linear" />
            </Badge>
            <Badge v-else severity="transparent" class="circle-badge">
              <VsxIcon iconName="Brodcast" :size="20" type="linear" class="icon-transparent" />
            </Badge>
            <div class="text-base text-gray-700">{{ data.itemCode }}</div>
          </div>
        </template>
        <template v-slot:["col-name"]="{ data }">
          <span class="text-gray-600">{{ data.itemName }}</span>
        </template>
        <template v-slot:["col-warehouse"]="{ data }">
          <span class="text-gray-600">{{ getWarehouseName(data?.warehouseId) }}</span>
        </template>
        <template v-slot:["col-uom"]="{ data }">
          <span class="text-gray-600">{{ getUOMName(data.units, data.unitId) }}</span>
        </template>

        <template v-slot:["col-zone"]="{ data }">
          <span v-if="data?.warehouseId && data?.locationId" class="text-gray-600">{{ getLocationName(data?.warehouseId,
            data?.locationId) }}</span>
        </template>
        <template v-slot:["col-serial"]="{ data }">
          <VsxIcon v-if="data.trackingType == 'Serial' && data.serials.length > 0" iconName="Eye" :size="20"
            type="linear" color="#3F5FAC" class="cursor-pointer" @click="getSerialTableDialog(data)" />
        </template>
      </DynamicTable>
    </div>

    <SerialTableDialog v-model:visible="showSerialDialog" :initialSerials="selectedSerial" />

  </div>
</template>

<style scoped>
.circle-badge-sm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d1fae5;
  color: #10b981;
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
