import { toastService } from "@/app/services/toastService";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { SalesReturnForm, Item, Unit } from "../types/SalesReturn";
import { SalesReturnService } from "../services/SalesReturn.service";
import { useRoute } from "vue-router";
import { formatDate } from "@/app/utils/dates";

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
  getInspectionResultsLookups,
  inspectionResultsLookups,
} = useInventoryLookups();

const { getReasonLookups, reasonsLookups } = useLookups();

import { useForm } from "vee-validate";
const { handleSubmit, errors, defineField, resetForm, setValues, validateField, validate } =
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
const isView = ref<boolean>(false);

export function useSalesReturnForm() {
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
      const resp = await SalesReturnService.getById(id);
      resp.returnHeader.returnDate = new Date(resp.returnHeader.returnDate);
      if (resp.inspection?.inspectionDate) {
        resp.inspection.inspectionDate = new Date(
          resp.inspection.inspectionDate,
        );
      }
      await setValues({
        ...resp.returnHeader,
        lineItems: resp.lineItems.map((item: any) => ({
          ...item,
          locationName: getLocationName(item.warehouseId, item.locationId),
          ...getItemInfo(item?.itemId as string),
        })),
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
        customerId: payload.customerId,
        returnDate: formatDate(payload.returnDate as Date),
        returnReason: payload.returnReason,
        otherReason: payload.otherReason,
        warehouseId: payload.warehouseId,
        zoneId: payload.zoneId,
      },
      lineItems: payload.lineItems,
      inspection: {
        inspector: payload.inspector,
        inspectionDate: formatDate(new Date(payload.inspectionDate)),
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
      toastService.success(t("SalesReturn.SalesReturnCreatedSuccessfully"));
      router.push({ name: "SalesReturn" });
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
      router.push({ name: "SalesReturn" });
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
      getCustomerLookups(),
      getWarehouseLookups(),
      getItemsLookups(),
      getWarehouseHierarchyLookups(),
      getInspectionResultsLookups(),
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
          locationId: item.locationId,
          unitPrice: item.unitPrice,
          locationName: getLocationName(item.warehouseId, item.locationId),
          sourceLineId: item.lineId,
          originalWaybillId: item.waybillId,
          trackingType: item.trackingType,
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
    customerLookups,
    WarehouseLookups,
    itemsLookups,
    WarehouseHierarchyLookups,
    fetchLookupsData,
    inspectionResultsLookups,
    handleSubmit,
    id,
    errors,
    zones,
    validateField,
    validate,
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
