<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import BaseStepper from '@/sharedComponents/stepper/BaseStepper.vue';
import StepperActions from '@/sharedComponents/stepper/StepperActions.vue';
import LineItems from '../components/LineItems.vue';
import RequestInfo from '../components/RequestInfo.vue';
import ReviewSummary from '../components/ReviewSummary.vue';
import { useInventoryRequest } from '../composables/useInventoryRequest';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const activeStep = ref(0);
const { fetchNextNumber, createInventoryRequest, fetchInventoryRequestById, updateInventoryRequest } = useInventoryRequest();

const id = computed(() => route.params.id as string | undefined);
const mode = computed(() => {
  if (route.name === 'InventoryRequestFormView') return 'view';
  if (route.name === 'InventoryRequestFormEdit') return 'edit';
  return 'create';
});

const isDisabled = computed(() => mode.value === 'view');
const dataReady = ref(false);

const formData = reactive({
  documentNumber: "",
  requestedBy: "",
  requestDate: new Date(),
  type: "",
  warehouseId: "",
  zoneId: "",
  locationId: null as string | null,
  locationCode: "",
  zoneName: "",
  destinationWarehouseId: "",
  destinationZoneId: "",
  destinationLocationId: null as string | null,
  destinationLocationCode: "",
  destinationZoneName: "",
  reason: "",
  lineItems: [] as any[]
});

onMounted(async () => {
  if (id.value) {
    const result = await fetchInventoryRequestById(id.value);
    if (result) {
      formData.documentNumber = result.inventoryRequestNumber || result.documentNumber || result.requestId;
      formData.requestedBy = result.requestedBy || result.requestedById;
      formData.requestDate = result.requestDate || result.date ? new Date(result.requestDate || result.date) : new Date();
      formData.type = result.type;
      formData.warehouseId = result.warehouseId || result.sourceWarehouseId;
      formData.zoneId = result.zoneId || '';
      formData.locationId = result.locationId || null;
      formData.locationCode = result.locationName || result.locationCode || '';
      formData.zoneName = result.zoneName || '';
      formData.destinationWarehouseId = result.destinationWarehouseId || result.targetWarehouseId;
      formData.destinationZoneId = result.destinationZoneId || '';
      formData.destinationLocationId = result.destinationLocationId || null;
      formData.destinationLocationCode = result.destinationLocationName || result.destinationLocationCode || '';
      formData.destinationZoneName = result.destinationZoneName || '';
      formData.reason = result.reason || result.resone;
      formData.lineItems = result.lineItems || result.items || [];
    }
    dataReady.value = true;
  } else {
    const nextNumberData = await fetchNextNumber();
    if (nextNumberData && nextNumberData.documentNumber) {
      formData.documentNumber = nextNumberData.documentNumber;
    }
    dataReady.value = true;
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
    warehouseId: formData.warehouseId || null,
    zoneId: formData.zoneId || null,
    locationId: formData.locationId || null,
    destinationWarehouseId: formData.destinationWarehouseId || null,
    destinationZoneId: formData.destinationZoneId || null,
    destinationLocationId: formData.destinationLocationId || null,
    reason: formData.reason,
    lineItems: formData.lineItems.map(item => ({
      itemId: item.itemId,
      itemName: item.itemName || item.name,
      itemCode: item.itemCode || item.code,
      quantity: Number(item.quantity) || 0,
      unitOfMeasureId: item.unitOfMeasureId || item.unitId
    }))
  };
  
  try {
    if (mode.value === 'edit' && id.value) {
      await updateInventoryRequest(id.value, payload);
    } else {
      await createInventoryRequest(payload);
    }
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
      :actionName="mode === 'view' ? 'inventoryRequest.view' : mode === 'edit' ? 'inventoryRequest.edit' : 'inventoryRequest.inventoryRequest'" />
    <BaseStepper v-model="activeStep" :steps="steps" :code="formData.documentNumber">
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
          <div v-if="!dataReady" class="flex justify-center items-center py-20">
            <ProgressSpinner />
          </div>
          <template v-else>
            <RequestInfo v-if="activeStep === 0" v-model="formData" :disabled="isDisabled" />
            <LineItems v-else-if="activeStep === 1" :lineItems="formData.lineItems" :disabled="isDisabled" @update="(val) => formData.lineItems = val" @next="nextTab" @prev="previousTab" />
            <ReviewSummary v-else-if="activeStep === 2" :formData="formData" @next="nextTab" @prev="previousTab" />
          </template>
        </template>
      </Card>
      <StepperActions v-if="mode !== 'view'" :current="activeStep" :total="steps.length" 
        :finishText="mode === 'edit' ? t('button.update') : t('button.create')"
        @next="nextTab" @previous="previousTab" @finish="submit" />

    </BaseStepper>
  </div>
</template>

<style scoped></style>