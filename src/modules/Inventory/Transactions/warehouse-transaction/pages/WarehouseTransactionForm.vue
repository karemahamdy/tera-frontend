<script setup lang="ts">
import { ref, onMounted, computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import TransactionDetails from '../components/TransactionDetails.vue';
import LineItems from '../components/LineItems.vue';
import TransactionSummary from '../components/TransactionSummary.vue';
import { useWarehouseTransaction } from '../composables/useWarehouseTransaction';
import { useInventoryLookups } from '@/composables/useInventoryLookups';
import { toastService } from '../../../../../app/services/toastService';
import { WarehouseTransactionSchema } from '../validation/WarehouseTransactionSchema';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const {
  fetchWarehouseTransactionById,
  createWarehouseTransaction,
  updateWarehouseTransaction,
} = useWarehouseTransaction();

const { WarehouseLookups, getWarehouseLookups, costCenterLookups, getCostCenterLookups } = useInventoryLookups();

const id = computed(() => route.params.id as string | undefined);
const mode = computed(() => {
  if (route.name === 'WarehouseTransactionFormView') return 'view';
  if (route.name === 'WarehouseTransactionFormEdit') return 'edit';
  return 'create';
});
const isDisabled = computed(() => mode.value === 'view');

const activeStep = ref(0);
const transactionDetailsRef = ref<any>(null);

const formData = reactive({
  details: {
    direction: 'Transfer',
    documentNumber: '',
    waybillDate: new Date(),
    inventoryRequest: '',
    inventoryRequestNumber: '',
    warehouse: '',
    zone: '',
    zoneName: '',
    locationId: null,
    locationCode: '',
    row: '',
    column: '',
    rack: '',
    costCenter: '',
    type: '',
    destination: {
      warehouse: '',
      zone: '',
      zoneName: '',
      locationId: null,
      locationCode: ''
    }
  },
  lineItems: [] as any[],
});

const dataReady = ref(false);

const steps = [
  { label: t('warehouseTransaction.transactionDetails') },
  { label: t('itemsList.title') },
  { label: t('warehouseTransaction.review') },
];


const nextTab = async () => {
  // Validate step 0 (TransactionDetails) before advancing
  if (activeStep.value === 0 && transactionDetailsRef.value) {
    const isValid = await transactionDetailsRef.value.validate();
    if (!isValid) return;
  }
  if (activeStep.value < steps.length - 1) activeStep.value++;
};
const previousTab = () => { if (activeStep.value > 0) activeStep.value--; };

// Reactively disable Next button when required fields are missing
// const isNextDisabled = computed(() => {
//   if (activeStep.value !== 0) return false;
//   const d = formData.details;
//   return !WarehouseTransactionSchema.isValidSync({
//     warehouseId: d.warehouse,
//     destinationWarehouseId: d.destination?.warehouse || null,
//     direction: d.direction,
//   });
// });

// Reactively disable Create/Save button when required fields are missing
const isFinishDisabled = computed(() => {
  const d = formData.details;
  return !WarehouseTransactionSchema.isValidSync({
    warehouseId: d.warehouse,
    destinationWarehouseId: d.destination?.warehouse || null,
    direction: d.direction,
  });
});

function toDateStr(d: any): string | null {
  if (!d) return null;
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const summaryData = computed(() => {
  const d = formData.details;
  const wh = WarehouseLookups.value.find(w => w.value === d.warehouse);
  const dstWh = WarehouseLookups.value.find(w => w.value === d.destination?.warehouse);
  
  const cc = costCenterLookups.value.find(c => c.value === d.costCenter);
  
  return {
    waybillDate: toDateStr(d.waybillDate),
    inventoryRequest: d.inventoryRequestNumber || d.inventoryRequest,
    direction: d.direction,
    warehouse: wh?.label,
    zone: d.locationCode || d.zoneName,
    type: d.type,
    costCenter: cc?.label || d.costCenter,
    source: {
      warehouse: wh?.label,
      zone: d.locationCode || d.zoneName
    },
    destination: {
      warehouse: dstWh?.label,
      zone: d.destination?.locationCode || d.destination?.zoneName
    }
  };
});

const submit = async () => {
  try {
    const det = formData.details;
    const payload = {
      waybillNumber: det.documentNumber,
      waybillDate: toDateStr(det.waybillDate),
      inventoryRequest: det.inventoryRequest || null,
      transactionType: det.direction || null,
      costCenterId: det.costCenter || null,
      warehouseTransactionType: det.type || null,
      
      warehouseId: det.warehouse || null,
      zoneId: det.zone || null,
      locationId: det.locationId || null,

      destinationWarehouseId: det.direction === 'Transfer' ? (det.destination?.warehouse || null) : null,
      destinationZoneId: det.direction === 'Transfer' ? (det.destination?.zone || null) : null,
      destinationLocationId: det.direction === 'Transfer' ? (det.destination?.locationId || null) : null,

      lineItems: formData.lineItems.map((item: any) => ({
        itemId: item.itemId,
        quantity: Number(item.quantity) || 0,
        unitOfMeasure: item.unitId || item.unitOfMeasure || null,
        warehouseId: item.warehouseId || det.warehouse || null,
        zoneId: (item.warehouseId && item.warehouseId !== det.warehouse) ? (item.zoneId || null) : (item.zoneId || det.zone || null),
        locationId: (item.warehouseId && item.warehouseId !== det.warehouse) ? (item.locationId || null) : (item.locationId || det.locationId || null),
        unitPrice: Number(item.unitPrice) || 0,
        total: Number(item.total) || 0,
        serialLots: (item.serials || item.serialLots || []).map((s: any) => ({
          mainSerial: s.mainSerial || s.serial || '',
          quantity: Number(s.qty ?? s.availableQuantity) || 0,
          availableQuantity: Number(s.qty ?? s.availableQuantity) || 0,
          batchNumber: s.batchNumber || s.batch || null,
          expireDate: s.expireDate || s.expire ? new Date(new Date(s.expireDate || s.expire).getTime() - new Date(s.expireDate || s.expire).getTimezoneOffset() * 60000).toISOString() : null,
          serialNumber2: s.serialNumber2 || null,
          serialNumber3: s.serialNumber3 || null,
          comment: s.comment || null,
        })),
      })),
    };

    if (mode.value === 'edit' && id.value) {
      await updateWarehouseTransaction(id.value, payload);
    } else {
      await createWarehouseTransaction(payload);
    }
    await router.push('/warehouse-transaction');
  } catch (error: any) {
    toastService.error(error);
  }
};

onMounted(async () => {
  await Promise.all([
    getWarehouseLookups(),
    getCostCenterLookups()
  ]);
  if (id.value) {
    const result = await fetchWarehouseTransactionById(id.value);
    console.log(result);
    
    if (result) {
      formData.details.direction = result.transactionType || ' ';
      formData.details.documentNumber = result.waybillNumber || '';
      formData.details.waybillDate = result.waybillDate ? new Date(result.waybillDate) : new Date();
      formData.details.inventoryRequest = result.inventoryRequest || '';
      formData.details.inventoryRequestNumber = result.inventoryRequestNumber || result.inventoryRequestCode || result.inventoryRequestName || '';
      formData.details.warehouse = result.warehouseId || '';
      formData.details.zone = result.zoneId || '';
      formData.details.zoneName = result.zoneName || '';
      formData.details.locationId = result.locationId || null;
      formData.details.locationCode = result.locationName || result.locationCode || '';
      formData.details.costCenter = result.costCenterId || '';
      formData.details.type = result.warehouseTransactionType || null;
      
      if (result.destinationWarehouseId) {
        formData.details.destination.warehouse = result.destinationWarehouseId;
        formData.details.destination.zone = result.destinationZoneId;
        formData.details.destination.zoneName = result.destinationZoneName || '';
        formData.details.destination.locationId = result.destinationLocationId || null;
        formData.details.destination.locationCode = result.destinationLocationName || result.destinationLocationCode || '';
      }
      
      formData.lineItems = result.lineItems || [];
    }
  }
  dataReady.value = true;
});

watch(() => formData.details.direction, (newVal, oldVal) => {
  if (oldVal && newVal !== oldVal && mode.value === 'create') {
    formData.lineItems = [];
    formData.details.inventoryRequest = '';
    formData.details.inventoryRequestNumber = '';
    formData.details.warehouse = '';
    formData.details.zone = '';
    formData.details.zoneName = '';
    formData.details.locationId = null;
    formData.details.locationCode = '';
    formData.details.row = '';
    formData.details.column = '';
    formData.details.rack = '';
    formData.details.costCenter = '';
    formData.details.type = '';
    
    // reset destination retaining the observable reference
    formData.details.destination.warehouse = '';
    formData.details.destination.zone = '';
    formData.details.destination.zoneName = '';
    formData.details.destination.locationId = null;
    formData.details.destination.locationCode = '';
  }
});
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <div class="flex items-center justify-between mb-6">
      <ScreenHeader
        title="inventory"
        subtitle="inventoryRequest.transaction"
        :actionName="mode === 'create' ? 'warehouseTransaction.newTransaction' : 'warehouseTransaction.warehouseTransaction'"
        class="!mb-0"
      />
    </div>

    <BaseStepper v-model="activeStep" :steps="steps" :code="formData.details.documentNumber">
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
          <div v-if="!dataReady" class="flex justify-center items-center py-20">
            <ProgressSpinner />
          </div>
          <template v-else>
            <div v-show="activeStep === 0">
              <TransactionDetails
                ref="transactionDetailsRef"
                v-model="formData.details"
                :disabled="isDisabled"
                @request-selected="(lines) => formData.lineItems = lines"
              />
            </div>

            <div v-show="activeStep === 1">
              <LineItems
                :lineItems="formData.lineItems"
                :direction="formData.details.direction"
                :masterWarehouseId="formData.details.warehouse"
                :masterZoneId="formData.details.zone"
                :masterLocationId="formData.details.locationId"
                :disabled="isDisabled"
                @update="(val) => formData.lineItems = val"
              />
            </div>

            <div v-show="activeStep === 2">
              <TransactionSummary
                :data="summaryData || {}"
                :disabled="isDisabled"
              />
            </div>
          </template>
        </template>
      </Card>

      <StepperActions
        v-if="mode !== 'view'"
        :current="activeStep"
        :total="steps.length" 
        :disableFinish="isFinishDisabled"
        @next="nextTab"
        @previous="previousTab"
        @finish="submit"
      />
    </BaseStepper>
  </div>
</template>

<style scoped></style>