<script setup lang="ts">
import { ref, reactive } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const PurchaseReturnNumber = ref("")
const OriginalPurchaseWaybill = ref(null)
const Zone = ref(null)
const Supplier = ref("")
const waybillDate = ref()
const ReturnReason = ref()
const Warehouse = ref()
const ReturnNotes = ref()

const id = ref(null)


const errors = reactive({
  PurchaseReturnNumber: "",
  OriginalPurchaseWaybill: "",
  Supplier: "",
  Zone: "",
  Reference: "",
  Currency: "",
  ExchangeValue: "",
  ReturnReason: "",
  Warehouse: "",
  ReturnNotes: ""
})
</script>

<template>
  <div>

    <p class="font-bold mb-5 text-lg">
      {{ t("purchaseReturn.ReturnInformation") }}
    </p>

    <FormInput :label="t('purchaseReturn.PurchaseReturnNumber')" v-model="PurchaseReturnNumber"
      :error="errors.PurchaseReturnNumber" :placeholder="t('purchaseReturn.PurchaseReturnNumberPlaceholder')"
      :invalid="!!errors.PurchaseReturnNumber" :disabled="!!id" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

      <FormDropdown :label="t('purchaseReturn.OriginalPurchaseWaybill')" v-model="OriginalPurchaseWaybill" :error="errors.OriginalPurchaseWaybill"
        :placeholder="t('purchaseReturn.OriginalPurchaseWaybillPlaceholder')" :invalid="!!errors.OriginalPurchaseWaybill" />

      <div>
        <label class="block text-gray-600 text-lg">
          {{ t("purchaseReturn.ReturnDate") }}
        </label>
        <DatePicker v-model="waybillDate" showIcon fluid iconDisplay="input"
          :placeholder="t('purchaseReturn.ReturnDatePlaceholder')" />
      </div>

      <FormDropdown :label="t('purchaseReturn.Supplier')" v-model="Supplier" :error="errors.Supplier"
        :placeholder="t('purchaseReturn.SupplierPlaceholder')" />

        <FormDropdown :label="t('purchaseReturn.ReturnReason')" v-model="ReturnReason" :error="errors.ReturnReason"
          :placeholder="t('purchaseReturn.ReturnReasonPlaceholder')" />

      <FormDropdown :label="t('purchaseReturn.Warehouse')" v-model="Warehouse" :error="errors.Warehouse"
        :placeholder="t('purchaseReturn.WarehousePlaceholder')" />

      <FormDropdown :label="t('purchaseReturn.Zone')" v-model="Zone" :error="errors.Zone"
        :placeholder="t('purchaseReturn.ZonePlaceholder')" />
      <div class="md:col-span-2">
        <label class="text-gray-700 font-medium mb-2 block">
          {{ $t("purchaseReturn.ReturnNotes") }}
        </label>

        <Textarea v-model="ReturnNotes" :placeholder="$t('purchaseReturn.ReturnNotesPlaceholder')"
          class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.ReturnNotes }" />

        <small v-if="errors.ReturnNotes" class="text-danger-500">
          {{ $t(errors.ReturnNotes) }}
        </small>
      </div>
    </div>
  </div>
</template>
