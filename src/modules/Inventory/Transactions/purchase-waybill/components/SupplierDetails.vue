<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { usePurchaseWaybill } from "../composables/usePurshace";
import { useInventoryLookups } from "@/composables/useInventoryLookups";
import type { SupplierDetailsData, PaymentTermsData } from "../types/PurchaseWaybill";

const props = withDefaults(defineProps<{
  supplierDetails?: SupplierDetailsData | null;
  paymentTerms?: PaymentTermsData | null;
  disabled?: boolean;
}>(), {
  supplierDetails: null,
  paymentTerms: null,
  disabled: false,
});

const { t } = useI18n()
const emit = defineEmits(["update"])
const { fetchNextNumber } = usePurchaseWaybill();
const {
  getSupplierLookups,
  getCurrenciesLookups,
  supplierLookups,
  CurrenciesLookups
} = useInventoryLookups();

const documentNumber = ref(props.supplierDetails?.waybillNumber ?? "")
const Supplier = ref<string | null>(props.supplierDetails?.supplierId ?? null)
const SupplierSalesOrder = ref(props.supplierDetails?.supplierSalesOrder ?? "")
const PurchaseOrder = ref<string | null>(props.supplierDetails?.purchaseOrderRef ?? null)
const Reference = ref(props.supplierDetails?.externalReference ?? "")

const waybillDate = ref<Date | null>(
  props.supplierDetails?.waybillDate
    ? new Date(props.supplierDetails.waybillDate)
    : null
)

const expectedDelivery = ref<Date | null>(
  props.supplierDetails?.expectedDeliveryDate
    ? new Date(props.supplierDetails.expectedDeliveryDate)
    : null
)

const selectedCurrency = ref<string | null>(props.paymentTerms?.currencyId ?? null)
const exchangeValue = ref<number | null>(props.paymentTerms?.exchangeRate ?? null)

const exchangeDate = ref<Date | null>(
  props.paymentTerms?.rateDate
    ? new Date(props.paymentTerms.rateDate)
    : null
)

// Watch for prop changes (Edit mode)
watch(() => props.supplierDetails, (details) => {
  if (details) {
    documentNumber.value = details.waybillNumber ?? "";
    Supplier.value = details.supplierId ?? null;
    SupplierSalesOrder.value = details.supplierSalesOrder ?? "";
    PurchaseOrder.value = details.purchaseOrderRef ?? null;
    Reference.value = details.externalReference ?? "";
    waybillDate.value = details.waybillDate ? new Date(details.waybillDate) : null;
    expectedDelivery.value = details.expectedDeliveryDate ? new Date(details.expectedDeliveryDate) : null;
  }
}, { deep: true });

watch(() => props.paymentTerms, (terms) => {
  if (terms) {
    selectedCurrency.value = terms.currencyId ?? null;
    exchangeValue.value = terms.exchangeRate ?? null;
    exchangeDate.value = terms.rateDate ? new Date(terms.rateDate) : null;
  }
}, { deep: true });

const errors = reactive({
  documentNumber: "",
  Supplier: "",
  SupplierSalesOrder: "",
  PurchaseOrder: "",
  Reference: "",
  Currency: "",
  ExchangeValue: "",
})

import { watch } from "vue";

watch([documentNumber, Supplier, SupplierSalesOrder, PurchaseOrder, Reference, waybillDate, expectedDelivery, selectedCurrency, exchangeValue, exchangeDate], () => {
  if (props.disabled) return;
  emit("update", {
    supplierDetails: {
      waybillNumber: documentNumber.value,
      supplierId: Supplier.value,
      supplierSalesOrder: SupplierSalesOrder.value,
      purchaseOrderRef: PurchaseOrder.value,
      externalReference: Reference.value,
      waybillDate: waybillDate.value?.toISOString(),
      expectedDeliveryDate: expectedDelivery.value?.toISOString(),
    },
    paymentTerms: {
      currencyId: selectedCurrency.value,
      exchangeRate: exchangeValue.value,
      rateDate: exchangeDate.value?.toISOString(),
    }
  });
}, { deep: true });

