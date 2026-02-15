<script setup lang="ts">
import { ref } from 'vue';
import WarehouseTransaction from '../components/WarehouseTransaction.vue';
import BaseStepper from '@/sharedComponents/stepper/BaseStepper.vue';
import StepperActions from '@/sharedComponents/stepper/StepperActions.vue';
import LineItems from '../components/LineItems.vue';
import TransactionSummary from '../components/TransactionSummary.vue';

const activeStep = ref(0);
const nextTab = () => {
  if (activeStep.value < steps.length - 1) activeStep.value++;
};

const previousTab = () => {
  if (activeStep.value > 0) activeStep.value--;
};

const submit = () => {
  console.log("finish wizard");
};

const steps = [
  { label: "Transaction Info" },
  { label: "Line Items" },
  { label: "Review" }
];
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
     <ScreenHeader title="inventory" subtitle="inventoryRequest.transaction" actionName="warehouseTransaction.warehouseTransaction" />
    <BaseStepper v-model="activeStep" :steps="steps" code="PW-2026-001">
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
          <WarehouseTransaction v-if="activeStep === 0" />
          <LineItems v-else-if="activeStep === 1" @next="nextTab" @prev="previousTab" />
          <div v-else-if="activeStep === 2">
             <TransactionSummary />
             <div class="flex justify-end mt-4">
               <!-- Navigation buttons for the review step if needed, though StepperActions handles finish -->
             </div>
          </div>
        </template>
      </Card>
      <StepperActions :current="activeStep" :total="steps.length" nextText="Next" prevText="Back" finishText="Create"
        @next="nextTab" @previous="previousTab" @finish="submit" />

    </BaseStepper>
  </div>
</template>

<style scoped></style>