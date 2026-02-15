<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";

const { t } = useI18n();

const data = ref({
  returnNumber: "PR-012",
  originalWaybill: "PW-2024-05",
  returnDate: "2025-01-01",
  returnReason: "Quality Issues",
  receivingWarehouse: "WH-001",
  zoneLocation: "Zone A",

  items: [
    {
      id: 1,
      code: 'ITM-001',
      name: 'Hydraulic Pump',
      quantity: 0,
      uom: 'PCS',
      warehouse: 'WH-011',
      zone: 'Zone A',
      unitPrice: "450",
      tax: "5",
      total: 450.00,
      serials: ""
    },
    {
      id: 2,
      code: 'ITM-045',
      name: 'Industrial 6205',
      quantity: 0,
      uom: 'PCS',
      warehouse: 'WH-011',
      zone: 'Zone A',
      unitPrice: "85",
      tax: "11",
      total: 85.00,
      serials: ""
    }
  ]
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
            {{ data.returnNumber }}
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-400 mb-1">
            {{ t("purchaseReturn.OriginalWaybill") }}
          </p>
          <p class="text-base font-semibold text-gray-700">
            {{ data.originalWaybill }}
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-400 mb-1">
            {{ t("purchaseReturn.ReturnDate") }}
          </p>
          <p class="text-base font-semibold text-gray-700">
            {{ data.returnDate }}
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-400 mb-1">
            {{ t("purchaseReturn.ReturnReason") }}
          </p>
          <p class="text-base font-semibold text-gray-700">
            {{ data.returnReason }}
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-400 mb-1">
            {{ t("purchaseReturn.ReceivingWarehouse") }}
          </p>
          <p class="text-base font-semibold text-gray-700">
            {{ data.receivingWarehouse }}
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-400 mb-1">
            {{ t("purchaseReturn.ZoneLocation") }}
          </p>
          <p class="text-base font-semibold text-gray-700">
            {{ data.zoneLocation }}
          </p>
        </div>
      </div>
    </div>

    <!-- Line Items -->
    <div>
      <h3 class="text-lg font-bold text-gray-800 mb-4">
        {{ t("purchaseReturn.LineItem") }}
      </h3>
      <DynamicTable :columns="columns"  :data="data.items" :paginator="false" :showView="false"
        :showEdit="false" :showDelete="false">
        <template  v-slot:["col-code"]="{ data }">
          <div class="flex items-center gap-2 rounded">
            <Badge v-if="!data.tracked" severity="success" class="circle-badge-sm">
              <VsxIcon iconName="Airdrop" :size="20" type="linear" />
            </Badge>
            <Badge v-else severity="transparent" class="circle-badge">
              <VsxIcon iconName="Airdrop" :size="20" type="linear" class="icon-transparent" />
            </Badge>
            <div class="text-base text-gray-700">{{ data.code }}</div>
          </div>
        </template>
        <template  v-slot:["col-name"]="{ data }">
          <span class="text-gray-600">{{ data.name }}</span>
        </template>
        <template  v-slot:["col-serial"]="{ data }">
          <VsxIcon iconName="Eye" :size="20" type="linear" color="#3F5FAC" class="cursor-pointer" />
          <span class="text-gray-600">{{ data.serials }}</span>
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
