<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { usePurchaseReturnForm } from "../composables/usePurchasReturnForm";
import { computed, onMounted, ref } from "vue";
import { useLookups } from "@/composables/useLookups";
import { useInventoryLookups } from "@/composables/useInventoryLookups";
import OriginalWaybillSelection from "@/modules/Inventory/shared/components/OriginalWaybillSelection.vue";
const {
  supplierLookups,
  getSupplierLookups,
  WarehouseLookups,
  ZonesLookups,
  getZonesLookups,
  getWarehouseLookups,
} = useInventoryLookups();

const { getReasonLookups, reasonsLookups } = useLookups();
const {
  errors,
  documentNumber,
  originalWaybillIds,
  supplierId,
  returnDate,
  returnReason,
  otherReason,
  warehouseId,
  zoneId,
} = usePurchaseReturnForm();

const { t } = useI18n();

const isProf = computed(() => {
  const wh = WarehouseLookups.value.find((w) => w.value === warehouseId.value);
  const isProfessional = wh?.type === "Professional";
  if (isProfessional) getZonesLookups(warehouseId.value);
  return isProfessional;
});

const isVisible = ref<boolean>(false);

const handleOriginalWaybillSelection = (item: any) => {
  // Handle the selected original waybill item here
  console.log("Selected Original Waybill:", item);
  // You can update the form state with the selected item details if needed
};

onMounted(() => {
  Promise.all([
    getReasonLookups(),
    getSupplierLookups(),
    getWarehouseLookups(),
  ]);
});
</script>

<template>
  <div>
    <p class="font-bold mb-5 text-lg">
      {{ t("purchaseReturn.ReturnInformation") }}
    </p>

    <FormInput
      :label="t('purchaseReturn.PurchaseReturnNumber')"
      v-model="documentNumber"
      :error="errors.documentNumber"
      :placeholder="t('purchaseReturn.PurchaseReturnNumberPlaceholder')"
      :invalid="!!errors.documentNumber"
      :disabled="true"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div class="flex justify-center items-end gap-2 w-full">
        <FormInput
          :label="$t('purchaseReturn.OriginalPurchaseWaybill')"
          class="w-9/10"
          disabled
          :error="errors.originalWaybillIds"
          :placeholder="
            $t('itemsList.numSelected', {
              count: originalWaybillIds?.length ?? 0,
            })
          "
        />
        <a
          class="w-1/5 rounded-xl p-3 text-center cursor-pointer border border-primary-500 text-primary-500 bg-white hover:bg-primary-25"
          @click="isVisible = true"
        >
          {{ $t("LDC.select") }}
        </a>
      </div>

      <FormInput
        :label="t('purchaseReturn.ReturnDate')"
        v-model="returnDate"
        type="date"
        :error="errors.returnDate"
        :placeholder="t('purchaseReturn.ReturnDatePlaceholder')"
        :invalid="!!errors.returnDate"
      />

      <FormDropdown
        :label="t('purchaseReturn.Supplier')"
        v-model="supplierId"
        :error="errors.supplierId"
        :options="supplierLookups"
        :placeholder="t('purchaseReturn.SupplierPlaceholder')"
      />

      <FormDropdown
        :label="t('purchaseReturn.ReturnReason')"
        v-model="returnReason"
        :error="errors.returnReason"
        :options="reasonsLookups"
        :placeholder="t('purchaseReturn.ReturnReasonPlaceholder')"
      />

      <FormDropdown
        :label="t('purchaseReturn.Warehouse')"
        v-model="warehouseId"
        :error="errors.warehouseId"
        :options="WarehouseLookups"
        :placeholder="t('purchaseReturn.WarehousePlaceholder')"
      />

      <FormDropdown
        :label="t('purchaseReturn.Zone')"
        v-model="zoneId"
        :error="errors.zoneId"
        :options="ZonesLookups"
        :disabled="!isProf"
        :placeholder="t('purchaseReturn.ZonePlaceholder')"
      />
      <div class="md:col-span-2">
        <label class="text-gray-700 font-bold mb-2 block">
          {{ $t("purchaseReturn.ReturnNotes") }}
        </label>

        <Textarea
          v-model="otherReason"
          :placeholder="$t('purchaseReturn.ReturnNotesPlaceholder')"
          class="mt-1 w-full p-3 border rounded-lg"
          rows="4"
          :class="{ 'border-danger-500': errors.otherReason }"
        />

        <small v-if="errors.otherReason" class="text-danger-500">
          {{ $t(errors.otherReason) }}
        </small>
      </div>
    </div>
    <OriginalWaybillSelection
      v-model:visible="isVisible"
      :selectedRows="originalWaybillIds"
      :items="[]"
      @select="handleOriginalWaybillSelection"
    />
  </div>
</template>
