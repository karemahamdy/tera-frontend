<script setup lang="ts">
import { ref, reactive, watchEffect, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import TransactionSummary from '@/modules/Inventory/shared/components/TransactionSummary.vue'
import type { PaymentInfoData, NotesData } from '../types/PurchaseWaybill';
import { useInventoryLookups } from "@/composables/useInventoryLookups";

const {PaymentTerms, IncotermsLookups, getIncotermsLookups, getPaymentTermsLookups } = useInventoryLookups();

const props = withDefaults(defineProps<{
  paymentInfo?: PaymentInfoData | null;
  notes?: NotesData | null;
  disabled?: boolean;
}>(), {
  paymentInfo: null,
  notes: null,
  disabled: false,
});

const { t } = useI18n()
const emit = defineEmits(['prev', 'submit'])

const paymentType = ref("Payable")
const paymentTerms = ref<string | null>(null)
const importType = ref<string | null>(null)
const incoterms = ref<string | null>(null)

const comments = reactive({
  comment1: "",
  comment2: "",
  comment3: "",
  comment4: "",
  comment5: "",
})

const subTotal = ref(0)
const taxTotal = ref(0)
const globalDiscount = ref<number>(0)
const grandTotal = ref(0)

// Populate from props whenever paymentInfo changes
watchEffect(() => {
  if (props.paymentInfo) {
    paymentType.value = props.paymentInfo.paymentType ?? "Payable";
    paymentTerms.value = props.paymentInfo.paymentTermId ?? null;
    importType.value = props.paymentInfo.purchaseType ?? null;
    incoterms.value = props.paymentInfo.incoterm ?? null;
    subTotal.value = props.paymentInfo.subTotal ?? 0;
    taxTotal.value = props.paymentInfo.totalTax ?? 0;
    globalDiscount.value = props.paymentInfo.globalDiscount ?? 0;
    grandTotal.value = props.paymentInfo.grandTotal ?? 0;
  }
});

// Populate notes/comments from props
watchEffect(() => {
  if (props.notes) {
    comments.comment1 = props.notes.comment1 ?? "";
    comments.comment2 = props.notes.comment2 ?? "";
    comments.comment3 = props.notes.comment3 ?? "";
    comments.comment4 = props.notes.comment4 ?? "";
    comments.comment5 = props.notes.comment5 ?? "";
  }
});
onMounted(async () => {
  Promise.all([
    getIncotermsLookups(),
    getPaymentTermsLookups()
  ]);
})

const importOptions = [
  { label: t("payment.import"), value: "Import" },
  { label: t("payment.local"), value: "Local" },
]
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
              :class="{
                'border-primary-500 bg-primary-50': paymentType === 'Payable',
                'border-gray-200': paymentType !== 'Payable'
              }"
              :style="disabled ? '' : 'cursor:pointer'"
              @click="!disabled && (paymentType = 'Payable')"
            >
              <div>
                <div class="font-bold text-gray-700">{{ t("payment.payable") }}</div>
                <div class="text-xs text-gray-500">{{ t("payment.payViaInvoice") }}</div>
              </div>
              <RadioButton v-model="paymentType" inputId="payable" value="Payable" :disabled="disabled" />
            </div>

            <div
              class="flex-1 border rounded-lg p-4 flex items-center justify-between transition-colors"
              :class="{
                'border-primary-500 bg-primary-50': paymentType === 'Cash',
                'border-gray-200': paymentType !== 'Cash'
              }"
              :style="disabled ? '' : 'cursor:pointer'"
              @click="!disabled && (paymentType = 'Cash')"
            >
              <div>
                <div class="font-bold text-gray-700">{{ t("payment.cash") }}</div>
                <div class="text-xs text-gray-500">{{ t("payment.immediatePayment") }}</div>
              </div>
              <RadioButton v-model="paymentType" inputId="cash" value="Cash" :disabled="disabled" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <FormDropdown
              :label="t('payment.paymentTerms')"
              v-model="paymentTerms"
              :options="PaymentTerms"
              :placeholder="t('payment.selectTerms')"
              :disabled="disabled"
            />
          </div>

          <div class="md:col-span-2">
            <FormDropdown
              :label="t('payment.importType')"
              v-model="importType"
              :options="importOptions"
              :placeholder="t('payment.selectType')"
              :disabled="disabled"
            />
          </div>

          <div class="md:col-span-2">
            <FormDropdown
              :label="t('payment.incoterms')"
              v-model="incoterms"
              :options="IncotermsLookups"
              :placeholder="t('payment.selectIncoterms')"
              :disabled="disabled"
            />
          </div>
        </div>
      </div>

      <div class="w-full lg:w-1/3">
        <TransactionSummary
          :subTotal="subTotal"
          :taxTotal="taxTotal"
          :grandTotal="grandTotal"
          v-model:globalDiscount="globalDiscount"
        />
      </div>
    </div>

    <div class="mt-8">
      <h3 class="font-bold text-lg text-gray-700 mb-4">
        {{ t("payment.notesComments") }}
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput v-model="comments.comment1" :label="t('payment.comment1')" :placeholder="t('payment.commentPlaceholder')" :disabled="disabled" />
        <FormInput v-model="comments.comment2" :label="t('payment.comment2')" :placeholder="t('payment.commentPlaceholder')" :disabled="disabled" />
        <FormInput v-model="comments.comment3" :label="t('payment.comment3')" :placeholder="t('payment.commentPlaceholder')" :disabled="disabled" />
        <FormInput v-model="comments.comment4" :label="t('payment.comment4')" :placeholder="t('payment.commentPlaceholder')" :disabled="disabled" />
        <FormInput v-model="comments.comment5" :label="t('payment.comment5')" :placeholder="t('payment.commentPlaceholder')" class="md:col-span-2" :disabled="disabled" />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-inputtext) {
  background-color: #f9fafb;
  border-color: #e5e7eb;
}

:deep(.p-select) {
  background-color: #f9fafb;
  border-color: #e5e7eb;
}
</style>
