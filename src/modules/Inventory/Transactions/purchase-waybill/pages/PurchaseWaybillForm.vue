<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import SupplierDetails from '../components/SupplierDetails.vue';
import WarehouseDetails from '../components/WarehouseDetails.vue';
import BaseStepper from '@/sharedComponents/stepper/BaseStepper.vue';
import StepperActions from '@/sharedComponents/stepper/StepperActions.vue';
import LineItems from '../components/LineItems.vue';
import Payment from '../components/Payment.vue';
import { usePurchaseWaybill } from '../composables/usePurshace';
import type { PurchaseWaybillDetail } from '../types/PurchaseWaybill';

const route = useRoute();
const { fetchPurchaseWaybillById, createPurchaseWaybill, updatePurchaseWaybill } = usePurchaseWaybill();

// Route params
const id = computed(() => route.params.id as string | undefined);
const mode = computed(() => {
  if (route.name === 'PurchaseWaybillView') return 'view';
  if (route.name === 'PurchaseWaybillEdit') return 'edit';
  return 'create';
});

const isDisabled = computed(() => mode.value === 'view');

// Fetched record (null when creating)
const formData = ref<PurchaseWaybillDetail | null>(null);

const activeStep = ref(0);

const nextTab = () => {
  if (activeStep.value < steps.length - 1) activeStep.value++;
};

const previousTab = () => {
  if (activeStep.value > 0) activeStep.value--;
};

const submit = async () => {
  // submit/update logic is handled by the consuming page / parent
  console.log('finish wizard');
};

const steps = [
  { label: "Commercial Details" },
  { label: "Warehouse Details" },
  { label: "Line Items" },
  { label: "Payment" }
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
    <ScreenHeader
      title="inventory"
      subtitle="operation.transactions"
      :actionName="mode === 'create' ? 'purchaseWaybill.addpurchaseWaybill' : ''"
    />
    <BaseStepper
      v-model="activeStep"
      :steps="steps"
      :code="formData?.supplierDetails?.waybillNumber ?? ''"
    >
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
          <SupplierDetails
            v-if="activeStep === 0"
            :supplierDetails="formData?.supplierDetails"
            :paymentTerms="formData?.paymentTerms"
            :disabled="isDisabled"
          />
          <WarehouseDetails
            v-else-if="activeStep === 1"
            :warehouseDetails="formData?.warehouseDetails"
            :disabled="isDisabled"
          />
          <LineItems
            v-else-if="activeStep === 2"
            :lineItems="formData?.lineItems"
            :disabled="isDisabled"
            @next="nextTab"
            @prev="previousTab"
          />
          <Payment
            v-else-if="activeStep === 3"
            :paymentInfo="formData?.paymentInfo"
            :notes="formData?.notes"
            :disabled="isDisabled"
            @prev="previousTab"
            @submit="submit"
          />
        </template>
      </Card>
      <StepperActions
        v-if="!isDisabled"
        :current="activeStep"
        :total="steps.length"
        nextText="Next"
        prevText="Back"
        finishText="Create"
        @next="nextTab"
        @previous="previousTab"
        @finish="submit"
      />
    </BaseStepper>
  </div>
</template>

<style scoped></style>