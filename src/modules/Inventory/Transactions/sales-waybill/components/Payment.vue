<script setup lang="ts">
import {  reactive, computed, watch, onMounted, watchEffect } from "vue"
import { useI18n } from "vue-i18n"
import TransactionSummary from '@/modules/Inventory/shared/components/TransactionSummary.vue'
import { useInventoryLookups } from "@/composables/useInventoryLookups";

const { t } = useI18n()
const { PaymentTerms, IncotermsLookups, getIncotermsLookups, getPaymentTermsLookups } = useInventoryLookups();
onMounted(async () => {
  await Promise.all([getIncotermsLookups(), getPaymentTermsLookups()]);
});

const props = defineProps<{
    lineItems?: any[];
    paymentInfo?: any;
    paymentTerms?: any;
    notes?: any;
    disabled?: boolean;
    errors?: Record<string, string>;
}>();

const emit = defineEmits(['prev', 'submit', 'update'])

const form = reactive({
    paymentType:    props.paymentInfo?.paymentType ?? "Payable",
    paymentTermId:  props.paymentInfo?.paymentTermId ?? null as string | null,
    purchaseType:   props.paymentInfo?.purchaseType ?? null as string | null,
    incoterm:       props.paymentInfo?.incoterm ?? null as string | null,
    subTotal:       props.paymentInfo?.subTotal ?? 0,
    totalTax:       props.paymentInfo?.totalTax ?? 0,
    globalDiscount: props.paymentInfo?.globalDiscount ?? 0,
    grandTotal:     props.paymentInfo?.grandTotal ?? 0,
    comment1: props.notes?.comment1 ?? "",
    comment2: props.notes?.comment2 ?? "",
    comment3: props.notes?.comment3 ?? "",
    comment4: props.notes?.comment4 ?? "",
    comment5: props.notes?.comment5 ?? "",
    note: props.notes?.note ?? ""
});



// Re-initialize form when parent props arrive (view/edit mode)
watch(() => props.paymentInfo, (pi) => {
    if (!pi) return;
    form.paymentType =    pi.paymentType ?? "Payable";
    form.paymentTermId =  pi.paymentTermId ?? null;
    form.purchaseType =   pi.purchaseType ?? null;
    form.incoterm =       pi.incoterm ?? null;
    form.globalDiscount = pi.globalDiscount ?? 0;
}, { immediate: true });

watch(() => props.notes, (n) => {
    if (!n) return;
    form.comment1 = n.comment1 ?? "";
    form.comment2 = n.comment2 ?? "";
    form.comment3 = n.comment3 ?? "";
    form.comment4 = n.comment4 ?? "";
    form.comment5 = n.comment5 ?? "";
    form.note =     n.note ?? "";
}, { immediate: true });

// --- Computeds for Summary ---
const subTotal = computed(() => {
    return (props.lineItems || []).reduce((sum: number, item: any) => sum + (Number(item.quantity) * Number(item.unitPrice) || 0), 0);
});

const totalTax = computed(() => {
    return (props.lineItems || []).reduce((sum: number, item: any) => {
        const itemSub = Number(item.quantity) * Number(item.unitPrice) || 0;
        const taxRate = Number(item.tax || item.unitTaxPercent) || 0;
        return sum + (itemSub * taxRate / 100);
    }, 0);
});

const grandTotalValue = computed(() => {
    return subTotal.value + totalTax.value - (Number(form.globalDiscount) || 0);
});

// exchange rate from parent terms (default 1)
const exchangeRate = computed(() => props.paymentTerms?.exchangeRate || 1);

// disable & clear incoterm when purchase type is Local
const isLocal = computed(() => form.purchaseType === 'Local');
watchEffect(() => {
  if (isLocal.value) {
    form.incoterm = null;
  }
});
const isCash = computed(() => form.paymentType === 'Cash');
watch(
  () => [form.comment1, form.comment2, form.comment3, form.comment4, form.comment5, form.note],
  () => {
    emitUpdate();
  }
);
// base-currency equivalents
const subTotalBase = computed(() => Number((subTotal.value * exchangeRate.value).toFixed(2)));
const discountAmountBase = computed(() => Number(((Number(form.globalDiscount) || 0) * exchangeRate.value).toFixed(2)));
const grandTotalBase = computed(() => Number((grandTotalValue.value * exchangeRate.value).toFixed(2)));

// Watch totals and update reactive form only — do NOT emit here.
// Emitting from this watcher causes the parent to update formData → lineItems
// flows back down → computeds re-run → watcher fires again → infinite loop.
watch([subTotal, totalTax, grandTotalValue], ([newSub, newTax, newGrand]) => {
    form.subTotal = newSub;
    form.totalTax = newTax;
    form.grandTotal = newGrand;
    // emitUpdate();
}, { immediate: true });