onMounted(async () => {
  await Promise.all([
    getCurrenciesLookups(),
    getSupplierLookups()
  ]);
  if (!props.supplierDetails) {
    const result = await fetchNextNumber();
    if (result?.documentNumber) {
      documentNumber.value = result.documentNumber;
    }
  }
});
</script>

<template>
  <div>

    <p class="font-bold mb-5 text-lg">
      {{ t("purchaseWaybill.SupplierDetails") }}
    </p>

    <FormInput :label="t('purchaseWaybill.WaybillNumber')" v-model="documentNumber" :error="errors.documentNumber"
      :placeholder="t('purchaseWaybill.WaybillNumberPlaceholder')" :invalid="!!errors.documentNumber" disabled />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <FormDropdown v-if="!disabled" :label="t('purchaseWaybill.Supplier')" v-model="Supplier" :error="errors.Supplier"
        :placeholder="t('purchaseWaybill.SupplierPlaceholder')" :invalid="!!errors.Supplier" :options="supplierLookups"
        :disabled="disabled" />
      <FormInput v-else :label="t('purchaseWaybill.Supplier')" :modelValue="props.supplierDetails?.supplierName ?? ''" disabled />

      <FormInput :label="t('purchaseWaybill.SupplierSalesOrder')" v-model="SupplierSalesOrder"
        :error="errors.SupplierSalesOrder" :placeholder="t('purchaseWaybill.SupplierSalesOrderPlaceholder')"
        :invalid="!!errors.SupplierSalesOrder" :disabled="disabled" />

      <!-- Dates -->
      <div class="flex gap-4 mt-2 md:col-span-2">
        <div class="w-1/2">
          <label class="block text-gray-600 text-lg">
            {{ t("purchaseWaybill.WaybillDate") }}
          </label>
          <DatePicker v-model="waybillDate" showIcon fluid iconDisplay="input"
            :placeholder="t('purchaseWaybill.WaybillDatePlaceholder')" :disabled="disabled" />
        </div>

        <div class="w-1/2">
          <label class="block text-gray-600 text-lg">
            {{ t("purchaseWaybill.ExpectedDelivery") }}
          </label>
          <DatePicker v-model="expectedDelivery" showIcon fluid iconDisplay="input"
            :placeholder="t('purchaseWaybill.ExpectedDeliveryPlaceholder')" :disabled="disabled" />
        </div>
      </div>

      <FormDropdown :label="t('purchaseWaybill.PurchaseOrder')" v-model="PurchaseOrder" :error="errors.PurchaseOrder"
        :placeholder="t('purchaseWaybill.PurchaseOrderPlaceholder')" :disabled="disabled" />

      <FormInput :label="t('purchaseWaybill.Reference')" v-model="Reference" :error="errors.Reference"
        :placeholder="t('purchaseWaybill.ReferencePlaceholder')" :disabled="disabled" />
    </div>

    <p class="font-bold mb-5 mt-5 text-lg">
      {{ t("purchaseWaybill.CurrencyInfo") }}
    </p>

    <FormDropdown v-if="!disabled" class="w-full" :label="t('purchaseWaybill.Currency')" :options="CurrenciesLookups" optionLabel="label"
      optionValue="value" v-model="selectedCurrency" :error="errors.Currency"
      :placeholder="t('purchaseWaybill.CurrencyPlaceholder')" :disabled="disabled" />
    <FormInput v-else class="w-full" :label="t('purchaseWaybill.Currency')" :modelValue="props.paymentTerms?.currencyCode ?? ''" disabled />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div>
        <label class="block text-gray-900 text-lg">
          {{ t("purchaseWaybill.ExchangeDate") }}
        </label>
        <DatePicker v-model="exchangeDate" showIcon fluid iconDisplay="input"
          :placeholder="t('purchaseWaybill.ExchangedatePlaceholder')" :disabled="disabled" />
      </div>

      <FormInput :label="t('purchaseWaybill.ExchangeValue')" v-model="exchangeValue" :error="errors.ExchangeValue"
        :placeholder="t('purchaseWaybill.ExchangeValuePlaceholder')" :disabled="disabled" />
    </div>
  </div>
</template>
