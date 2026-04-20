<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SupplierDetails from '../components/SupplierDetails.vue';
import WarehouseDetails from '../components/WarehouseDetails.vue';
import LineItems from '../components/LineItems.vue';
import Payment from '../components/Payment.vue';
import { usePurchaseWaybill } from '../composables/usePurshace';

import { useI18n } from "vue-i18n";
import { SupplierSchema, LineItemsSchema, PaymentSchema, WarehouseSchema } from '../validation/PurchaseWaybillSchema';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { fetchPurchaseWaybillById, createPurchaseWaybill, updatePurchaseWaybill } = usePurchaseWaybill();

const id = computed(() => route.params.id as string | undefined);
const mode = computed(() => {
  if (route.name === 'PurchaseWaybillView') return 'view';
  if (route.name === 'PurchaseWaybillEdit') return 'edit';
  return 'create';
});

const isDisabled = computed(() => mode.value === 'view');

// Children only mount when data is ready — enables watch-free prop initialization in children
const dataReady = computed(() => !id.value || !!formData.value.supplierDetails);
const formData = ref<any>({
  supplierDetails: null,
  paymentTerms: null,
  warehouseDetails: null,
  lineItems: [],
  paymentInfo: null,
  notes: {
    comment1: "",
    comment2: "",
    comment3: "",
    comment4: "",
    comment5: "",
  }
});

const activeStep = ref(0);
const errors = ref<Record<string, string>>({});

const updateSupplierData = (data: any) => {
  formData.value.supplierDetails = data.supplierDetails;
  formData.value.paymentTerms = { ...formData.value.paymentTerms, ...data.paymentTerms };
};

const updateWarehouseData = (data: any) => {
  formData.value.warehouseDetails = data;
};

const updateLineItemsData = (data: any[]) => {
  formData.value.lineItems = data;
};

const updatePaymentData = (data: any) => {
  formData.value.paymentInfo = data.paymentInfo;
  formData.value.paymentTerms = { ...formData.value.paymentTerms, ...data.paymentTerms };
  formData.value.notes = data.notes;
};

// Watchers to clear errors when fields are filled
watch(() => formData.value.supplierDetails?.supplierId, (newVal) => {
  if (newVal) errors.value.supplierId = '';
});
watch(() => formData.value.supplierDetails?.waybillDate, (newVal) => {
  if (newVal) errors.value.waybillDate = '';
});
watch(() => formData.value.warehouseDetails?.warehouseId, (newVal) => {
  if (newVal) errors.value.warehouseId = '';
});
watch(() => formData.value.lineItems?.length, (newVal) => {
  if (newVal > 0) errors.value.lineItems = '';
});
watch(() => formData.value.paymentInfo?.paymentType, (newVal) => {
  if (newVal) errors.value.paymentType = '';
});
watch(() => formData.value.paymentInfo?.paymentTermId, (newVal) => {
  if (newVal) errors.value.paymentTermId = '';
});

const nextTab = async () => {
  errors.value = {}; // Clear errors first

  try {
    if (activeStep.value === 0) {
      await SupplierSchema.validate(formData.value.supplierDetails, { abortEarly: false });
    }
    if (activeStep.value === 1) {
      await WarehouseSchema.validate(formData.value.warehouseDetails ?? {}, { abortEarly: false });
    }
    if (activeStep.value === 2) {
      await LineItemsSchema.validate({ lineItems: formData.value.lineItems }, { abortEarly: false });
    }

    if (activeStep.value < steps.length - 1) activeStep.value++;

  } catch (err: any) {
    if (err?.inner?.length) {
      err.inner.forEach((e: any) => { errors.value[e.path] = e.message; });
    } else if (err?.path) {
      errors.value[err.path] = err.message;
    }
  }
};

const previousTab = () => {
  if (activeStep.value > 0) activeStep.value--;
};

