import { toastService } from "@/app/services/toastService";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { SalesReturnForm, Item, Unit } from "../types/SalesReturn";
import { SalesReturnService } from "../services/SalesReturn.service";
import { useRoute } from "vue-router";

import { SalesReturnSchema } from "../validation/SalesReturnSchema";
import router from "@/app/router";

import { useLookups } from "@/composables/useLookups";
import { useInventoryLookups } from "@/composables/useInventoryLookups";
const {
  customerLookups,
  WarehouseLookups,
  itemsLookups,
  WarehouseHierarchyLookups,
  getCustomerLookups,
  getWarehouseLookups,
  getItemsLookups,
  getWarehouseHierarchyLookups,
  getInventoryLookupsSalesWaybillsItems,
  salesWaybillsItems,
} = useInventoryLookups();

const { getReasonLookups, reasonsLookups } = useLookups();

import { useForm } from "vee-validate";
const { handleSubmit, errors, defineField, resetForm, setValues } =
  useForm<SalesReturnForm>({
    validationSchema: SalesReturnSchema,
    initialValues: {
      originalWaybillIds: [],
      lineItems: [],
    },
  });

// returnHeader payload
const [documentNumber] = defineField("documentNumber");
const [originalWaybillIds] = defineField("originalWaybillIds");
const [customerId] = defineField("customerId");
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

const [inspector] = defineField("inspector");
const [inspectionDate] = defineField("inspectionDate");
const [inspectionResult] = defineField("inspectionResult");
const [inspectionNotes] = defineField("inspectionNotes");

const zones = ref<any[] | null>(null);

export function useSalesReturnForm() {
  const { t } = useI18n();
  const loading = ref(false);
  const route = useRoute();
  const id = route.params.id ? String(route.params.id) : null;

  const fetchPurchaseReturnById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await SalesReturnService.getById(id);
      setValues({
        ...resp.returnHeader,
        lineItems: resp.lineItems,
        ...resp.inspection,
      });
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const getFormPayload = (payload: SalesReturnForm) => {
    return {
      returnHeader: {
        documentNumber: payload.documentNumber,
        originalWaybillIds: payload.originalWaybillIds,
        customerIdyy: payload.customerId,
        returnDate: payload.returnDate,
        returnReason: payload.returnReason,
        otherReason: payload.otherReason,
        warehouseId: payload.warehouseId,
        zoneId: payload.zoneId,
      },
      lineItems: payload.lineItems,
      inspection: {
        inspector: payload.inspector,
        inspectionDate: payload.inspectionDate,
        inspectionResult: payload.inspectionResult,
        inspectionNotes: payload.inspectionNotes,
      },
    };
  };
  const createReturn = async (payload: SalesReturnForm) => {
    loading.value = true;
    try {
      const createPayload = getFormPayload(payload);
      const response = await SalesReturnService.create(createPayload);
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

  const updateReturn = async (id: string, payload: SalesReturnForm) => {
    loading.value = true;
    try {
      const updatePayload = getFormPayload(payload);
      await SalesReturnService.update(id, updatePayload);
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
      const resp = await SalesReturnService.getNextNumber();
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

  const fetchLookupsData = async () => {
    Promise.all([
      getReasonLookups(),
      getCustomerLookups(),
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
      await getInventoryLookupsSalesWaybillsItems(originalWaybillIds.value);

      const originalWaybillItems: Item[] =
        salesWaybillsItems.value?.map((item) => ({
          itemId: item.itemId,
          itemName: item.itemName,
          itemCode: item.itemCode,
          unitId: item.unitId,
          documentNumber: item.waybillDocumentNumber,
          quantity: item.alreadyReturnedQuantity,
          shipped: item.shippedQuantity,
          warehouseId: item.warehouseId,
          zoneId: item.zoneId,
          locationId: getLocationName(item.warehouseId, item.locationId),
          sourceLineId: item.lineId,
          originalWaybillId: item.waybillId,
          trackingType: item.isSerialTracked ? "Serial" : "None",
          units:
            item?.units?.map((unit: Unit) => ({
              label: `${unit.unitName} (${unit.unitCode})`,
              value: unit.unitId,
            })) || [],
          serials:
            item?.itemSerialDtos?.map((serial: any) => ({
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
    customerLookups,
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
    customerId,
    returnDate,
    returnReason,
    otherReason,
    warehouseId,
    zoneId,

    // line items
    lineItems,
    totalUnits,

    // inspection
    inspector,
    inspectionDate,
    inspectionResult,
    inspectionNotes,
  };
}
