import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { PhysicalCountForm } from "../types/PhysicalCount";
import { PhysicalCountService } from "../services/PhysicalCountservice";
import { formatDate } from "@/app/utils/dates";

import { SalesReturnSchema } from "../validation/PhysicalCountSchema";
import router from "@/app/router";

import { useInventoryLookups } from "@/composables/useInventoryLookups";
const {
  itemsLookups,
  WarehouseHierarchyLookups,
  getItemsLookups,
  getWarehouseHierarchyLookups,
} = useInventoryLookups();

import { useForm } from "vee-validate";
const { handleSubmit, errors, defineField, resetForm } =
  useForm<PhysicalCountForm>({
    validationSchema: SalesReturnSchema,
    initialValues: {
      physicalCountLines: [],
    },
  });

// returnHeader payload
const [code] = defineField("code");
const [countDate] = defineField("countDate");
const [notes] = defineField("notes");
// line items
const [physicalCountLines] = defineField("physicalCountLines");

export function usePhysicalCountForm() {
  const { t } = useI18n();
  const loading = ref(false);

  const createPhysicalCount = async (payload: PhysicalCountForm) => {
    loading.value = true;
    try {
      payload.countDate = formatDate(payload.countDate as Date) as string;
      const response = await PhysicalCountService.create(payload);
      toastService.success(t("PhysicalCount.PhysicalCountCreatedSuccessfully"));
      router.push({ name: "PhysicalCount" });
      return response;
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

  const fetchLookupsData = async () => {
    await Promise.all([getItemsLookups(), getWarehouseHierarchyLookups()]);
  };

  return {
    loading,
    createPhysicalCount,
    resetFormToInitialValues,
    fetchLookupsData,
    itemsLookups,
    WarehouseHierarchyLookups,
    handleSubmit,
    errors,

    code,
    countDate,
    notes,
    physicalCountLines,
  };
}
