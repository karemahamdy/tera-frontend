<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SupplierDetails from '../components/SupplierDetails.vue';
import WarehouseDetails from '../components/WarehouseDetails.vue';
import BaseStepper from '@/sharedComponents/stepper/BaseStepper.vue';
import StepperActions from '@/sharedComponents/stepper/StepperActions.vue';
import LineItems from '../components/LineItems.vue';
import Payment from '../components/Payment.vue';
import { usePurchaseWaybill } from '../composables/usePurshace';

import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { fetchPurchaseWaybillById, createPurchaseWaybill, updatePurchaseWaybill } = usePurchaseWaybill();

const id = computed(() => route.params.id as string | undefined);
const mode = computed(() => {
  if (route.name === 'PurchaseWaybillView') return 'view';
  if (route.name === 'PurchaseWaybillEdit') return 'edit';
  return 'create';
});

const isDisabled = computed(() => mode.value === 'view');

// Children only mount when data is ready — enables watch-free prop initialization in children
const dataReady = computed(() => !id.value || !!formData.value.supplierDetails);
const formData = ref<any>({
  supplierDetails: null,
  paymentTerms: null,
  warehouseDetails: null,
  lineItems: [],
  paymentInfo: null,
  notes: null
});

const activeStep = ref(0);

const updateSupplierData = (data: any) => {
  formData.value.supplierDetails = data.supplierDetails;
  formData.value.paymentTerms = { ...formData.value.paymentTerms, ...data.paymentTerms };
};

const updateWarehouseData = (data: any) => {
  formData.value.warehouseDetails = data;
};

const updateLineItemsData = (data: any[]) => {
  formData.value.lineItems = data;
};

const updatePaymentData = (data: any) => {
  formData.value.paymentInfo = data.paymentInfo;
  formData.value.paymentTerms = { ...formData.value.paymentTerms, ...data.paymentTerms };
  formData.value.notes = data.notes;
};

const nextTab = () => {
  if (activeStep.value < steps.length - 1) activeStep.value++;
};

const previousTab = () => {
  if (activeStep.value > 0) activeStep.value--;
};

const submit = async () => {
  try {
    const payload = {
      supplierDetails: formData.value.supplierDetails,
      paymentTerms: {
        ...formData.value.paymentTerms,
        exchangeRate: formData.value.paymentTerms?.exchangeRate !== null &&
          formData.value.paymentTerms?.exchangeRate !== undefined &&
          formData.value.paymentTerms?.exchangeRate !== ''
            ? Number(formData.value.paymentTerms.exchangeRate)
            : null
      },
      warehouseDetails: formData.value.warehouseDetails,
      lineItems: formData.value.lineItems.map((item: any) => ({
        itemId: item.itemId,
        quantity: Number(item.quantity) || 0,
        unitId: item.unitId || null,
        warehouseId: item.warehouseId || formData.value.warehouseDetails?.warehouseId || null,
        zoneId: item.zoneId || formData.value.warehouseDetails?.zoneId || null,
        unitPrice: Number(item.unitPrice) || 0,
        unitTaxPercent: Number(item.tax) || 0,
        lineTotal: Number(item.total) || 0
      })),
      paymentInfo: (() => {
        const pi = formData.value.paymentInfo;
        const rate = Number(formData.value.paymentTerms?.exchangeRate) || 1;
        return {
          ...pi,
          subTotalBase: Number((pi?.subTotal ?? 0)) * rate,
          taxAmountBase: Number((pi?.totalTax ?? 0)) * rate,
          discountAmountBase: Number((pi?.globalDiscount ?? 0)) * rate,
          grandTotalBase: Number((pi?.grandTotal ?? 0)) * rate,
        };
      })(),
      notes: formData.value.notes
    };
    if (mode.value === 'edit' && id.value) {
      await updatePurchaseWaybill(id.value, payload);
    } else {
      await createPurchaseWaybill(payload);
    }
    await router.push("/purchase-waybill");
  } catch (error) {
    console.error('Failed to submit purchase waybill:', error);
  }
};

const steps = [
  { label: t("steps.commercialDetails") },
  { label: t("steps.warehouseDetails") },
  { label: t("steps.lineItems") },
  { label: t("steps.payment") }
];

onMounted(async () => {
  if (id.value) {
    const result = await fetchPurchaseWaybillById(id.value);
    if (result) {
      formData.value = result;
    }
  }
});
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <div class="flex items-center justify-between mb-6">
      <ScreenHeader
        title="inventory"
        subtitle="operation.transactions"
        :actionName="mode === 'create' ? 'purchaseWaybill.addpurchaseWaybill' : 'purchaseWaybill.viewpurchaseWaybill'"
        class="!mb-0"
      />
    </div>
    <BaseStepper
      v-model="activeStep"
      :steps="steps"
      :code="formData?.supplierDetails?.waybillNumber ?? ''"
    >
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
          <!-- Loading state while API data loads (edit/view mode) -->
          <div v-if="!dataReady" class="flex justify-center items-center py-20">
            <ProgressSpinner />
          </div>
          <template v-else>
            <div v-show="activeStep === 0">
              <SupplierDetails
                :supplierDetails="formData?.supplierDetails"
                :paymentTerms="formData?.paymentTerms"
                :disabled="isDisabled"
                @update="updateSupplierData"
              />
            </div>
            <div v-show="activeStep === 1">
              <WarehouseDetails
                :warehouseDetails="formData?.warehouseDetails"
                :disabled="isDisabled"
                @update="updateWarehouseData"
              />
            </div>
            <div v-show="activeStep === 2">
              <LineItems
                :lineItems="formData?.lineItems"
                :disabled="isDisabled"
                @update="updateLineItemsData"
                @next="nextTab"
                @prev="previousTab"
              />
            </div>
            <div v-show="activeStep === 3">
              <Payment
                :lineItems="formData?.lineItems"
                :paymentInfo="formData?.paymentInfo"
                :paymentTerms="formData?.paymentTerms"
                :notes="formData?.notes"
                :disabled="isDisabled"
                @update="updatePaymentData"
                @prev="previousTab"
                @submit="submit"
              />
            </div>
          </template>
        </template>
      </Card>
      <StepperActions
        v-if="mode !== 'view'"
        :current="activeStep"
        :total="steps.length"
        nextText="Next"
        prevText="Back"
        :finishText="mode === 'edit' ? 'Update' : 'Create'"
        @next="nextTab"
        @previous="previousTab"
        @finish="submit"
      />
    </BaseStepper>
  </div>
</template>

<style scoped></style>