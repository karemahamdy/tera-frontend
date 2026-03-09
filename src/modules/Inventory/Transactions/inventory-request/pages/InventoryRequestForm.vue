<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import BaseStepper from '@/sharedComponents/stepper/BaseStepper.vue';
import StepperActions from '@/sharedComponents/stepper/StepperActions.vue';
import LineItems from '../components/LineItems.vue';
import RequestInfo from '../components/RequestInfo.vue';
import ReviewSummary from '../components/ReviewSummary.vue';
import { useInventoryRequest } from '../composables/useInventoryRequest';

const { t } = useI18n();
const router = useRouter();
const activeStep = ref(0);
const { fetchNextNumber, createInventoryRequest } = useInventoryRequest();

const formData = reactive({
  documentNumber: "",
  requestedBy: "",
  requestDate: new Date(),
  type: "", // Default value
  warehouseId: "",
  destinationWarehouseId: "",
  reason: "",
  lineItems: [] as any[]
});

onMounted(async () => {
  const nextNumberData = await fetchNextNumber();
  if (nextNumberData && nextNumberData.documentNumber) {
    formData.documentNumber = nextNumberData.documentNumber;
  }
});

const nextTab = () => {
  if (activeStep.value < steps.length - 1) activeStep.value++;
};

const previousTab = () => {
  if (activeStep.value > 0) activeStep.value--;
};

const submit = async () => {
  const payload = {
    inventoryRequestNumber: formData.documentNumber,
    requestedBy: formData.requestedBy,
    requestDate: formData.requestDate.toISOString(),
    type: formData.type,
    warehouseId: formData.warehouseId,
    destinationWarehouseId: formData.destinationWarehouseId,
    reason: formData.reason,
    lineItems: formData.lineItems.map(item => ({
      itemId: item.itemId,
      itemName: item.name,
      itemCode: item.code,
      quantity: item.quantity,
      unitOfMeasureId: item.unitId
    }))
  };
  
  try {
    await createInventoryRequest(payload);
    router.push({ name: 'InventoryRequest' });
  } catch (error) {
    console.error("Submission failed", error);
  }
};

const steps = [
  { label: t('inventoryRequest.requestInfoStep') },
  { label: t('inventoryRequest.lineItemsStep') },
  { label: t('inventoryRequest.reviewStep') },
];
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="inventory" subtitle="inventoryRequest.transaction"
      actionName="inventoryRequest.inventoryRequest" />
    <BaseStepper v-model="activeStep" :steps="steps" :code="formData.documentNumber">
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
          <RequestInfo v-if="activeStep === 0" v-model="formData" />
          <LineItems v-else-if="activeStep === 1" :lineItems="formData.lineItems" @update="(val) => formData.lineItems = val" @next="nextTab" @prev="previousTab" />
          <ReviewSummary v-else-if="activeStep === 2" :formData="formData" @next="nextTab" @prev="previousTab" />
        </template>
      </Card>
      <StepperActions :current="activeStep" :total="steps.length" 
        @next="nextTab" @previous="previousTab" @finish="submit" />

    </BaseStepper>
  </div>
</template>

<style scoped></style>