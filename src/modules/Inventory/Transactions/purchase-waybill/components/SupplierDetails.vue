<script setup lang="ts">
import { reactive, onMounted, watch, nextTick, computed } from "vue"
import { useI18n } from "vue-i18n"
import { usePurchaseWaybill } from "../composables/usePurshace";
import { useInventoryLookups } from "@/composables/useInventoryLookups";
import type { SupplierDetailsData, PaymentTermsData } from "../types/PurchaseWaybill";
import { useRoute } from "vue-router";

const props = withDefaults(defineProps<{
  supplierDetails?: SupplierDetailsData | null;
  paymentTerms?: PaymentTermsData | null;
  disabled?: boolean;
  errors?: Record<string, string>;
}>(), {
  supplierDetails: null,
  paymentTerms: null,
  disabled: false,
  errors: () => ({}),
});

const route = useRoute();
const id = route.params.id ? String(route.params.id) : null;

const { t } = useI18n()
const emit = defineEmits(["update"])
const { fetchNextNumber } = usePurchaseWaybill();
const { getSupplierLookups, getCurrenciesLookups, supplierLookups, CurrenciesLookups } = useInventoryLookups();


const form = reactive({
  waybillNumber:       props.supplierDetails?.waybillNumber ?? "",
  supplierId:          props.supplierDetails?.supplierId ?? null as string | null,
  supplierSalesOrder:  props.supplierDetails?.supplierSalesOrder ?? "",
  purchaseOrderRef:    props.supplierDetails?.purchaseOrderRef ?? null as string | null,
  externalReference:   props.supplierDetails?.externalReference ?? "",
  waybillDate:         props.supplierDetails?.waybillDate ? new Date(props.supplierDetails.waybillDate) : null as Date | null,
  expectedDeliveryDate:props.supplierDetails?.expectedDeliveryDate ? new Date(props.supplierDetails.expectedDeliveryDate) : null as Date | null,
  currencyId:          props.paymentTerms?.currencyId ?? null as string | null,
  exchangeRate:        props.paymentTerms?.exchangeRate ?? 1,
  rateDate:            props.paymentTerms?.rateDate ? new Date(props.paymentTerms.rateDate) : new Date(),
  currencyCode:        props.paymentTerms?.currencyCode ?? "",
  baseCurrencyCode:    props.paymentTerms?.baseCurrencyCode ?? "SAR",
});



