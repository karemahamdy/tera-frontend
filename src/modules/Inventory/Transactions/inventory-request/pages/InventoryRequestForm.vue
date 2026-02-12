<script setup lang="ts">
import { ref } from 'vue';
import BaseStepper from '@/sharedComponents/stepper/BaseStepper.vue';
import StepperActions from '@/sharedComponents/stepper/StepperActions.vue';
import LineItems from '../components/LineItems.vue';
import RequestInfo from '../components/RequestInfo.vue';
import ReviewSummary from '../components/ReviewSummary.vue';

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
  { label: "Request Info" },
  { label: "Line Items" },
  { label: "Review" },

];
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="inventory" subtitle="inventoryRequest.transaction"
      actionName="inventoryRequest.inventoryRequest" />
    <BaseStepper v-model="activeStep" :steps="steps" code="PW-2026-001">
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
          <RequestInfo v-if="activeStep === 0" />
          <LineItems v-else-if="activeStep === 1" @next="nextTab" @prev="previousTab" />
          <ReviewSummary requestBy="Ahmed Ali" sourceWarehouse="Main Warehouse" type="Transfer"
            requestDate="Oct 10, 2025" sourceWhCode="Wh-001" targetWhCode="Wh-032" v-else-if="activeStep === 2"
            @next="nextTab" @prev="previousTab" />
        </template>
      </Card>
      <StepperActions :current="activeStep" :total="steps.length" nextText="Next" prevText="Back" finishText="Create"
        @next="nextTab" @previous="previousTab" @finish="submit" />

    </BaseStepper>
  </div>
</template>

<style scoped></style>