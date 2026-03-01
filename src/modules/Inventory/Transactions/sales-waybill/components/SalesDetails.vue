
<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from "vue"
import { useI18n } from "vue-i18n"
import { useInventoryLookups } from "@/composables/useInventoryLookups";
import { useSalesWaybill } from "../composables/useSales";
import { useRoute } from "vue-router";


const route = useRoute();
const id = route.params.id ? String(route.params.id) : null;

const { t } = useI18n()

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

const defaultSalesDetails = {
  documentNumber: "",
  customerId: null,
  customerName: "",
  salesOrderRef: "",
  trackingNumber: "",
  shippingAddress: "",
  invoiceNumber: "",
  waybillDate: new Date(),
  deliveryDate: new Date(),
};

const defaultPaymentTerms = {
  currencyId: null,
  exchangeRate: 1,
  rateDate: new Date(),
  currencyCode: "",
  baseCurrencyCode: "USD",
};

function toDate(val: any): Date {
  if (!val) return new Date();
  const d = val instanceof Date ? val : new Date(val);
  return isNaN(d.getTime()) ? new Date() : d;
}

function buildLocalData() {
  const salesDetails = props.salesDetails || defaultSalesDetails;
  const paymentTerms = props.paymentTerms || defaultPaymentTerms;
  
  return {
    customerDetails: {
      documentNumber:  salesDetails?.documentNumber ?? "",
      customerId:      salesDetails?.customerId ?? null as string | null,
      customerName:    salesDetails?.customerName ?? "",
      salesOrderRef:   salesDetails?.salesOrderRef ?? "",
      trackingNumber:  salesDetails?.trackingNumber ?? "",
      shippingAddress: salesDetails?.shippingAddress ?? "",
      invoiceNumber:   salesDetails?.invoiceNumber ?? "",
      waybillDate:     toDate(salesDetails?.waybillDate),
      deliveryDate:    toDate(salesDetails?.deliveryDate),
    },
    paymentTerms: {
      currencyId:       paymentTerms?.currencyId ?? null as string | null,
      exchangeRate:     paymentTerms?.exchangeRate ?? 1,
      rateDate:         toDate(paymentTerms?.rateDate),
      currencyCode:     paymentTerms?.currencyCode ?? "",
      baseCurrencyCode: paymentTerms?.baseCurrencyCode ?? "SAR",
    },
  };
}

const localData = ref(buildLocalData());

// Re-initialize when the parent passes data (for view/edit mode)
// rebuild local copy when parent passes new data, but don't emit back immediately
watch(
  () => props.salesDetails,
  (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      localData.value = buildLocalData();
      // no emitUpdate here: parent already supplied the source data
    }
  },
  { deep: true }
);

onMounted(async () => {
  await Promise.all([
    getCustomerLookups(),
    getCurrenciesLookups()
  ]);

  // For create mode: fetch next document number
  if(!id){
    if (!props.disabled && !localData.value.customerDetails.documentNumber) {
      const result = await fetchNextNumber();
      if (result) {
        localData.value.customerDetails.documentNumber = typeof result === 'string' ? result : (result.documentNumber ?? "");
        emitUpdate();
      }
    }
  }
});

// true when the selected currency is USD
const isUsdCurrency = computed(() => {
  const curr = CurrenciesLookups.value.find(c => c.value === localData.value.paymentTerms.currencyId);
  if (!curr) return false;
  const code = curr.label.split('(')[1]?.split(')')[0] || curr.label;
  return code.toUpperCase() === 'USD';
});

watch(
  () => localData.value.paymentTerms.currencyId,
  (newId) => {
    const curr = CurrenciesLookups.value.find(c => c.value === newId);
    if (curr) {
      nextTick(() => {
        localData.value.paymentTerms.currencyCode = curr.label.split('(')[1]?.split(')')[0] || curr.label;
        localData.value.paymentTerms.baseCurrencyCode = "SAR";
        // If USD, fix exchange rate to 1
        if (isUsdCurrency.value) {
          localData.value.paymentTerms.exchangeRate = 1;
        }
        emitUpdate();
      });
    }
  }
);

// Emit update when customer selection changes
watch(
  () => localData.value.customerDetails.customerId,
  () => {
    emitUpdate();
  }
);

// Emit when exchange rate changes so parent Payment component reacts
watch(
  () => localData.value.paymentTerms.exchangeRate,
  () => {
    emitUpdate();
  }
);

function emitUpdate() {
  console.log('SalesDetails emitting update with customerId:', localData.value.customerDetails.customerId);
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
    
      :placeholder="t('salesWaybill.salesWaybillPlaceholder')" 
      disabled 
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

      <!-- Customer -->
      <FormDropdown 
        :label="t('salesWaybill.Customer')" 
        v-model="localData.customerDetails.customerId" 
      
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
            :placeholder="t('salesWaybill.TrackingNumberPlaceholder')"
            :disabled="disabled" 
          />
        </div>

        <div class="w-1/2">
          <FormInput 
            :label="t('salesWaybill.ShippingAddress')" 
            v-model="localData.customerDetails.shippingAddress"
  
            :placeholder="t('salesWaybill.ShippingAddressPlaceholder')"
            :disabled="disabled" 
          />
        </div>
      </div>
      
      <div class="mt-2 md:col-span-2">
        <FormInput 
          :label="t('salesWaybill.InvoiceNumber')" 
          v-model="localData.customerDetails.invoiceNumber"
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
    
        :placeholder="t('purchaseWaybill.ExchangeValuePlaceholder')" 
        type="number"
        :disabled="disabled || isUsdCurrency" 
      />
    </div>
  </div>
</template>