const submit = async () => {
  errors.value = {}; // Clear errors first

  try {
    // Validate all schemas before submitting
    await SupplierSchema.validate(formData.value.supplierDetails, { abortEarly: false });
    await WarehouseSchema.validate(formData.value.warehouseDetails ?? {}, { abortEarly: false });
    await LineItemsSchema.validate({ lineItems: formData.value.lineItems }, { abortEarly: false });
    await PaymentSchema.validate({
      paymentType: formData.value.paymentInfo?.paymentType,
      paymentTermId: formData.value.paymentInfo?.paymentTermId,
      purchaseType: formData.value.paymentInfo?.purchaseType,
      incoterm: formData.value.paymentInfo?.incoterm,
    }, { abortEarly: false });

    // Proceed with submission if all validations pass
    const payload = {
      supplierDetails: formData.value.supplierDetails,
      paymentTerms: {
        ...formData.value.paymentTerms,
        exchangeRate: formData.value.paymentTerms?.exchangeRate !== null &&
          formData.value.paymentTerms?.exchangeRate !== undefined &&
          formData.value.paymentTerms?.exchangeRate !== ''
            ? Number(formData.value.paymentTerms.exchangeRate)
            : null
      },
      warehouseDetails: formData.value.warehouseDetails,
      lineItems: formData.value.lineItems.map((item: any) => ({
        itemId: item.itemId,
        quantity: Number(item.quantity) || 0,
        unitId: item.unitId || null,
        warehouseId: item.warehouseId || formData.value.warehouseDetails?.warehouseId || null,
        zoneId: item.zoneId || formData.value.warehouseDetails?.zoneId || null,
        unitPrice: Number(item.unitPrice) || 0,
        unitTaxPercent: Number(item.tax ?? item.unitTaxPercent) || 0,
        lineTotal: Number(item.total) || 0,
        serials: (item.serials || []).map((s: any) => ({
          mainSerial: s.serial || s.mainSerial || '',
          quantity: Number(s.qty ?? s.quantity) || 0,
          batchNumber: s.batch || s.batchNumber || null,
          expireDate: s.expire || s.expireDate ? new Date((s.expire || s.expireDate)).toISOString() : null,
          serialNumber2: s.serialNumber2 || null,
          serialNumber3: s.serialNumber3 || null,
          comment: s.comment || null,
        }))
      })),
      paymentInfo: (() => {
        const pi = formData.value.paymentInfo;
        const rate = Number(formData.value.paymentTerms?.exchangeRate) || 1;
        return {
          ...pi,
          subTotal: Number(pi?.subTotal) || 0,
          totalTax: Number(pi?.totalTax) || 0,
          globalDiscount: Number(pi?.globalDiscount) || 0,
          grandTotal: Number(pi?.grandTotal) || 0,
          subTotalBase: Number((pi?.subTotal ?? 0)) * rate,
          taxAmountBase: Number((pi?.totalTax ?? 0)) * rate,
          discountAmountBase: Number((pi?.globalDiscount ?? 0)) * rate,
          grandTotalBase: Number((pi?.grandTotal ?? 0)) * rate,
        };
      })(),
      notes: formData.value.notes
    };
    if (mode.value === 'edit' && id.value) {
      await updatePurchaseWaybill(id.value, payload);
    } else {
      await createPurchaseWaybill(payload);
    }
    await router.push("/purchase-waybill");
  } catch (error: any) {
    if (error?.inner?.length) {
      error.inner.forEach((e: any) => { errors.value[e.path] = e.message; });
      // Set activeStep to the first step with errors for better UX
      const errorPaths = error.inner.map((e: any) => e.path);
      if (errorPaths.some((p: string) => ['supplierId', 'waybillDate'].includes(p))) {
        activeStep.value = 0;
      } else if (errorPaths.some((p: string) => ['warehouseId'].includes(p))) {
        activeStep.value = 1;
      } else if (errorPaths.some((p: string) => p.startsWith('lineItems'))) {
        activeStep.value = 2;
      } else {
        activeStep.value = 3; // Payment errors
      }
    } else if (error?.path) {
      errors.value[error.path] = error.message;
      // Set step based on single error path
      if (['supplierId', 'waybillDate'].includes(error.path)) activeStep.value = 0;
      else if (error.path === 'warehouseId') activeStep.value = 1;
      else if (error.path.startsWith('lineItems')) activeStep.value = 2;
      else activeStep.value = 3;
    }
  }
};

const steps = [
  { label: t("steps.commercialDetails") },
  { label: t("steps.warehouseDetails") },
  { label: t("steps.lineItems") },
  { label: t("steps.payment") }
];

onMounted(async () => {
  if (id.value) {
    const result = await fetchPurchaseWaybillById(id.value);
    if (result) {
      formData.value = result;
    }
  }
});
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <div class="flex items-center justify-between mb-6">
      <ScreenHeader
        title="inventory"
        subtitle="operation.transactions"
        :actionName="mode === 'create' ? 'purchaseWaybill.addpurchaseWaybill' : 'purchaseWaybill.viewpurchaseWaybill'"
        class="!mb-0"
      />
    </div>
    <BaseStepper
      v-model="activeStep"
      :steps="steps"
      :code="formData?.supplierDetails?.waybillNumber ?? ''"
    >
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
          <!-- Loading state while API data loads (edit/view mode) -->
          <div v-if="!dataReady" class="flex justify-center items-center py-20">
            <ProgressSpinner />
          </div>
          <template v-else>
            <div v-show="activeStep === 0">
              <SupplierDetails
                :supplierDetails="formData?.supplierDetails"
                :paymentTerms="formData?.paymentTerms"
                :disabled="isDisabled"
                :errors="errors"
                @update="updateSupplierData"
              />
            </div>
            <div v-show="activeStep === 1">
              <WarehouseDetails
                :warehouseDetails="formData?.warehouseDetails"
                :disabled="isDisabled"
                :errors="errors"
                @update="updateWarehouseData"
              />
            </div>
            <div v-show="activeStep === 2">
              <LineItems
                :lineItems="formData?.lineItems"
                :disabled="isDisabled"
                :errors="errors"
                @update="updateLineItemsData"
                @next="nextTab"
                @prev="previousTab"
              />
            </div>
            <div v-show="activeStep === 3">
              <Payment
                :lineItems="formData?.lineItems"
                :paymentInfo="formData?.paymentInfo"
                :paymentTerms="formData?.paymentTerms"
                :notes="formData?.notes"
                :disabled="isDisabled"
                :errors="errors"
                @update="updatePaymentData"
                @prev="previousTab"
                @submit="submit"
              />
            </div>
          </template>
        </template>
      </Card>
      <StepperActions
        v-if="mode !== 'view'"
        :current="activeStep"
        :total="steps.length"
       
        :finishText="mode === 'edit' ? t('button.update') : t('button.create')"
        @next="nextTab"
        @previous="previousTab"
        @finish="submit"
      />
    </BaseStepper>
  </div>
</template>

<style scoped></style>