watch(() => form.globalDiscount, () => {
    form.grandTotal = grandTotalValue.value;
    emitUpdate();
});

// when exchange rate changes (or any base total changes) re-emit so parent can react
watch(exchangeRate, () => {
    // parent will recompute any payload fields and base numbers
    emitUpdate();
});

function emitUpdate() {
    if (props.disabled) return;
    emit('update', { 
        paymentInfo: { 
            paymentType:   form.paymentType,
            paymentTermId: form.paymentTermId,
            purchaseType:  form.purchaseType,
            incoterm:      form.incoterm,
            subTotal:      form.subTotal,
            totalTax:      form.totalTax,
            globalDiscount:form.globalDiscount,
            grandTotal:    form.grandTotal,

            // base amounts depend on exchange rate / total base
            subTotalBase: subTotalBase.value,
            discountAmountBase: discountAmountBase.value,
            grandTotalBase: grandTotalBase.value
        },
        notes: { 
            comment1: form.comment1,
            comment2: form.comment2,
            comment3: form.comment3,
            comment4: form.comment4,
            comment5: form.comment5,
            note:     form.note 
        }
    });
}

const salesTypeOptions = [
    { label: t("payment.export"), value: "Export" },
    { label: t("payment.local"), value: "Local" },
];


</script>

<template>
    <div class="h-full">
        <h2 class="text-xl font-bold text-gray-700 mb-10">
            {{ t("payment.paymentFinanceInfo") }}
        </h2>
        <div class="flex flex-col lg:flex-row gap-8">
            <div class="flex-1 flex flex-col gap-6">
                <!-- Payment Type -->
                <div class="flex gap-4">
                    <div 
                        class="flex-1 border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:border-primary-500 transition-colors"
                        :class="[form.paymentType === 'Payable' ? 'border-primary-500 bg-primary-50' : 'border-gray-200', disabled ? 'opacity-50 pointer-events-none' : '']" 
                        @click="!disabled && (form.paymentType = 'Payable')"
                    >
                        <div>
                            <div class="font-bold text-gray-700">{{ t("payment.payable") }}</div>
                            <div class="text-xs text-gray-500">{{ t("payment.payViaInvoice") }}</div>
                        </div>
                        <RadioButton v-model="form.paymentType" inputId="payable" value="Payable" :disabled="disabled" />
                    </div>

                    <div 
                        class="flex-1 border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:border-primary-500 transition-colors"
                        :class="[form.paymentType === 'Cash' ? 'border-primary-500 bg-primary-50' : 'border-gray-200', disabled ? 'opacity-50 pointer-events-none' : '']" 
                        @click="!disabled && (form.paymentType = 'Cash')"
                    >
                        <div>
                            <div class="font-bold text-gray-700">{{ t("payment.cash") }}</div>
                            <div class="text-xs text-gray-500">{{ t("payment.immediatePayment") }}</div>
                        </div>
                        <RadioButton v-model="form.paymentType" inputId="cash" value="Cash" :disabled="disabled" />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <FormDropdown 
                            :label="t('payment.paymentTerms')" 
                            v-model="form.paymentTermId"
                            :options="PaymentTerms" 
                            optionLabel="label" 
                            optionValue="value" 
                            :placeholder="t('payment.selectTerms')" 
                            :disabled="disabled || isCash" 
                            :error="errors?.paymentTermId"
                            @update:modelValue="emitUpdate"
                        />
                    </div>
                    <div class="md:col-span-2">
                        <FormDropdown 
                            :label="t('salesWaybill.SalesType')" 
                            v-model="form.purchaseType" 
                            :options="salesTypeOptions"
                            optionLabel="label"
                            optionValue="value"
                            :placeholder="t('payment.selectType')" 
                            :disabled="disabled || isCash"
                            :error="errors?.purchaseType" 
                            @update:modelValue="emitUpdate"
                        />
                    </div>
                    <div class="md:col-span-2">
                        <FormDropdown 
                            :label="t('payment.incoterms')" 
                            v-model="form.incoterm" 
                            :options="IncotermsLookups"
                            optionLabel="label"
                            optionValue="value"
                            :placeholder="t('payment.selectIncoterms')" 
                            :disabled="disabled || isLocal || isCash" 
                            :error="errors?.incoterm"
                            @update:modelValue="emitUpdate"
                            
                        />
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
                    :disabled="disabled"
                />
            </div>
        </div>

        <div class="mt-4">
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
:deep(.p-inputtext) {
    background-color: #f9fafb;
    border-color: #e5e7eb;
}
:deep(.p-select) {
    background-color: #f9fafb;
    border-color: #e5e7eb;
}
</style>
