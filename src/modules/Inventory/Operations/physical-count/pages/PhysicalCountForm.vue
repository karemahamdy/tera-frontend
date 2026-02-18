<script setup lang="ts">
import { ref } from 'vue';
import BaseStepper from '@/sharedComponents/stepper/BaseStepper.vue';
import StepperActions from '@/sharedComponents/stepper/StepperActions.vue';

import CountInformation from '../components/CountInformation.vue';
import LineItems from '../components/LineItems.vue';
import Review from '../components/Review.vue';

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
  { label: "Count Information" },
  { label: "Line Items" },
  { label: "Review" }
];
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="inventory" subtitle="operation.title" actionName="New Count" />
    <BaseStepper v-model="activeStep" :steps="steps">
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
          <CountInformation v-if="activeStep === 0"  />
          <LineItems v-else-if="activeStep === 1" @prev="previousTab" @next="nextTab" />
          <Review v-else-if="activeStep === 2" @prev="previousTab" @submit="submit" />
        </template>
      </Card>
      <StepperActions :current="activeStep" :total="steps.length" nextText="Next" prevText="Back" finishText="Create"
        @next="nextTab" @previous="previousTab" @finish="submit" />

    </BaseStepper>
  </div>
</template>

<style scoped></style>