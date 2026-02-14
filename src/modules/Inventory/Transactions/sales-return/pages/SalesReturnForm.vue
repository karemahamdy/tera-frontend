<script setup lang="ts">
import { ref } from 'vue';
import ReturnDetails from '../components/ReturnDetails.vue';

import BaseStepper from '@/sharedComponents/stepper/BaseStepper.vue';
import StepperActions from '@/sharedComponents/stepper/StepperActions.vue';
import LineItems from '../components/LineItems.vue';
import Payment from '../components/Payment.vue';

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
  { label: "Return Information" },
  { label: "Return Items" },
  { label: "Quality Inspection" }
];
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="inventory" subtitle="masterData" actionName="purchaseWaybill.purchaseWaybill" />
    <BaseStepper v-model="activeStep" :steps="steps" code="PW-2026-001">
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
          <ReturnDetails v-if="activeStep === 0" />
          <LineItems v-else-if="activeStep === 1" @next="nextTab" @prev="previousTab" />
          <Payment v-else-if="activeStep === 2" @prev="previousTab" @submit="submit" />
        </template>
      </Card>
      <StepperActions :current="activeStep" :total="steps.length" nextText="Next" prevText="Back" finishText="Create"
        @next="nextTab" @previous="previousTab" @finish="submit" />

    </BaseStepper>
  </div>
</template>

<style scoped></style>