function toDateStr(d: Date | string | null | undefined): string | null {
  if (!d) return null;
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function emitUpdate() {
  if (props.disabled) return;
  emit("update", {
    supplierDetails: {
      waybillNumber:        form.waybillNumber,
      supplierId:           form.supplierId,
      supplierSalesOrder:   form.supplierSalesOrder,
      purchaseOrderRef:     form.purchaseOrderRef,
      externalReference:    form.externalReference,
      waybillDate:          toDateStr(form.waybillDate),
      expectedDeliveryDate: toDateStr(form.expectedDeliveryDate),
    },
    paymentTerms: {
      currencyId:       form.currencyId,
      exchangeRate:     form.exchangeRate !== null && form.exchangeRate !== undefined ? Number(form.exchangeRate) : null,
      rateDate:         toDateStr(form.rateDate),
      currencyCode:     form.currencyCode,
      baseCurrencyCode: form.baseCurrencyCode,
    }
  });
}

onMounted(async () => {
  await Promise.all([getCurrenciesLookups(), getSupplierLookups()]);
  if(!id){
    if (!props.supplierDetails) {
      const result = await fetchNextNumber();
      if (result?.documentNumber) {
        form.waybillNumber = result.documentNumber;
        emitUpdate();
      }
    }
  }
});

// true when the selected currency is USD
const isUsdCurrency = computed(() => {
  const curr = CurrenciesLookups.value.find(c => c.value === form.currencyId);
  if (!curr) return false;
  const code = curr.label.split('(')[1]?.split(')')[0] || curr.label;
  return code.toUpperCase() === 'USD';
});

watch(
  () => form.currencyId,
  (newId) => {
    const curr = CurrenciesLookups.value.find(c => c.value === newId);
    if (curr) {
      nextTick(() => {
        form.currencyCode = curr.label.split('(')[1]?.split(')')[0] || curr.label;
        form.baseCurrencyCode = "SAR";
        // If USD, fix exchange rate to 1
        if (isUsdCurrency.value) {
          form.exchangeRate = 1;
        }
        emitUpdate();
      });
    }
  }
);

// Emit when exchange rate changes to update Payment component
watch(
  () => form.exchangeRate,
  () => {
    emitUpdate();
  }
);
</script>

<template>
  <div>
    <p class="font-bold mb-5 text-lg">{{ t("purchaseWaybill.SupplierDetails") }}</p>

    <FormInput :label="t('purchaseWaybill.WaybillNumber')" v-model="form.waybillNumber"
      :error="props.errors?.waybillNumber" :placeholder="t('purchaseWaybill.WaybillNumberPlaceholder')"
      :invalid="!!props.errors?.waybillNumber" disabled />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <FormDropdown v-if="!disabled" :label="t('purchaseWaybill.Supplier')"
        :modelValue="form.supplierId" :error="props.errors?.supplierId"
        :placeholder="t('purchaseWaybill.SupplierPlaceholder')" :invalid="!!props.errors?.supplierId"
        :options="supplierLookups"
        @update:modelValue="(v: string) => { form.supplierId = v; emitUpdate(); }" />
      <FormInput v-else :label="t('purchaseWaybill.Supplier')"
        :modelValue="props.supplierDetails?.supplierName ?? ''" disabled />

      <FormInput :label="t('purchaseWaybill.SupplierSalesOrder')" v-model="form.supplierSalesOrder"
        :error="props.errors?.supplierSalesOrder" :placeholder="t('purchaseWaybill.SupplierSalesOrderPlaceholder')"
        :invalid="!!props.errors?.supplierSalesOrder" :disabled="disabled" @blur="emitUpdate" />

      <div class="flex gap-4 mt-2 md:col-span-2">
        <div class="w-1/2">
          <label class="block text-gray-600 text-lg">{{ t("purchaseWaybill.WaybillDate") }}</label>
          <DatePicker v-model="form.waybillDate" showIcon fluid iconDisplay="input"
            :placeholder="t('purchaseWaybill.WaybillDatePlaceholder')" :disabled="disabled"
            :class="{'p-invalid border-red-500': props.errors?.waybillDate}"
            @update:modelValue="emitUpdate" />
          <small v-if="props.errors?.waybillDate" class="p-error text-red-500 block mt-1">{{ t(props.errors.waybillDate) }}</small>
        </div>
        <div class="w-1/2">
          <label class="block text-gray-600 text-lg">{{ t("purchaseWaybill.ExpectedDelivery") }}</label>
          <DatePicker v-model="form.expectedDeliveryDate" showIcon fluid iconDisplay="input"
            :placeholder="t('purchaseWaybill.ExpectedDeliveryPlaceholder')" :disabled="disabled"
            @update:modelValue="emitUpdate" />
        </div>
      </div>

      <FormDropdown :label="t('purchaseWaybill.PurchaseOrder')" :modelValue="form.purchaseOrderRef"
        :error="props.errors?.purchaseOrderRef" :placeholder="t('purchaseWaybill.PurchaseOrderPlaceholder')"
        :disabled="disabled"
        @update:modelValue="(v: string) => { form.purchaseOrderRef = v; emitUpdate(); }" />

      <FormInput :label="t('purchaseWaybill.Reference')" v-model="form.externalReference"
        :error="props.errors?.externalReference" :placeholder="t('purchaseWaybill.ReferencePlaceholder')"
        :disabled="disabled" @blur="emitUpdate" />
    </div>

    <p class="font-bold mb-5 mt-5 text-lg">{{ t("purchaseWaybill.CurrencyInfo") }}</p>

    <FormDropdown v-if="!disabled" class="w-full" :label="t('purchaseWaybill.Currency')"
      :options="CurrenciesLookups" optionLabel="label" optionValue="value"
      :modelValue="form.currencyId" :error="props.errors?.currencyId"
      :placeholder="t('purchaseWaybill.CurrencyPlaceholder')"
      @update:modelValue="(v: string) => { form.currencyId = v; emitUpdate(); }" />
    <FormInput v-else class="w-full" :label="t('purchaseWaybill.Currency')"
      :modelValue="props.paymentTerms?.currencyCode ?? ''" disabled />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div>
        <label class="block text-gray-900 text-lg">{{ t("purchaseWaybill.ExchangeDate") }}</label>
        <DatePicker v-model="form.rateDate" showIcon fluid iconDisplay="input"
          :placeholder="t('purchaseWaybill.ExchangedatePlaceholder')" :disabled="disabled"
          @update:modelValue="emitUpdate" />
      </div>
      <FormInput :label="t('purchaseWaybill.ExchangeValue')" v-model="form.exchangeRate" type="number"
        :error="props.errors?.exchangeRate" :placeholder="t('purchaseWaybill.ExchangeValuePlaceholder')"
        :disabled="disabled || isUsdCurrency" @blur="emitUpdate" />
    </div>
  </div>
</template>
