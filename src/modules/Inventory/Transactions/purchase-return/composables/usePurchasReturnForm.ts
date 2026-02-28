import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { PurchaseReturnForm } from "../types/PurchaseReturn";
import { PurchaseReturnService } from "../services/PurchaseReturn.service";
import { useRoute } from "vue-router";

import { PurchaseReturnSchema } from "../validation/PurchaseReturnSchema";
import router from "@/app/router";
import { useForm } from "vee-validate";
const { handleSubmit, errors, defineField, resetForm, setValues } = useForm<PurchaseReturnForm>({
  validationSchema: PurchaseReturnSchema,
});

// returnHeader payload
const [documentNumber] = defineField("documentNumber");
const [originalWaybillIds] = defineField("originalWaybillIds");
const [supplierId] = defineField("supplierId");
const [returnDate] = defineField("returnDate");
const [returnReason] = defineField("returnReason");
const [otherReason] = defineField("otherReason");
const [warehouseId] = defineField("warehouseId");
const [zoneId] = defineField("zoneId");

export function usePurchaseReturnForm() {
  const { t } = useI18n();
  const loading = ref(false);
  const route = useRoute();
  const id = route.params.id ? String(route.params.id) : null;

  const fetchPurchaseReturnById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await PurchaseReturnService.getById(id);
      setValues(resp);
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createSalesReturn = async (payload: PurchaseReturnForm) => {
    loading.value = true;
    try {
      const response = await PurchaseReturnService.create(payload);
      toastService.success(
        t("PurchaseReturn.PurchaseReturnCreatedSuccessfully"),
      );
      router.push({ name: "PurchaseReturn" });
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateSalesReturn = async (id: string, payload: PurchaseReturnForm) => {
    loading.value = true;
    try {
      await PurchaseReturnService.update(id, payload);
      toastService.success(
        t("PurchaseReturn.PurchaseReturnUpdatedSuccessfully"),
      );
      router.push({ name: "PurchaseReturn" });
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const resetFormToInitialValues = () => {
    resetForm();
  };

  const fetchPurchaseReturnNextNumber = async () => {
    try {
      const resp = await PurchaseReturnService.getNextNumber();
      documentNumber.value = resp.documentNumber;
    } catch (err: any) {
      toastService.error(err);
      return null;
    }
  };

  const initializeForm = () => {
    if (id) {
      fetchPurchaseReturnById(id);
    } else {
      fetchPurchaseReturnNextNumber();
    }
  };
  return {
    loading,
    fetchPurchaseReturnById,
    createSalesReturn,
    updateSalesReturn,
    resetFormToInitialValues,
    initializeForm,
    handleSubmit,
    id,
    errors,
    // returnHeader payload
    documentNumber,
    originalWaybillIds,
    supplierId,
    returnDate,
    returnReason,
    otherReason,
    warehouseId,
    zoneId,
  };
}
