<script setup lang="ts">
import { ref, reactive } from 'vue';
import WarehouseTransaction from '../components/WarehouseTransaction.vue';
import BaseStepper from '@/sharedComponents/stepper/BaseStepper.vue';
import StepperActions from '@/sharedComponents/stepper/StepperActions.vue';
import LineItems from '../components/LineItems.vue';
import TransactionSummary from '../components/TransactionSummary.vue';

const activeStep = ref(0);

const formData = reactive({
  waybillDate: '',
  inventoryRequest: '',
  direction: 'Transfer', 
  warehouse: '', 
  zone: '',
  type: '',
  costCenter: '',
  source: {
    warehouse: '',
    zone: ''
  },
  destination: {
    warehouse: '',
    zone: ''
  }
});

const nextTab = () => {
  if (activeStep.value < steps.length - 1) activeStep.value++;
};

const previousTab = () => {
  if (activeStep.value > 0) activeStep.value--;
};

const submit = () => {
  console.log("finish wizard", formData);
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
          <WarehouseTransaction v-if="activeStep === 0" v-model="formData" />
          <LineItems v-else-if="activeStep === 1" :transactionType="formData.direction" @next="nextTab" @prev="previousTab" />
          <div v-else-if="activeStep === 2">
             <TransactionSummary :data="formData" />
          </div>
        </template>
      </Card>
      <StepperActions :current="activeStep" :total="steps.length" nextText="Next" prevText="Back" finishText="Create"
        @next="nextTab" @previous="previousTab" @finish="submit" />
    </BaseStepper>
  </div>
</template>

<style scoped></style>