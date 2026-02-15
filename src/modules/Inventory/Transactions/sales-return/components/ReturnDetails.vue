<script setup lang="ts">
import { ref, reactive } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const SalesReturnNumber = ref("")
const OriginalSalesWaybill = ref(null)
const Zone = ref(null)
const Customer = ref("")
const waybillDate = ref()
const ReturnReason = ref()
const ReceivingWarehouse = ref()
const CustomerNotes = ref()

const id = ref(null)


const errors = reactive({
  SalesReturnNumber: "",
  OriginalSalesWaybill: "",
  Customer: "",
  Zone: "",
  Reference: "",
  Currency: "",
  ExchangeValue: "",
  ReturnReason: "",
  ReceivingWarehouse: "",
  CustomerNotes: ""
})
</script>

<template>
  <div>

    <p class="font-bold mb-5 text-lg">
      {{ t("SalesReturn.ReturnInformation") }}
    </p>

    <FormInput :label="t('SalesReturn.SalesReturnNumber')" v-model="SalesReturnNumber"
      :error="errors.SalesReturnNumber" :placeholder="t('SalesReturn.SalesReturnNumberPlaceholder')"
      :invalid="!!errors.SalesReturnNumber" :disabled="!!id" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

      <FormDropdown :label="t('SalesReturn.OriginalSalesWaybill')" v-model="OriginalSalesWaybill" :error="errors.OriginalSalesWaybill"
        :placeholder="t('SalesReturn.OriginalSalesWaybillPlaceholder')" :invalid="!!errors.OriginalSalesWaybill" />

      <div>
        <label class="block text-gray-600 text-lg">
          {{ t("SalesReturn.ReturnDate") }}
        </label>
        <DatePicker v-model="waybillDate" showIcon fluid iconDisplay="input"
          :placeholder="t('SalesReturn.ReturnDatePlaceholder')" />
      </div>

      <FormDropdown :label="t('SalesReturn.Customer')" v-model="Customer" :error="errors.Customer"
        :placeholder="t('SalesReturn.CustomerPlaceholder')" />

        <FormDropdown :label="t('SalesReturn.ReturnReason')" v-model="ReturnReason" :error="errors.ReturnReason"
          :placeholder="t('SalesReturn.ReturnReasonPlaceholder')" />

      <FormDropdown :label="t('SalesReturn.ReceivingWarehouse')" v-model="ReceivingWarehouse" :error="errors.ReceivingWarehouse"
        :placeholder="t('SalesReturn.ReceivingWarehousePlaceholder')" />

      <FormDropdown :label="t('SalesReturn.Zone')" v-model="Zone" :error="errors.Zone"
        :placeholder="t('SalesReturn.ZonePlaceholder')" />
      <div class="md:col-span-2">
        <label class="text-gray-700 font-medium mb-2 block">
          {{ $t("SalesReturn.CustomerNotes") }}
        </label>

        <Textarea v-model="CustomerNotes" :placeholder="$t('SalesReturn.CustomerNotesPlaceholder')"
          class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.CustomerNotes }" />

        <small v-if="errors.CustomerNotes" class="text-danger-500">
          {{ $t(errors.CustomerNotes) }}
        </small>
      </div>
    </div>
  </div>
</template>
