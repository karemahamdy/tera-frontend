<script setup lang="ts">
import { ref } from 'vue';
import BaseStepper from '@/sharedComponents/stepper/BaseStepper.vue';
import StepperActions from '@/sharedComponents/stepper/StepperActions.vue';

import OpeningBalanceInfo from '../components/OpeningBalanceInfo.vue';
import OpeningBalanceReview from '../components/OpeningBalanceReview.vue';

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
  { label: "Opening Balance info" },
  { label: "Review" }
];
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="inventory" subtitle="operation.title" actionName="Create Opening Balance" />
    <BaseStepper v-model="activeStep" :steps="steps">
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
          <OpeningBalanceInfo v-if="activeStep === 0"  />
          <OpeningBalanceReview v-else-if="activeStep === 1" @prev="previousTab" @submit="submit" />
        </template>
      </Card>
      <StepperActions :current="activeStep" :total="steps.length" nextText="Next" prevText="Back" finishText="Create"
        @next="nextTab" @previous="previousTab" @finish="submit" />

    </BaseStepper>
  </div>
</template>

<style scoped></style>