<script setup lang="ts">
import { ref, reactive } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const salesWaybill = ref("")
const Customer = ref(null)
const TrackingNumber = ref("")
const SalesOrderReference = ref("")
const ShippingAddress = ref("")
const SalesOrder = ref(null)
const waybillDate = ref()
const expectedDelivery = ref()
const id = ref(null)

const errors = reactive({
  salesWaybill: "",
  Customer: "",
  ShippingAddress: "",
  TrackingNumber: "",
  SalesOrderReference: "",
  SalesOrder: "",
  Reference: "",
  Currency: "",
  ExchangeValue: "",
})
</script>

<template>
  <div>
    <p class="font-bold mb-5 text-lg">
      {{ t("salesWaybill.CustomerDetails") }}
    </p>

    <FormInput :label="t('salesWaybill.salesWaybill')" v-model="salesWaybill" :error="errors.salesWaybill"
      :placeholder="t('salesWaybill.salesWaybillPlaceholder')" :invalid="!!errors.salesWaybill" :disabled="!!id" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

      <FormDropdown :label="t('salesWaybill.Customer')" v-model="Customer" :error="errors.Customer"
        :placeholder="t('salesWaybill.CustomerPlaceholder')" :invalid="!!errors.Customer" />

      <FormInput :label="t('salesWaybill.SalesOrderReference')" v-model="SalesOrderReference"
        :error="errors.SalesOrderReference" :placeholder="t('salesWaybill.SalesOrderReferencePlaceholder')"
        :invalid="!!errors.SalesOrderReference" />

      <!-- Dates -->
      <div class="flex gap-4 mt-2 md:col-span-2">
        <div class="w-1/2">
          <label class="block text-gray-600 text-lg">
            {{ t("salesWaybill.WaybillDate") }}
          </label>
          <DatePicker v-model="waybillDate" showIcon fluid iconDisplay="input"
            :placeholder="t('salesWaybill.WaybillDatePlaceholder')" />
        </div>

        <div class="w-1/2">
          <label class="block text-gray-600 text-lg">
            {{ t("salesWaybill.ExpectedDelivery") }}
          </label>
          <DatePicker v-model="expectedDelivery" showIcon fluid iconDisplay="input"
            :placeholder="t('salesWaybill.ExpectedDeliveryPlaceholder')" />
        </div>
      </div>

       <div class="flex gap-4 mt-2 md:col-span-2">
        <div class="w-1/2">
         <FormInput :label="t('salesWaybill.TrackingNumber')" v-model="TrackingNumber"
        :error="errors.TrackingNumber" :placeholder="t('salesWaybill.TrackingNumberPlaceholder')"
        :invalid="!!errors.TrackingNumber" />
        </div>

        <div class="w-1/2">
          <FormInput :label="t('salesWaybill.ShippingAddress')" v-model="ShippingAddress"
        :error="errors.ShippingAddress" :placeholder="t('salesWaybill.ShippingAddressPlaceholder')"
        :invalid="!!errors.ShippingAddress" />
        
        </div>
      </div>

      <FormDropdown :label="t('salesWaybill.PurchaseOrder')" v-model="SalesOrder" :error="errors.SalesOrder"
        :placeholder="t('salesWaybill.SalesOrderPlaceholder')" />

    </div>
  </div>
</template>
