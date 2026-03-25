import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { ItemHold, ReleaseSerialPayload } from "../types/ItemHold";
import { ItemHoldService } from "../services/ItemHold.service";

export function useItemHoldSerial() {
  const { t } = useI18n();
  const loading = ref(false);
  const apiHoldingSerials = ref<ItemHold[]>([]);

  const pageIndex = ref(1);
  const pageSize = ref(10);
  const totalCount = ref(0);
  const totalPages = ref(1);

  const itemId = ref<string | null>(null);
  const warehouseId = ref<string | null>(null);

  const orderBy = ref("");
  const orderDirection = ref<"asc" | "desc">("desc");

  const releaseSerial = async (data: ReleaseSerialPayload) => {
    loading.value = true;
    try {
      await ItemHoldService.releaseSerial(data);
      toastService.success(t("itemHold.itemReleasedSuccessfully"));
      if (apiHoldingSerials.value.length === 1 && pageIndex.value > 1) {
        await fetchHoldingSerials(pageIndex.value - 1);
      } else {
        await fetchHoldingSerials(pageIndex.value);
      }
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchHoldingSerials = async (
    page = 1,
    ItemId: string = itemId.value as string,
    WarehouseId: string = warehouseId.value as string,
  ) => {
    loading.value = true;
    apiHoldingSerials.value = [];
    try {
      const response: any = await ItemHoldService.getHoldingSerial(
        ItemId,
        WarehouseId,
        {
          pageIndex: page,
          pageSize: pageSize.value,
          orderBy: orderBy.value,
          orderDirection: orderDirection.value,
        },
      );
      const payload = response && response.data ? response.data : response;
      apiHoldingSerials.value = payload.items ?? [];
      pageIndex.value = payload.pageIndex ?? page;
      pageSize.value = payload.pageSize ?? pageSize.value;
      totalCount.value = payload.totalCount ?? 0;
      totalPages.value = payload.totalPages ?? 1;
      itemId.value = ItemId;
      warehouseId.value = WarehouseId;
    } catch (err: any) {
      toastService.error(err);
    } finally {
      loading.value = false;
    }
  };

  const onSort = (orderByField: string, direction: "asc" | "desc") => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchHoldingSerials(1);
  };

  return {
    loading,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    onSort,
    setPage: (p: number) => fetchHoldingSerials(p),
    releaseSerial,
    fetchHoldingSerials,
    apiHoldingSerials,
  };
}
