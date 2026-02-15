<script setup lang="ts">
import { ref, reactive } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const WaybillNumber = ref("")
const Supplier = ref(null)
const SupplierSalesOrder = ref("")
const PurchaseOrder = ref(null)
const Reference = ref("")

const waybillDate = ref()
const expectedDelivery = ref()
const exchangeDate = ref()

const selectedCurrency = ref(null)
const exchangeValue = ref(null)

const id = ref(null)
const currencyOptions = [
  { label: "USD", value: "USD" },
  { label: "EGP", value: "EGP" },
]


const errors = reactive({
  WaybillNumber: "",
  Supplier: "",
  SupplierSalesOrder: "",
  PurchaseOrder: "",
  Reference: "",
  Currency: "",
  ExchangeValue: "",
})
</script>

<template>
  <div>
    <!-- ================= Supplier Details ================= -->
    <p class="font-bold mb-5 text-lg">
      {{ t("purchaseWaybill.SupplierDetails") }}
    </p>

    <FormInput :label="t('purchaseWaybill.WaybillNumber')" v-model="WaybillNumber" :error="errors.WaybillNumber"
      :placeholder="t('purchaseWaybill.WaybillNumberPlaceholder')" :invalid="!!errors.WaybillNumber" :disabled="!!id" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">


      <FormDropdown :label="t('purchaseWaybill.Supplier')" v-model="Supplier" :error="errors.Supplier"
        :placeholder="t('purchaseWaybill.SupplierPlaceholder')" :invalid="!!errors.Supplier" />


      <FormInput :label="t('purchaseWaybill.SupplierSalesOrder')" v-model="SupplierSalesOrder"
        :error="errors.SupplierSalesOrder" :placeholder="t('purchaseWaybill.SupplierSalesOrderPlaceholder')"
        :invalid="!!errors.SupplierSalesOrder" />


      <!-- Dates -->
      <div class="flex gap-4 mt-2 md:col-span-2">
        <div class="w-1/2">
          <label class="block text-gray-600 text-lg">
            {{ t("purchaseWaybill.WaybillDate") }}
          </label>
          <DatePicker v-model="waybillDate" showIcon fluid iconDisplay="input"
            :placeholder="t('purchaseWaybill.WaybillDatePlaceholder')" />
        </div>

        <div class="w-1/2">
          <label class="block text-gray-600 text-lg">
            {{ t("purchaseWaybill.ExpectedDelivery") }}
          </label>
          <DatePicker v-model="expectedDelivery" showIcon fluid iconDisplay="input"
            :placeholder="t('purchaseWaybill.ExpectedDeliveryPlaceholder')" />
        </div>
      </div>

      <FormDropdown :label="t('purchaseWaybill.PurchaseOrder')" v-model="PurchaseOrder" :error="errors.PurchaseOrder"
        :placeholder="t('purchaseWaybill.PurchaseOrderPlaceholder')" />


      <FormInput :label="t('purchaseWaybill.Reference')" v-model="Reference" :error="errors.Reference"
        :placeholder="t('purchaseWaybill.ReferencePlaceholder')" />

    </div>

    <!-- ================= Currency Info ================= -->
    <p class="font-bold mb-5 mt-5 text-lg">
      {{ t("purchaseWaybill.CurrencyInfo") }}
    </p>

    <FormDropdown class="w-full" :label="t('purchaseWaybill.Currency')" :options="currencyOptions" optionLabel="label"
      optionValue="value" v-model="selectedCurrency" :error="errors.Currency"
      :placeholder="t('purchaseWaybill.CurrencyPlaceholder')" />


    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

      <div>
        <label class="block text-gray-900 text-lg">
          {{ t("purchaseWaybill.ExchangeDate") }}
        </label>
        <DatePicker v-model="exchangeDate" showIcon fluid iconDisplay="input"
          :placeholder="t('purchaseWaybill.ExchangedatePlaceholder')" />
      </div>

      <FormInput :label="t('purchaseWaybill.ExchangeValue')" v-model="exchangeValue" :error="errors.ExchangeValue"
        :placeholder="t('purchaseWaybill.ExchangeValuePlaceholder')" />

    </div>
  </div>
</template>
