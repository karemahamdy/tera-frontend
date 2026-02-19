<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue"
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
const { fetchNextNumber } = usePurchaseWaybill();
const { getSupplierLookups, getCurrenciesLookups, supplierLookups, CurrenciesLookups } = useInventoryLookups();

const documentNumber = ref("")
const Supplier = ref<string | null>(null)
const SupplierSalesOrder = ref("")
const PurchaseOrder = ref<string | null>(null)
const Reference = ref("")

const waybillDate = ref<Date | null>(null)
const expectedDelivery = ref<Date | null>(null)
const exchangeDate = ref<Date | null>(null)

const selectedCurrency = ref<string | null>(null)
const exchangeValue = ref<number | null>(null)

const errors = reactive({
  documentNumber: "",
  Supplier: "",
  SupplierSalesOrder: "",
  PurchaseOrder: "",
  Reference: "",
  Currency: "",
  ExchangeValue: "",
})

// Populate fields from props when viewing/editing an existing record
function populateFromProps() {
  if (props.supplierDetails) {
    const sd = props.supplierDetails;
    documentNumber.value = sd.waybillNumber ?? "";
    Supplier.value = sd.supplierId ?? null;
    SupplierSalesOrder.value = sd.supplierSalesOrder ?? "";
    PurchaseOrder.value = sd.purchaseOrderRef ?? null;
    Reference.value = sd.externalReference ?? "";
    waybillDate.value = sd.waybillDate ? new Date(sd.waybillDate) : null;
    expectedDelivery.value = sd.expectedDeliveryDate ? new Date(sd.expectedDeliveryDate) : null;
  }
  if (props.paymentTerms) {
    const pt = props.paymentTerms;
    selectedCurrency.value = pt.currencyId ?? null;
    exchangeValue.value = pt.exchangeRate ?? null;
    exchangeDate.value = pt.rateDate ? new Date(pt.rateDate) : null;
  }
}

watch(() => props.supplierDetails, populateFromProps, { immediate: true });
watch(() => props.paymentTerms, populateFromProps);

onMounted(async () => {
  Promise.all([
    getCurrenciesLookups(),
    getSupplierLookups()
  ]);

  // Only auto-fetch next number in create mode (no existing supplier details)
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
    <!-- ================= Supplier Details ================= -->
    <p class="font-bold mb-5 text-lg">
      {{ t("purchaseWaybill.SupplierDetails") }}
    </p>

    <FormInput
      :label="t('purchaseWaybill.WaybillNumber')"
      v-model="documentNumber"
      :error="errors.documentNumber"
      :placeholder="t('purchaseWaybill.WaybillNumberPlaceholder')"
      :invalid="!!errors.documentNumber"
      disabled
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <FormDropdown
        :label="t('purchaseWaybill.Supplier')"
        v-model="Supplier"
        :error="errors.Supplier"
        :placeholder="t('purchaseWaybill.SupplierPlaceholder')"
        :invalid="!!errors.Supplier"
        :options="supplierLookups"
        :disabled="disabled"
      />

      <FormInput
        :label="t('purchaseWaybill.SupplierSalesOrder')"
        v-model="SupplierSalesOrder"
        :error="errors.SupplierSalesOrder"
        :placeholder="t('purchaseWaybill.SupplierSalesOrderPlaceholder')"
        :invalid="!!errors.SupplierSalesOrder"
        :disabled="disabled"
      />

      <!-- Dates -->
      <div class="flex gap-4 mt-2 md:col-span-2">
        <div class="w-1/2">
          <label class="block text-gray-600 text-lg">
            {{ t("purchaseWaybill.WaybillDate") }}
          </label>
          <DatePicker
            v-model="waybillDate"
            showIcon
            fluid
            iconDisplay="input"
            :placeholder="t('purchaseWaybill.WaybillDatePlaceholder')"
            :disabled="disabled"
          />
        </div>

        <div class="w-1/2">
          <label class="block text-gray-600 text-lg">
            {{ t("purchaseWaybill.ExpectedDelivery") }}
          </label>
          <DatePicker
            v-model="expectedDelivery"
            showIcon
            fluid
            iconDisplay="input"
            :placeholder="t('purchaseWaybill.ExpectedDeliveryPlaceholder')"
            :disabled="disabled"
          />
        </div>
      </div>

      <FormDropdown
        :label="t('purchaseWaybill.PurchaseOrder')"
        v-model="PurchaseOrder"
        :error="errors.PurchaseOrder"
        :placeholder="t('purchaseWaybill.PurchaseOrderPlaceholder')"
        :disabled="disabled"
      />

      <FormInput
        :label="t('purchaseWaybill.Reference')"
        v-model="Reference"
        :error="errors.Reference"
        :placeholder="t('purchaseWaybill.ReferencePlaceholder')"
        :disabled="disabled"
      />
    </div>

    <!-- ================= Currency Info ================= -->
    <p class="font-bold mb-5 mt-5 text-lg">
      {{ t("purchaseWaybill.CurrencyInfo") }}
    </p>

    <FormDropdown
      class="w-full"
      :label="t('purchaseWaybill.Currency')"
      :options="CurrenciesLookups"
      optionLabel="label"
      optionValue="value"
      v-model="selectedCurrency"
      :error="errors.Currency"
      :placeholder="t('purchaseWaybill.CurrencyPlaceholder')"
      :disabled="disabled"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div>
        <label class="block text-gray-900 text-lg">
          {{ t("purchaseWaybill.ExchangeDate") }}
        </label>
        <DatePicker
          v-model="exchangeDate"
          showIcon
          fluid
          iconDisplay="input"
          :placeholder="t('purchaseWaybill.ExchangedatePlaceholder')"
          :disabled="disabled"
        />
      </div>

      <FormInput
        :label="t('purchaseWaybill.ExchangeValue')"
        v-model="exchangeValue"
        :error="errors.ExchangeValue"
        :placeholder="t('purchaseWaybill.ExchangeValuePlaceholder')"
        :disabled="disabled"
      />
    </div>
  </div>
</template>
