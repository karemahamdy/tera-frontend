<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";

const { t } = useI18n();

const props = defineProps({
  formData: {
    type: Object,
    default: () => ({
      returnNumber: "PR-012",
      originalWaybill: "PW-2024-05",
      returnDate: "2025-01-01",
      returnReason: "Quality Issues",
      receivingWarehouse: "WH-001",
      zoneLocation: "Zone A",
      items: [
        {
          id: 1,
          code: "ITM-001",
          name: "Hydraulic Pump Model A",
          uom: "PCS",
          warehouse: "WH-044",
          zone: "Zone A",
          purchased: 50,
          returnedQty: 9,
          serial: "view",
        },
        {
          id: 2,
          code: "ITM-045",
          name: "Industrial Bearing 6205",
          uom: "PCS",
          warehouse: "WH-021",
          zone: "Zone B",
          purchased: 45,
          returnedQty: 10,
          serial: "view",
        },
        {
          id: 3,
          code: "ITM-049",
          name: "Global Traders",
          uom: "PCS",
          warehouse: "WH-011",
          zone: "Zone C",
          purchased: 32,
          returnedQty: 11,
          serial: "view",
        },
      ],
    }),
  },
});

const columns = computed(() => [
  { field: "code", header: t("itemsList.itemCode") },
  { field: "name", header: t("itemsList.itemName") },
  { field: "uom", header: t("itemsList.uom") },
  { field: "warehouse", header: t("ReturnItems.warehouse") },
  { field: "zone", header: t("itemsList.zone") },
  { field: "purchased", header: t("purchaseReturn.Purchased") },
  { field: 'returnedQty', header: t('ReturnItems.ReturnQTY') },
  { field: "serial", header: t("purchaseReturn.serial") },
]);
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
            {{ props.formData.returnNumber }}
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-400 mb-1">
            {{ t("purchaseReturn.OriginalWaybill") }}
          </p>
          <p class="text-base font-semibold text-gray-700">
            {{ props.formData.originalWaybill }}
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-400 mb-1">
            {{ t("purchaseReturn.ReturnDate") }}
          </p>
          <p class="text-base font-semibold text-gray-700">
            {{ props.formData.returnDate }}
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-400 mb-1">
            {{ t("purchaseReturn.ReturnReason") }}
          </p>
          <p class="text-base font-semibold text-gray-700">
            {{ props.formData.returnReason }}
          </p>
        </div>
       <div>
          <p class="text-sm font-medium text-gray-400 mb-1">
            {{ t("purchaseReturn.ReceivingWarehouse") }}
          </p>
          <p class="text-base font-semibold text-gray-700">
            {{ props.formData.receivingWarehouse }}
          </p>
        </div>
         <div>
          <p class="text-sm font-medium text-gray-400 mb-1">
            {{ t("purchaseReturn.ZoneLocation") }}
          </p>
          <p class="text-base font-semibold text-gray-700">
            {{ props.formData.zoneLocation }}
          </p>
        </div>
      </div>
    </div>

    <!-- Line Items -->
    <div>
      <h3 class="text-lg font-bold text-gray-800 mb-4">
        {{ t("purchaseReturn.LineItem") }}
      </h3>
      <DynamicTable
        :columns="columns"
        :data="props.formData.items"
        :paginator="false"
        :showView="false"
        :showEdit="false"
        :showDelete="false"
      >
        <template #col-code="{ data }">
          <div class="flex items-center gap-2">
            <Badge severity="success" class="circle-badge-sm">
                <VsxIcon iconName="Airdrop" :size="20" type="linear" />
            </Badge>
             <span class="font-medium text-gray-700">{{ data.code }}</span>
          </div>
        </template>
        <template #col-serial>
             <VsxIcon iconName="Eye" :size="20" type="linear" color="#3F5FAC" class="cursor-pointer" />
        </template>
      </DynamicTable>
    </div>
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
</style>
