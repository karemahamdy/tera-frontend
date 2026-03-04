<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useSalesReturnForm } from "../composables/useSalesReturnForm";
import { computed, ref } from "vue";
import { useInventoryLookups } from "@/composables/useInventoryLookups";
import OriginalWaybillSelection from "@/modules/Inventory/shared/components/OriginalWaybillSelection.vue";
const {
  ZonesLookups,
  getZonesLookups,
  salesWaybills,
  getInventoryLookupsSalesWaybills,
} = useInventoryLookups();

const {
  reasonsLookups,
  customerLookups,
  WarehouseLookups,
  errors,
  documentNumber,
  originalWaybillIds,
  customerId,
  returnDate,
  returnReason,
  otherReason,
  warehouseId,
  zoneId,
  isView,
  getOriginalWaybillItems
} = useSalesReturnForm();

const { t } = useI18n();

const isProf = computed(() => {
  const wh = WarehouseLookups.value.find((w) => w.value === warehouseId.value);
  const isProfessional = wh?.type === "Professional";
  if (isProfessional) getZonesLookups(warehouseId.value);
  // zones.value = ZonesLookups.value
  return isProfessional;
});

const hasOriginalWaybill = computed(() => {
  if (customerId.value) {
    getInventoryLookupsSalesWaybills(customerId.value);
    return true;
  }
  return false;
});

const isVisible = ref<boolean>(false);
const originalWaybillSelectionRef = ref<InstanceType<typeof OriginalWaybillSelection> | null>(null);

const openOriginalWaybillSelection = () => {
  if (!hasOriginalWaybill.value) return;
  let data = salesWaybills.value?.filter((pb) =>
    originalWaybillIds.value?.includes(pb.id),
  );
  if (originalWaybillSelectionRef.value) {
    originalWaybillSelectionRef.value.setSelectedRows(data);
  }
  isVisible.value = true;
};

const handleOriginalWaybillSelection = (item: any) => {
  originalWaybillIds.value = item.map((i: any) => i.id);
  getOriginalWaybillItems()
};

</script>

<template>
  <div>
    <p class="font-bold mb-5 text-lg">
      {{ t("SalesReturn.ReturnInformation") }}
    </p>

    <FormInput :label="t('SalesReturn.SalesReturnNumber')" v-model="documentNumber" :error="errors.documentNumber"
      :placeholder="t('SalesReturn.SalesReturnNumberPlaceholder')" :invalid="!!errors.documentNumber"
      :disabled="true" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

      <FormDropdown :label="t('SalesReturn.Customer')" v-model="customerId" :error="errors.customerId"
        :disabled="isView" :options="customerLookups" :placeholder="t('SalesReturn.CustomerPlaceholder')" />

      <FormDropdown :label="t('SalesReturn.ReturnReason')" v-model="returnReason" :error="errors.returnReason"
        :disabled="isView" :options="reasonsLookups" :placeholder="t('SalesReturn.ReturnReasonPlaceholder')" />

      <div class="flex justify-center items-end gap-2 w-full">
        <FormInput :label="$t('SalesReturn.originalWaybill')" disabled :class="{ 'w-full': isView, 'w-9/10': !isView }"
          :error="errors.originalWaybillIds" :placeholder="$t('itemsList.numSelected', {
            count: originalWaybillIds?.length ?? 0,
          })
            " />
        <a v-if="!isView" @click="openOriginalWaybillSelection"
          class="w-1/5 rounded-xl p-3 text-center border border-primary-500 text-primary-500" :class="{
            'cursor-not-allowed bg-gray-50': !hasOriginalWaybill,
            'cursor-pointer bg-white hover:bg-primary-25': hasOriginalWaybill,
          }" :disabled="!hasOriginalWaybill">
          {{ $t("LDC.select") }}
        </a>
      </div>

      <FormInput :label="t('SalesReturn.ReturnDate')" v-model="returnDate" type="date" :error="errors.returnDate"
        :disabled="isView" :placeholder="t('SalesReturn.ReturnDatePlaceholder')" :invalid="!!errors.returnDate" />

      <FormDropdown :label="t('purchaseReturn.Warehouse')" v-model="warehouseId" :error="errors.warehouseId"
        :disabled="isView" :options="WarehouseLookups" :placeholder="t('purchaseReturn.WarehousePlaceholder')" />

      <FormDropdown :label="t('SalesReturn.Zone')" v-model="zoneId" :error="errors.zoneId" :options="ZonesLookups"
        :disabled="!isProf || isView" :placeholder="t('SalesReturn.ZonePlaceholder')" />
      <div class="md:col-span-2">
        <label class="text-gray-700 font-bold mb-2 block">
          {{ $t("purchaseReturn.ReturnNotes") }}
        </label>

        <Textarea v-model="otherReason" :placeholder="$t('purchaseReturn.ReturnNotesPlaceholder')" :disabled="isView"
          class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.otherReason }" />

        <small v-if="errors.otherReason" class="text-danger-500">
          {{ $t(errors.otherReason) }}
        </small>
      </div>
    </div>
    <OriginalWaybillSelection v-model:visible="isVisible" ref="originalWaybillSelectionRef" :items="salesWaybills"
      @select="handleOriginalWaybillSelection" />
  </div>
</template>
