<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import LineItems from '../components/LineItems.vue';
import RequestInfo from '../components/RequestInfo.vue';
import ReviewSummary from '../components/ReviewSummary.vue';
import { useInventoryRequest } from '../composables/useInventoryRequest';
import { InventoryRequestSchema } from '../validation/InventoryRequestSchema';

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
      formData.documentNumber = result.inventoryRequestNumber || result.documentNumber;
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

const previousTab = () => {
  if (activeStep.value > 0) activeStep.value--;
};

const submit = async () => {
  const payload: any = {
    inventoryRequestNumber: formData.documentNumber,
    requestedBy: formData.requestedBy,
    requestDate: new Date(formData.requestDate.getTime() - formData.requestDate.getTimezoneOffset() * 60000).toISOString(),
    type: formData.type,
    warehouseId: formData.warehouseId || null,
    zoneId: formData.zoneId || null,
    locationId: formData.locationId || null,
    reason: formData.reason,
    lineItems: formData.lineItems.map(item => ({
      itemId: item.itemId,
      itemName: item.itemName || item.name,
      itemCode: item.itemCode || item.code,
      quantity: Number(item.quantity) || 0,
      unitOfMeasureId: item.unitOfMeasureId || item.unitId
    }))
  };

  if (formData.type === 'Transfer') {
    payload.destinationWarehouseId = formData.destinationWarehouseId || null;
    payload.destinationZoneId = formData.destinationZoneId || null;
    payload.destinationLocationId = formData.destinationLocationId || null;
  }
  
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

const errors = ref<{ [key: string]: string }>({});

// Map yup schema paths → keys used in RequestInfo.vue
const schemaPathToErrorKey: Record<string, string> = {
  type: 'type',
  warehouseId: 'SourceWarehouse',
  destinationWarehouseId: 'TargetWarehouse',
};

const nextTab = () => {
  // Only validate step 0 (RequestInfo); other steps go straight through
  if (activeStep.value !== 0) {
    activeStep.value++;
    return;
  }

  try {
    InventoryRequestSchema.validateSync(
      {
        type: formData.type,
        warehouseId: formData.warehouseId,
        destinationWarehouseId: formData.type === 'Transfer' ? (formData.destinationWarehouseId || null) : undefined,
        zoneId: formData.zoneId,
        destinationZoneId: formData.destinationZoneId,
      },
      { abortEarly: false }
    );

    errors.value = {};
    activeStep.value++;

  } catch (err: any) {
    errors.value = {};

    if (err.inner && err.inner.length) {
      err.inner.forEach((e: any) => {
        if (e.path) {
          const key = schemaPathToErrorKey[e.path] ?? e.path;
          errors.value[key] = e.message;
        }
      });
    } else if (err.path) {
      // abortEarly: true fallback (single error)
      const key = schemaPathToErrorKey[err.path] ?? err.path;
      errors.value[key] = err.message;
    }
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
            <!-- <ProgressSpinner /> -->
          </div>
          <template v-else>
            <RequestInfo v-if="activeStep === 0" v-model="formData" :disabled="isDisabled" :errors="errors"/>
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