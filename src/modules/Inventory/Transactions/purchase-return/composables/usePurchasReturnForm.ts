import { toastService } from "@/app/services/toastService";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { PurchaseReturnForm, Item } from "../types/PurchaseReturn";
import { PurchaseReturnService } from "../services/PurchaseReturn.service";
import { useRoute } from "vue-router";
import type { Unit } from "../types/PurchaseReturn";
import { formatDate } from "@/app/utils/dates";

import { PurchaseReturnSchema } from "../validation/PurchaseReturnSchema";
import router from "@/app/router";

import { useLookups } from "@/composables/useLookups";
import { useInventoryLookups } from "@/composables/useInventoryLookups";
const {
  supplierLookups,
  WarehouseLookups,
  itemsLookups,
  WarehouseHierarchyLookups,
  getSupplierLookups,
  getWarehouseLookups,
  getItemsLookups,
  getWarehouseHierarchyLookups,
  getInventoryLookupsPurchaseWaybillsItems,
  purchaseWaybillsItems,
} = useInventoryLookups();

const { getReasonLookups, reasonsLookups } = useLookups();

import { useForm } from "vee-validate";
const { handleSubmit, errors, defineField, resetForm, setValues } =
  useForm<PurchaseReturnForm>({
    validationSchema: PurchaseReturnSchema,
    initialValues: {
      originalWaybillIds: [],
      lineItems: [],
    },
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
// line items
const [lineItems] = defineField("lineItems");
const totalUnits = computed(() => {
  return lineItems.value.reduce(
    (sum: number, item: Item) => sum + item.quantity,
    0,
  );
});

const zones = ref<any[] | null>(null);
const isView = ref<boolean>(false);

export function usePurchaseReturnForm() {
  const { t } = useI18n();
  const loading = ref(false);
  const route = useRoute();
  const id = route.params.id ? String(route.params.id) : null;

  const getItemInfo = (id: string) => {
    const item = itemsLookups.value.find((i) => i.id === id);
    if (item) {
      return {
        itemCode: item.code,
        itemName: item.name,
        trackingType: item.trackingType,
        units: item.units?.map((unit: Unit) => ({
          label: unit.unitName,
          value: unit.unitId,
        })),
      };
    }
    return {};
  };

  const fetchPurchaseReturnById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await PurchaseReturnService.getById(id);
      resp.returnHeader.returnDate = new Date(resp.returnHeader.returnDate);
      await setValues({
        ...resp.returnHeader,
        lineItems: resp.lineItems.map((item: any) => ({
          ...item,
          ...getItemInfo(item?.itemId as string),
        })),
      });
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const getFormPayload = (payload: PurchaseReturnForm) => {
    return {
      returnHeader: {
        documentNumber: payload.documentNumber,
        originalWaybillIds: payload.originalWaybillIds,
        supplierId: payload.supplierId,
        returnDate: formatDate(payload.returnDate as Date),
        returnReason: payload.returnReason,
        otherReason: payload.otherReason,
        warehouseId: payload.warehouseId,
        zoneId: payload.zoneId,
      },
      lineItems: payload.lineItems,
      notes: {
        returnNotes: payload.otherReason,
      },
    };
  };
  const createReturn = async (payload: PurchaseReturnForm) => {
    loading.value = true;
    try {
      const createPayload = getFormPayload(payload);
      const response = await PurchaseReturnService.create(createPayload);
      toastService.success(
        t("purchaseReturn.PurchaseReturnCreatedSuccessfully"),
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

  const updateReturn = async (id: string, payload: PurchaseReturnForm) => {
    loading.value = true;
    try {
      const updatePayload = getFormPayload(payload);
      await PurchaseReturnService.update(id, updatePayload);
      toastService.success(
        t("purchaseReturn.PurchaseReturnUpdatedSuccessfully"),
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
    resetFormToInitialValues();
    if (id) {
      fetchPurchaseReturnById(id);
    } else {
      fetchPurchaseReturnNextNumber();
    }
  };

  const fetchLookupsData = async () => {
    await Promise.all([
      getReasonLookups(),
      getSupplierLookups(),
      getWarehouseLookups(),
      getItemsLookups(),
      getWarehouseHierarchyLookups(),
    ]);
  };

  const getWarehouseName = (id: string = warehouseId.value) => {
    const wh = WarehouseLookups.value.find((w) => w.value === id);
    return wh?.label;
  };

  const getLocationName = (WarehouseID: string, LocationID: string) => {
    const wh = WarehouseHierarchyLookups.value.find(
      (w) => w.warehouseId === WarehouseID,
    );
    if (wh) {
      const loc = wh.locations.find((l: any) => l.locationId === LocationID);
      if (loc) return `${loc.zoneName} - ${loc.locationCode}`;
    }
    return "";
  };

  const getZoneName = (WarehouseID: string, ZoneID: string) => {
    const wh = WarehouseHierarchyLookups.value.find(
      (w) => w.warehouseId === WarehouseID,
    );

    if (wh) {
      const loc = wh.locations.find((l: any) => l.zoneId === ZoneID);
      if (loc) return loc.zoneName;
    }
    return "";
  };

  const getOriginalWaybillItems = async () => {
    if (originalWaybillIds.value?.length > 0) {
      await getInventoryLookupsPurchaseWaybillsItems(originalWaybillIds.value);

      const originalWaybillItems =
        purchaseWaybillsItems.value?.map((item) => ({
          itemId: item.id,
          itemName: item.name,
          itemCode: item.code,
          unitId: item.unitId,
          documentNumber: item.docNumber,
          quantity: item.purchasedQuantity,
          purchased: item.purchasedQuantity,
          warehouseId: item.warehouseId,
          zoneId: item.zoneId,
          unitPrice: item.unitPrice,
          locationId: getLocationName(item.warehouseId, item.locationId),
          sourceLineId: item.lineId,
          originalWaybillId: item.waybillId,
          trackingType: item.trackingType,
          units:
            item?.units.map((unit: Unit) => ({
              label: `${unit.unitName} (${unit.unitCode})`,
              value: unit.unitId,
            })) || [],
          serials:
            item?.itemSerialDtos.map((serial: any) => ({
              ...serial,
              qty:
                serial.qty || serial.quantity || serial.availableQuantity || 0,
              quantity:
                serial.qty || serial.quantity || serial.availableQuantity || 0,
            })) || [],
        })) || [];

      lineItems.value = lineItems.value.filter((item) => !item.documentNumber);
      lineItems.value = [...lineItems.value, ...originalWaybillItems];
    }
  };

  return {
    loading,
    isView,
    fetchPurchaseReturnById,
    createReturn,
    updateReturn,
    resetFormToInitialValues,
    initializeForm,
    getWarehouseName,
    getLocationName,
    getZoneName,
    getOriginalWaybillItems,
    reasonsLookups,
    supplierLookups,
    WarehouseLookups,
    itemsLookups,
    WarehouseHierarchyLookups,
    fetchLookupsData,
    handleSubmit,
    id,
    errors,
    zones,
    // returnHeader payload
    documentNumber,
    originalWaybillIds,
    supplierId,
    returnDate,
    returnReason,
    otherReason,
    warehouseId,
    zoneId,

    // line items
    lineItems,
    totalUnits,
  };
}
