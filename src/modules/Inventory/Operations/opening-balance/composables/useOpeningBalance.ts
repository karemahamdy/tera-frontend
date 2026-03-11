import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { OpeningBalance } from "../types/OpeningBalance";
import { OpeningBalanceService } from "../services/OpeningBalance.service";
import { useForm } from "vee-validate";
import { OpeningBalanceSchema } from "../validation/OpeningBalanceSchema";
import router from "@/app/router";
import { FileService } from "@/app/services/file.service";
import { formatDate } from "@/app/utils/dates";

const { handleSubmit, errors, defineField, resetForm, setValues } = useForm({
  validationSchema: OpeningBalanceSchema,
});

const [itemId] = defineField("itemId");
const [warehouseId] = defineField("warehouseId");
const [warehouseName] = defineField("warehouseName");
const [locationId] = defineField("locationId");
const [date] = defineField("date");
const [uomId] = defineField("uomId");
const [code] = defineField("code");
const [unitCost] = defineField("unitCost");
const [quantity] = defineField("quantity");
const [notes] = defineField("notes");
const [serials] = defineField("serials");

const itemName = ref<string>("");
const isSerial = ref<boolean>(false);
const locationName = ref<null | string>(null);

export function useOpeningBalance() {
  const { t } = useI18n();
  const loading = ref(false);
  const apiOpeningBalance = ref<OpeningBalance[]>([]);
  const tableData = ref<any[]>([]);

  const pageIndex = ref(1);
  const pageSize = ref(10);
  const totalCount = ref(0);
  const totalPages = ref(1);

  const searchTerm = ref("");
  const orderBy = ref("");
  const WarehouseFilter = ref<string | null>(null);
  const UoM = ref<string | null>(null);
  const orderDirection = ref<"asc" | "desc">("desc");

  const fetchOpeningBalance = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await OpeningBalanceService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        WarehouseFilter: WarehouseFilter.value,
        UoM: UoM.value,
      });
      const payload = response && response.data ? response.data : response;
      apiOpeningBalance.value = payload.items ?? [];
      pageIndex.value = payload.pageIndex ?? page;
      pageSize.value = payload.pageSize ?? pageSize.value;
      totalCount.value = payload.totalCount ?? 0;
      totalPages.value = payload.totalPages ?? 1;
    } catch (err: any) {
      toastService.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchOpeningBalanceById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await OpeningBalanceService.getById(id);
      resp.date = new Date(resp.date);
      setValues(resp);
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createOpeningBalance = async (payload: any) => {
    payload.date = formatDate(payload.date as Date)
    loading.value = true;
    try {
      await OpeningBalanceService.create(payload);
      toastService.success(
        t("OpeningBalance.OpeningBalanceCreatedSuccessfully"),
      );
      router.replace({ name: "OpeningBalance" });
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateOpeningBalance = async (id: string, payload: any) => {
    loading.value = true;
    payload.date = formatDate(payload.date as Date)
    try {
      await OpeningBalanceService.update(id, payload);
      toastService.success(
        t("OpeningBalance.OpeningBalanceUpdatedSuccessfully"),
      );
      router.replace({ name: "OpeningBalance" });
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteOpeningBalance = async (id: string) => {
    loading.value = true;
    try {
      await OpeningBalanceService.delete(id);
      toastService.success(
        t("OpeningBalance.OpeningBalanceDeletedSuccessfully"),
      );
      if (apiOpeningBalance.value.length === 1 && pageIndex.value > 1) {
        await fetchOpeningBalance(pageIndex.value - 1);
      } else {
        await fetchOpeningBalance(pageIndex.value);
      }
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    loading.value = true;
    try {
      await OpeningBalanceService.toggleActive(id, isActive);
      toastService.success(
        t("OpeningBalance.OpeningBalanceUpdatedSuccessfully"),
      );
      await fetchOpeningBalance(pageIndex.value);
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const onFilterChange = (filter: {
    filter: { field: string };
    value: string;
  }) => {
    const field = filter.filter.field;
    const value = filter.value;
    if (field === "WarehouseFilter") {
      WarehouseFilter.value = value;
    } else if (field === "UoM") {
      UoM.value = value;
    }
    fetchOpeningBalance(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchOpeningBalance(1);
  };

  const onSort = (orderByField: string, direction: "asc" | "desc") => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchOpeningBalance(1);
  };

  const resetFormToInitialValues = () => {
    resetForm();
    itemName.value = "";
    isSerial.value = false;
    warehouseName.value = null;
    locationName.value = null;
  };

  const exportTemplate = async () => {
    try {
      const blob = await OpeningBalanceService.downloadImportTemplate();
      FileService.downloadBlob(blob, "SerialImportTemplate.xlsx");
    } catch (error) {
      toastService.error(error as string);
    }
  };

  return {
    loading,
    apiOpeningBalance,
    tableData,
    fetchOpeningBalance,
    fetchOpeningBalanceById,
    createOpeningBalance,
    updateOpeningBalance,
    deleteOpeningBalance,
    toggleActive,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchOpeningBalance(p),
    onSearch,
    onFilterChange,
    onSort,
    exportTemplate,
    resetFormToInitialValues,
    handleSubmit,
    errors,
    itemId,
    warehouseId,
    locationId,
    date,
    uomId,
    code,
    unitCost,
    quantity,
    notes,
    serials,
    itemName,
    isSerial,
    warehouseName,
    locationName,
  };
}
