<script setup lang="ts">
import { reactive, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import TransactionSummary from '@/modules/Inventory/shared/components/TransactionSummary.vue'
import type { PaymentInfoData, NotesData, PaymentTermsData } from '../types/PurchaseWaybill';
import { useInventoryLookups } from "@/composables/useInventoryLookups";

const { PaymentTerms, IncotermsLookups, getIncotermsLookups, getPaymentTermsLookups } = useInventoryLookups();

const props = withDefaults(defineProps<{
  paymentInfo?: PaymentInfoData | null;
  paymentTerms?: PaymentTermsData | null;
  notes?: NotesData | null;
  disabled?: boolean;
}>(), {
  paymentInfo: null,
  paymentTerms: null,
  notes: null,
  disabled: false,
});

const { t } = useI18n()
const emit = defineEmits(['prev', 'submit', 'update'])

const form = reactive({
  paymentType:  props.paymentInfo?.paymentType ?? "Payable",
  paymentTermId:props.paymentInfo?.paymentTermId ?? null as string | null,
  purchaseType: props.paymentInfo?.purchaseType ?? null as string | null,
  incoterm:     props.paymentInfo?.incoterm ?? null as string | null,
  subTotal:     props.paymentInfo?.subTotal ?? 0,
  totalTax:     props.paymentInfo?.totalTax ?? 0,
  globalDiscount:props.paymentInfo?.globalDiscount ?? 0,
  grandTotal:   props.paymentInfo?.grandTotal ?? 0,
  comment1:     props.notes?.comment1 ?? "",
  comment2:     props.notes?.comment2 ?? "",
  comment3:     props.notes?.comment3 ?? "",
  comment4:     props.notes?.comment4 ?? "",
  comment5:     props.notes?.comment5 ?? "",
});

function emitUpdate() {
  if (props.disabled) return;
  const selectedTerm = PaymentTerms.value.find(t => t.value === form.paymentTermId);
  emit("update", {
    paymentInfo: {
      paymentType:     form.paymentType,
      paymentTermId:   form.paymentTermId,
      paymentTermName: selectedTerm?.label ?? "",
      purchaseType:    form.purchaseType,
      incoterm:        form.incoterm,
      subTotal:        form.subTotal,
      totalTax:        form.totalTax,
      globalDiscount:  form.globalDiscount,
      grandTotal:      form.grandTotal,
    },
    notes: {
      comment1: form.comment1,
      comment2: form.comment2,
      comment3: form.comment3,
      comment4: form.comment4,
      comment5: form.comment5,
    }
  });
}

const importOptions = [
  { label: t("payment.import"), value: "Import" },
  { label: t("payment.local"), value: "Local" },
]

onMounted(async () => {
  await Promise.all([getIncotermsLookups(), getPaymentTermsLookups()]);
});
</script>

<template>
  <div class="h-full">
    <h2 class="text-xl font-bold text-gray-700 mb-10">
      {{ t("payment.paymentFinanceInfo") }}
    </h2>
    <div class="flex flex-col lg:flex-row gap-8">
      <div class="flex-1 flex flex-col gap-6">
        <!-- Payment Type -->
        <div>
          <label class="block text-xl font-bold text-gray-700 mb-2">
            {{ t("payment.paymentType") }}
          </label>
          <div class="flex gap-4">
            <div
              class="flex-1 border rounded-lg p-4 flex items-center justify-between transition-colors"
              :class="{ 'border-primary-500 bg-primary-50': form.paymentType === 'Payable', 'border-gray-200': form.paymentType !== 'Payable' }"
              :style="disabled ? '' : 'cursor:pointer'"
              @click="!disabled && (() => { form.paymentType = 'Payable'; emitUpdate(); })()"
            >
              <div>
                <div class="font-bold text-gray-700">{{ t("payment.payable") }}</div>
                <div class="text-xs text-gray-500">{{ t("payment.payViaInvoice") }}</div>
              </div>
              <RadioButton v-model="form.paymentType" inputId="payable" value="Payable" :disabled="disabled" />
            </div>
            <div
              class="flex-1 border rounded-lg p-4 flex items-center justify-between transition-colors"
              :class="{ 'border-primary-500 bg-primary-50': form.paymentType === 'Cash', 'border-gray-200': form.paymentType !== 'Cash' }"
              :style="disabled ? '' : 'cursor:pointer'"
              @click="!disabled && (() => { form.paymentType = 'Cash'; emitUpdate(); })()"
            >
              <div>
                <div class="font-bold text-gray-700">{{ t("payment.cash") }}</div>
                <div class="text-xs text-gray-500">{{ t("payment.immediatePayment") }}</div>
              </div>
              <RadioButton v-model="form.paymentType" inputId="cash" value="Cash" :disabled="disabled" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <FormDropdown v-if="!disabled" :label="t('payment.paymentTerms')" :modelValue="form.paymentTermId"
              :options="PaymentTerms" :placeholder="t('payment.selectTerms')"
              @update:modelValue="(v: string) => { form.paymentTermId = v; emitUpdate(); }" />
            <FormInput v-else :label="t('payment.paymentTerms')"
              :modelValue="props.paymentInfo?.paymentTermName ?? ''" disabled />
          </div>

          <div class="md:col-span-2">
            <FormDropdown v-if="!disabled" :label="t('payment.importType')" :modelValue="form.purchaseType"
              :options="importOptions" :placeholder="t('payment.selectType')"
              @update:modelValue="(v: string) => { form.purchaseType = v; emitUpdate(); }" />
            <FormInput v-else :label="t('payment.importType')"
              :modelValue="props.paymentInfo?.purchaseType ?? ''" disabled />
          </div>

          <div class="md:col-span-2">
            <FormDropdown v-if="!disabled" :label="t('payment.incoterms')" :modelValue="form.incoterm"
              :options="IncotermsLookups" :placeholder="t('payment.selectIncoterms')"
              @update:modelValue="(v: string) => { form.incoterm = v; emitUpdate(); }" />
            <FormInput v-else :label="t('payment.incoterms')"
              :modelValue="props.paymentInfo?.incoterm ?? '—'" disabled />
          </div>
        </div>
      </div>

      <div class="w-full lg:w-1/3">
        <TransactionSummary
          :subTotal="form.subTotal"
          :taxTotal="form.totalTax"
          :grandTotal="form.grandTotal"
          v-model:globalDiscount="form.globalDiscount"
          :currency="props.paymentTerms?.currencyCode"
          :exchangeRate="props.paymentTerms?.exchangeRate"
          :baseCurrency="props.paymentTerms?.baseCurrencyCode"
        />
      </div>
    </div>

    <div class="mt-8">
      <h3 class="font-bold text-lg text-gray-700 mb-4">{{ t("payment.notesComments") }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput v-model="form.comment1" :label="t('payment.comment1')" :placeholder="t('payment.commentPlaceholder')" :disabled="disabled" @blur="emitUpdate" />
        <FormInput v-model="form.comment2" :label="t('payment.comment2')" :placeholder="t('payment.commentPlaceholder')" :disabled="disabled" @blur="emitUpdate" />
        <FormInput v-model="form.comment3" :label="t('payment.comment3')" :placeholder="t('payment.commentPlaceholder')" :disabled="disabled" @blur="emitUpdate" />
        <FormInput v-model="form.comment4" :label="t('payment.comment4')" :placeholder="t('payment.commentPlaceholder')" :disabled="disabled" @blur="emitUpdate" />
        <FormInput v-model="form.comment5" :label="t('payment.comment5')" :placeholder="t('payment.commentPlaceholder')" class="md:col-span-2" :disabled="disabled" @blur="emitUpdate" />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-inputtext) { background-color: #f9fafb; border-color: #e5e7eb; }
:deep(.p-select) { background-color: #f9fafb; border-color: #e5e7eb; }
</style>
