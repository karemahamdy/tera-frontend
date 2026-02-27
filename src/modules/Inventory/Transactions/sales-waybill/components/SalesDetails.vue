
<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useInventoryLookups } from "@/composables/useInventoryLookups";
import { useSalesWaybill } from "../composables/useSales";

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

function toDate(val: any): Date {
  if (!val) return new Date();
  const d = val instanceof Date ? val : new Date(val);
  return isNaN(d.getTime()) ? new Date() : d;
}

function buildLocalData() {
  return {
    customerDetails: {
      documentNumber:  props.salesDetails?.documentNumber ?? "",
      customerId:      props.salesDetails?.customerId ?? null as string | null,
      customerName:    props.salesDetails?.customerName ?? "",
      salesOrderRef:   props.salesDetails?.salesOrderRef ?? "",
      trackingNumber:  props.salesDetails?.trackingNumber ?? "",
      shippingAddress: props.salesDetails?.shippingAddress ?? "",
      invoiceNumber:   props.salesDetails?.invoiceNumber ?? "",
      waybillDate:     toDate(props.salesDetails?.waybillDate),
      deliveryDate:    toDate(props.salesDetails?.deliveryDate),
    },
    paymentTerms: {
      currencyId:       props.paymentTerms?.currencyId ?? null as string | null,
      exchangeRate:     props.paymentTerms?.exchangeRate ?? 1,
      rateDate:         toDate(props.paymentTerms?.rateDate),
      currencyCode:     props.paymentTerms?.currencyCode ?? "",
      baseCurrencyCode: props.paymentTerms?.baseCurrencyCode ?? "USD",
    },
  };
}

const localData = ref(buildLocalData());

// Re-initialize when the parent passes data (for view/edit mode)
watch(() => props.salesDetails, () => {
  if (props.salesDetails) {
    localData.value = buildLocalData();
    emitUpdate();
  }
}, { deep: true });

onMounted(async () => {
  await Promise.all([
    getCustomerLookups(),
    getCurrenciesLookups()
  ]);

  // For create mode: fetch next document number
  if (!props.disabled && !localData.value.customerDetails.documentNumber) {
    const result = await fetchNextNumber();
    if (result) {
      localData.value.customerDetails.documentNumber = typeof result === 'string' ? result : (result.documentNumber ?? "");
      emitUpdate();
    }
  }
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
        :disabled="disabled" 
      />
    </div>
  </div>
</template>
