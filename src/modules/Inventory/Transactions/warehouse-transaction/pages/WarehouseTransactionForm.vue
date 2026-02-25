<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import BaseStepper from '@/sharedComponents/stepper/BaseStepper.vue';
import StepperActions from '@/sharedComponents/stepper/StepperActions.vue';
import TransactionDetails from '../components/TransactionDetails.vue';
import LineItems from '../components/LineItems.vue';
import TransactionSummary from '../components/TransactionSummary.vue';
import { useWarehouseTransaction } from '../composables/useWarehouseTransaction';
import { useInventoryLookups } from '@/composables/useInventoryLookups';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const {
  fetchWarehouseTransactionById,
  createWarehouseTransaction,
  updateWarehouseTransaction,
} = useWarehouseTransaction();

const { WarehouseLookups, getWarehouseLookups } = useInventoryLookups();

const id = computed(() => route.params.id as string | undefined);
const mode = computed(() => {
  if (route.name === 'WarehouseTransactionFormView') return 'view';
  if (route.name === 'WarehouseTransactionFormEdit') return 'edit';
  return 'create';
});
const isDisabled = computed(() => mode.value === 'view');

const activeStep = ref(0);

const formData = reactive({
  details: {
    direction: 'Transfer',
    documentNumber: '',
    waybillDate: new Date(),
    inventoryRequest: '',
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

const nextTab = () => { if (activeStep.value < steps.length - 1) activeStep.value++; };
const previousTab = () => { if (activeStep.value > 0) activeStep.value--; };

function toDateStr(d: any): string | null {
  if (!d) return null;
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0];
}

const summaryData = computed(() => {
  const d = formData.details;
  const wh = WarehouseLookups.value.find(w => w.value === d.warehouse);
  const dstWh = WarehouseLookups.value.find(w => w.value === d.destination?.warehouse);
  
  return {
    waybillDate: toDateStr(d.waybillDate) || '',
    inventoryRequest: d.inventoryRequest || '—',
    direction: d.direction,
    warehouse: wh?.label || '—',
    zone: d.locationCode || d.zoneName || '—',
    type: d.type || '—',
    costCenter: d.costCenter || '—',
    source: {
      warehouse: wh?.label || '—',
      zone: d.locationCode || d.zoneName || '—'
    },
    destination: {
      warehouse: dstWh?.label || '—',
      zone: d.destination?.locationCode || d.destination?.zoneName || '—'
    }
  };
});

const submit = async () => {
  try {
    const det = formData.details;
    const payload = {
      waybillNumber: det.documentNumber,
      waybillDate: toDateStr(det.waybillDate),
      requestReference: det.inventoryRequest || null,
      transactionType: det.direction,
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
        unitId: item.unitId || null,
        warehouseId: item.warehouseId || det.warehouse || null,
        zoneId: item.zoneId || null,
        locationId: item.locationId || null,
        unitPrice: Number(item.unitPrice) || 0,
        lineTotal: Number(item.total) || 0,
        serialLots: (item.serials || []).map((s: any) => ({
          mainSerial: s.serial || '',
          availableQuantity: Number(s.qty) || 0,
          batchNumber: s.batch || '',
          expireDate: s.expire ? new Date(s.expire).toISOString() : null,
          serialNumber2: s.serialNumber2 || '',
          serialNumber3: s.serialNumber3 || '',
          comment: s.comment || '',
        })),
      })),
    };

    if (mode.value === 'edit' && id.value) {
      await updateWarehouseTransaction(id.value, payload);
    } else {
      await createWarehouseTransaction(payload);
    }
    await router.push('/warehouse-transaction');
  } catch (error) {
    console.error('Failed to submit warehouse transaction:', error);
  }
};

onMounted(async () => {
  await getWarehouseLookups();
  if (id.value) {
    const result = await fetchWarehouseTransactionById(id.value);
    if (result) {
      formData.details.direction = result.transactionType || ' ';
      formData.details.documentNumber = result.waybillNumber || '';
      formData.details.waybillDate = result.waybillDate ? new Date(result.waybillDate) : new Date();
      formData.details.inventoryRequest = result.requestReference || '';
      formData.details.warehouse = result.warehouseId || '';
      formData.details.zone = result.zoneId || '';
      formData.details.locationId = result.locationId || null;
      formData.details.locationCode = result.locationCode || '';
      formData.details.costCenter = result.costCenterId || '';
      formData.details.type = result.warehouseTransactionType || ' ';
      
      if (result.destinationWarehouseId) {
        formData.details.destination.warehouse = result.destinationWarehouseId;
        formData.details.destination.zone = result.destinationZoneId;
        formData.details.destination.locationId = result.destinationLocationId || null;
        formData.details.destination.locationCode = result.destinationLocationCode || '';
      }
      
      formData.lineItems = result.lineItems || [];
    }
  }
  dataReady.value = true;
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
      <BaseButton
        v-if="mode === 'view'"
        label="button.edit"
        class="bg-primary-600 border-none hover:bg-primary-700 font-semibold px-4 py-2 rounded-lg"
        @click="router.push({ name: 'WarehouseTransactionFormEdit', params: { id } })"
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
                v-model="formData.details"
                :disabled="isDisabled"
              />
            </div>

            <div v-show="activeStep === 1">
              <LineItems
                :lineItems="formData.lineItems"
                :disabled="isDisabled"
                @update="(val) => formData.lineItems = val"
              />
            </div>

            <div v-show="activeStep === 2">
              <TransactionSummary
                :data="summaryData"
              />
            </div>
          </template>
        </template>
      </Card>

      <StepperActions
        v-if="mode !== 'view'"
        :current="activeStep"
        :total="steps.length"
        nextText="Next"
        prevText="Back"
        :finishText="mode === 'edit' ? 'Update' : 'Create'"
        @next="nextTab"
        @previous="previousTab"
        @finish="submit"
      />
    </BaseStepper>
  </div>
</template>

<style scoped></style>