
<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useInventoryLookups } from "@/composables/useInventoryLookups";
import { useSalesWaybill } from "../composables/useSales";

const { t } = useI18n()

// Use actual exports from useInventoryLookups
const { 
  getCustomerLookups, 
  customerLookups, 
  getCurrenciesLookups, 
  CurrenciesLookups 
} = useInventoryLookups();

const { fetchNextNumber } = useSalesWaybill();

const props = defineProps<{
  salesDetails?: any;
  paymentTerms?: any;
  disabled?: boolean;
}>();

const emit = defineEmits(['update']);

const errors = ref<Record<string, string>>({});

// Mapped object matching parent form
const localData = ref({
  customerDetails: {
    documentNumber: "",
    customerId: null as string | null,
    salesOrderRef: "",
    trackingNumber: "",
    shippingAddress: "",
    invoiceNumber: "",
    waybillDate: new Date(),
    deliveryDate: new Date()
  },
  paymentTerms: {
    currencyId: null as string | null,
    exchangeRate: 1,
    rateDate: new Date(),
    currencyCode: "",
    baseCurrencyCode: ""
  }
});

onMounted(async () => {
  // Fetch actual lookups
  await Promise.all([
    getCustomerLookups(),
    getCurrenciesLookups()
  ]);

  if (props.salesDetails) Object.assign(localData.value.customerDetails, props.salesDetails);
  if (props.paymentTerms) Object.assign(localData.value.paymentTerms, props.paymentTerms);

  if (!props.disabled && !localData.value.customerDetails.documentNumber) {
    const nextNumber = await fetchNextNumber();
    if (nextNumber && typeof nextNumber === 'string') {
      localData.value.customerDetails.documentNumber = nextNumber;
    } else if (nextNumber && nextNumber.documentNumber) {
      localData.value.customerDetails.documentNumber = nextNumber.documentNumber;
    }
  }
  emitUpdate();
});

watch(
  () => localData.value.paymentTerms.currencyId,
  (newId) => {
    const curr = CurrenciesLookups.value.find(c => c.value === newId);
    if (curr) {
      localData.value.paymentTerms.currencyCode = curr.label.split('(')[1]?.split(')')[0] || curr.label;
      localData.value.paymentTerms.baseCurrencyCode = "USD";
    }
  }
);

watch(
  () => localData.value,
  () => emitUpdate(),
  { deep: true }
);

function emitUpdate() {
  emit('update', {
    customerDetails: { ...localData.value.customerDetails },
    paymentTerms: { ...localData.value.paymentTerms }
  });
}
</script>

<template>
  <div>
    <p class="font-bold mb-5 text-lg">
      {{ t("salesWaybill.CustomerDetails") }}
    </p>

    <!-- Document Number -->
    <FormInput 
      :label="t('salesWaybill.salesWaybill')" 
      v-model="localData.customerDetails.documentNumber" 
      :error="errors.documentNumber"
      :placeholder="t('salesWaybill.salesWaybillPlaceholder')" 
      disabled 
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

      <!-- Customer -->
      <FormDropdown 
        :label="t('salesWaybill.Customer')" 
        v-model="localData.customerDetails.customerId" 
        :error="errors.customerId"
        :placeholder="t('salesWaybill.CustomerPlaceholder')" 
        :options="customerLookups"
        optionLabel="label"
        optionValue="value"
        :disabled="disabled" 
      />

      <!-- Sales Order Reference -->
      <FormInput 
        :label="t('salesWaybill.SalesOrderReference')" 
        v-model="localData.customerDetails.salesOrderRef"
        :error="errors.salesOrderRef" 
        :placeholder="t('salesWaybill.SalesOrderReferencePlaceholder')"
        :disabled="disabled" 
      />

      <!-- Dates -->
      <div class="flex gap-4 mt-2 md:col-span-2">
        <div class="w-1/2">
          <label class="block text-gray-600 text-lg mb-1">
            {{ t("salesWaybill.WaybillDate") }}
          </label>
          <DatePicker 
            v-model="localData.customerDetails.waybillDate" 
            showIcon fluid iconDisplay="input"
            :placeholder="t('salesWaybill.WaybillDatePlaceholder')" 
            :disabled="disabled" 
          />
        </div>

        <div class="w-1/2">
          <label class="block text-gray-600 text-lg mb-1">
            {{ t("salesWaybill.ExpectedDelivery") }}
          </label>
          <DatePicker 
            v-model="localData.customerDetails.deliveryDate" 
            showIcon fluid iconDisplay="input"
            :placeholder="t('salesWaybill.ExpectedDeliveryPlaceholder')" 
            :disabled="disabled" 
          />
        </div>
      </div>

       <div class="flex gap-4 mt-2 md:col-span-2">
        <div class="w-1/2">
          <FormInput 
            :label="t('salesWaybill.TrackingNumber')" 
            v-model="localData.customerDetails.trackingNumber"
            :error="errors.trackingNumber" 
            :placeholder="t('salesWaybill.TrackingNumberPlaceholder')"
            :disabled="disabled" 
          />
        </div>

        <div class="w-1/2">
          <FormInput 
            :label="t('salesWaybill.ShippingAddress')" 
            v-model="localData.customerDetails.shippingAddress"
            :error="errors.shippingAddress" 
            :placeholder="t('salesWaybill.ShippingAddressPlaceholder')"
            :disabled="disabled" 
          />
        </div>
      </div>
      
      <div class="mt-2 md:col-span-2">
        <FormInput 
          :label="t('salesWaybill.InvoiceNumber')" 
          v-model="localData.customerDetails.invoiceNumber"
          :error="errors.invoiceNumber" 
          :placeholder="t('salesWaybill.InvoiceNumberPlaceholder')"
          :disabled="disabled" 
        />
      </div>

    </div>

    <!-- ================= Currency Info ================= -->
    <p class="font-bold mb-5 mt-5 text-lg">
      {{ t("purchaseWaybill.CurrencyInfo") }}
    </p>

    <!-- Currency -->
    <FormDropdown 
      class="w-full" 
      :label="t('purchaseWaybill.Currency')" 
      :options="CurrenciesLookups" 
      optionLabel="label"
      optionValue="value" 
      v-model="localData.paymentTerms.currencyId" 
      :error="errors.currencyId"
      :placeholder="t('purchaseWaybill.CurrencyPlaceholder')" 
      :disabled="disabled" 
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div>
        <label class="block text-gray-900 text-lg mb-1">
          {{ t("purchaseWaybill.ExchangeDate") }}
        </label>
        <DatePicker 
          v-model="localData.paymentTerms.rateDate" 
          showIcon fluid iconDisplay="input"
          :placeholder="t('purchaseWaybill.ExchangedatePlaceholder')" 
          :disabled="disabled" 
        />
      </div>

      <FormInput 
        :label="t('purchaseWaybill.ExchangeValue')" 
        v-model="localData.paymentTerms.exchangeRate" 
        :error="errors.exchangeRate"
        :placeholder="t('purchaseWaybill.ExchangeValuePlaceholder')" 
        type="number"
        :disabled="disabled" 
      />
    </div>
  </div>
</template>
