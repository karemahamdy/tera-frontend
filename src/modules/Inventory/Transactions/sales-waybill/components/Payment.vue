<script setup lang="ts">
import { ref, reactive } from "vue"
import { useI18n } from "vue-i18n"
import TransactionSummary from '@/modules/Inventory/shared/components/TransactionSummary.vue'

const { t } = useI18n()

const emit = defineEmits(['prev', 'submit'])

const paymentType = ref("Payable")
const paymentTerms = ref(null)
const importType = ref(null)
const incoterms = ref(null)

const comments = reactive({
    comment1: "",
    comment2: "",
    comment3: "",
    comment4: "",
    comment5: "",
})


const subTotal = ref(4585.00)
const taxTotal = ref(-229.25)
const globalDiscount = ref("000")
const grandTotal = 4814.25


const paymentTermsOptions = [
    { label: t("payment.net30"), value: "Net 30 Days" },
    { label: t("payment.immediate"), value: "Immediate" },
]

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
                        <div class="flex-1 border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:border-primary-500 transition-colors"
                            :class="{
                                'border-primary-500 bg-primary-50': paymentType === 'Payable',
                                'border-gray-200': paymentType !== 'Payable'
                            }" @click="paymentType = 'Payable'">
                            <div>
                                <div class="font-bold text-gray-700">
                                    {{ t("payment.payable") }}
                                </div>
                                <div class="text-xs text-gray-500">
                                    {{ t("payment.payViaInvoice") }}
                                </div>
                            </div>

                            <RadioButton v-model="paymentType" inputId="payable" value="Payable" />
                        </div>


                        <div class="flex-1 border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:border-primary-500 transition-colors"
                            :class="{
                                'border-primary-500 bg-primary-50': paymentType === 'Cash',
                                'border-gray-200': paymentType !== 'Cash'
                            }" @click="paymentType = 'Cash'">
                            <div>
                                <div class="font-bold  text-gray-700">
                                    {{ t("payment.cash") }}
                                </div>
                                <div class="text-xs text-gray-500">
                                    {{ t("payment.immediatePayment") }}
                                </div>
                            </div>

                            <RadioButton v-model="paymentType" inputId="cash" value="Cash" />
                        </div>

                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">

                    <div class="md:col-span-2">
                        <FormDropdown :label="t('payment.paymentTerms')" v-model="paymentTerms"
                            :options="paymentTermsOptions" :placeholder="t('payment.selectTerms')" />
                    </div>

                    <div class="md:col-span-2">
                        <FormDropdown :label="t('payment.ExportType')" v-model="importType" :options="importOptions"
                            :placeholder="t('payment.selectType')" />
                    </div>

                    <div class="md:col-span-2">
                        <FormDropdown :label="t('payment.incoterms')" v-model="incoterms" :options="importOptions"
                            :placeholder="t('payment.selectIncoterms')" />
                    </div>

                </div>
            </div>
            <div class="w-full lg:w-1/3">
                <TransactionSummary :subTotal="subTotal" :taxTotal="taxTotal" :grandTotal="grandTotal"
                    v-model:globalDiscount="globalDiscount" />
            </div>

        </div>

        <div class="mt-8">
            <h3 class="font-bold text-lg text-gray-700 mb-4">
                {{ t("payment.notesComments") }}
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <FormInput v-model="comments.comment1" :label="t('payment.comment1')"
                    :placeholder="t('payment.commentPlaceholder')" />

                <FormInput v-model="comments.comment2" :label="t('payment.comment2')"
                    :placeholder="t('payment.commentPlaceholder')" />

                <FormInput v-model="comments.comment3" :label="t('payment.comment3')"
                    :placeholder="t('payment.commentPlaceholder')" />

                <FormInput v-model="comments.comment4" :label="t('payment.comment4')"
                    :placeholder="t('payment.commentPlaceholder')" />

                <FormInput v-model="comments.comment5" :label="t('payment.comment5')"
                    :placeholder="t('payment.commentPlaceholder')" class="md:col-span-2" />

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
