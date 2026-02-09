import { useForm } from "vee-validate";
import { itemSchema } from "../validation/ItemSchema";
import { ref } from "vue";
import { ItemService } from "../services/item.service";
import { toastService } from "@/app/services/toastService";
import { useI18n } from "vue-i18n";
import type { Item, ItemFiles } from "../types/Item";
import router from "@/app/router";
import { useRoute } from "vue-router";

const files = ref<File[]>([]);
const oldFiles = ref<ItemFiles[]>([]);
const deletedFileIds = ref<string[]>([]);

const { handleSubmit, errors, defineField, setValues, resetForm } = useForm({
  validationSchema: itemSchema,
  initialValues: {
    code: "",
    name: "",
    nameAr: "",
    codeHS: "",
    description: "",
    accessScope: "",
    branchID: "",
    productionCode: "",
    productionName: "",
    warehouseID: "",
    categoryID: "",
    itemGroup1ID: "",
    itemGroup2ID: "",
    itemGroup3ID: "",
    itemGroup4ID: "",
    itemTypeID: "",
    manufacturerID: "",
    manufacturerPartNumber: "",
    barcodeSKU: "",
    baseUOM: "", // uom fields
    rules: [{ toUnitId: 1, factor: 0 }],
    tracking: "", // tracking fields
    autoGenerate: false,
    initialSerial: "",
    reorderPoint: 0,
    reorderQuantity: 0,
    maximumStockLevel: 0,
    leadTimeDays: 0,
    shelfLifeDays: 0,
    defaultCurrencyID: "", // pricing fields
    taxesID: "",
    multipleCurrency: false,
    standardCost: 0,
    salesPrice: 0,
    lastPurchasePrice: 0,
    lastMovingAverage: 0,
    ledgerDetailCardID: "", // ledger fields
    costCenterID: "",
  },
});

// basic info fields
const [code] = defineField("code");
const [name] = defineField("name");
const [nameAr] = defineField("nameAr");
const [codeHS] = defineField("codeHS");
const [description] = defineField("description");
const [accessScope] = defineField("accessScope");
const [branchID] = defineField("branchID");
const [productionCode] = defineField("productionCode");
const [productionName] = defineField("productionName");
const [warehouseID] = defineField("warehouseID");
const [categoryID] = defineField("categoryID");
const [itemGroup1ID] = defineField("itemGroup1ID");
const [itemGroup2ID] = defineField("itemGroup2ID");
const [itemGroup3ID] = defineField("itemGroup3ID");
const [itemGroup4ID] = defineField("itemGroup4ID");
const [itemTypeID] = defineField("itemTypeID");
const [manufacturerID] = defineField("manufacturerID");
const [manufacturerPartNumber] = defineField("manufacturerPartNumber");
const [barcodeSKU] = defineField("barcodeSKU");
// uom fields
const [baseUOM] = defineField("baseUOM");
const [rules] = defineField("rules");
// tracking fields
const [tracking] = defineField("tracking");
const [autoGenerate] = defineField("autoGenerate");
const [initialSerial] = defineField("initialSerial");
const [reorderPoint] = defineField("reorderPoint");
const [reorderQuantity] = defineField("reorderQuantity");
const [maximumStockLevel] = defineField("maximumStockLevel");
const [leadTimeDays] = defineField("leadTimeDays");
const [shelfLifeDays] = defineField("shelfLifeDays");
// pricing fields
const [defaultCurrencyID] = defineField("defaultCurrencyID");
const [taxesID] = defineField("taxesID");
const [multipleCurrency] = defineField("multipleCurrency");
const [standardCost] = defineField("standardCost");
const [salesPrice] = defineField("salesPrice");
const [lastPurchasePrice] = defineField("lastPurchasePrice");
const [lastMovingAverage] = defineField("lastMovingAverage");
// ledger fields
const [ledgerDetailCardID] = defineField("ledgerDetailCardID");
const [costCenterID] = defineField("costCenterID");

export function useItems() {
  const route = useRoute();
  const id = route.params.id ? String(route.params.id) : null;
  const { t } = useI18n();

  // functions to manage rules
  const addNewRule = () => {
    rules.value.push({
      toUnitId: rules.value.length + 1,
      factor: 0,
    });
  };
  const deleteRule = (index: number) => {
    rules.value.splice(index, 1);
  };

  const editRule = (index: number) => {
    rules.value[index] = { toUnitId: -1, factor: 0 };
  };

  const handleSubmitWrapper = handleSubmit(async (values) => {
    try {
      let data: Item = {
        nameEn: values.name, // NameEn *
        nameAr: values.nameAr, // NameAr
        code: values.code, // Code *
        description: values.description, // Description
        accessScope: values.accessScope, // AccessScope
        branchId: values.branchID, // BranchId
        productionName: values.productionName, // ProductionName
        productionCode: values.productionCode, // ProductionCode
        hsCode: values.codeHS, // HsCode
        wareHouseId: values.warehouseID, // WareHouseId
        itemGroupId1: values.itemGroup1ID, // ItemGroupId1
        itemGroupId2: values.itemGroup2ID, // ItemGroupId2
        itemGroupId3: values.itemGroup3ID, // ItemGroupId3
        itemGroupId4: values.itemGroup4ID, // ItemGroupId4
        categoryId: values.categoryID, // CategoryId
        itemType: values.itemTypeID, // ItemType
        manufacturerId: values.manufacturerID, // ManufacturerId
        barcode: values.barcodeSKU, // Barcode
        manufacturerPartNumber: values.manufacturerPartNumber, // ManufacturerPartNumber
        tracked: values.tracking == "serialTracking" ? true : false, // Tracked
        autoGenerateSerial: values.autoGenerate, // AutoGenerateSerial
        initialSerial: values.initialSerial, // InitialSerial
        reorderPoint: values.reorderPoint, // ReorderPoint
        reorderQuantity: values.reorderQuantity, // ReorderQuantity
        maximumStockLevel: values.maximumStockLevel, // MaximumStockLevel
        leadTime: values.leadTimeDays, // LeadTime
        shelfLife: values.shelfLifeDays, // ShelfLife
        standardCost: values.standardCost, // StandardCost
        salesPrice: values.salesPrice, // SalesPrice
        lastPurchasePrice: values.lastPurchasePrice, // LastPurchasePrice
        lastMovingPrice: values.lastMovingAverage, // LastMovingAverage
        multipleCurrency: values.multipleCurrency, // MultipleCurrency
        defaultCurrencyId: values.defaultCurrencyID, // DefaultCurrencyId
        taxId: values.taxesID, // TaxId
        ldcId: values.ledgerDetailCardID, // LDCId
        baseUnitId: values.baseUOM, // BaseUnitId
        costCenterId: values.costCenterID, // CostCenterId
        itemUnitConversions: values.rules, // ItemUnitConversions
      };
      if (id) {
        if (files.value && files.value.length > 0) {
          data.newFiles = files.value;
        }
        if (deletedFileIds.value && deletedFileIds.value.length > 0) {
          data.deletedFileIds = deletedFileIds.value;
        }
        await ItemService.update(id, data);
        toastService.success(t("items.itemUpdatedSuccessfully"));
      } else {
        if (files.value && files.value.length > 0) {
          data.formFiles = files.value;
        }
        await ItemService.create(data);
        toastService.success(t("items.itemCreatedSuccessfully"));
      }
      router.replace({ name: "ItemList" });
    } catch (error) {
      toastService.error(error as string);
    }
  });

  const loadItem = async () => {
    if (id) {
      try {
        resetFormToInitialValues()
        const data = await ItemService.getById(id);
        setValues({
          code: data.code,
          name: data.nameEn,
          nameAr: data.nameAr,
          codeHS: data.hsCode,
          description: data.description,
          accessScope: data.accessScope,
          branchID: data.branchId,
          productionCode: data.productionCode,
          productionName: data.productionName,
          warehouseID: data.wareHouseId,
          categoryID: data.categoryId,
          itemGroup1ID: data.group1Id,
          itemGroup2ID: data.group2Id,
          itemGroup3ID: data.group3Id,
          itemGroup4ID: data.group4Id,
          itemTypeID: data.itemType,
          manufacturerID: data.manufacturerId,
          manufacturerPartNumber: data.manufacturerPartNumber,
          barcodeSKU: data.barcode,
          baseUOM: data.baseUnitId,
          tracking: data.tracked ? "serialTracking" : "noTracking",
          autoGenerate: data.autoGenerateSerial,
          initialSerial: data.initialSerial,
          reorderPoint: data.reorderPoint,
          reorderQuantity: data.reorderQuantity,
          maximumStockLevel: data.maximumStockLevel,
          leadTimeDays: data.leadTime,
          shelfLifeDays: data.shelfLife,
          defaultCurrencyID: data.defaultCurrencyId,
          taxesID: data.taxId,
          multipleCurrency: data.multipleCurrency,
          standardCost: data.standardCost,
          salesPrice: data.salesPrice,
          lastPurchasePrice: data.lastPurchasePrice,
          lastMovingAverage: data.lastMovingPrice,
          ledgerDetailCardID: data.ldcId,
          costCenterID: data.costCenterId,
        });
        setFiles(data.files || []);
        rules.value = data.itemUnitConversions as unknown as typeof rules.value;
      } catch (error) {
        toastService.error(error as string);
      }
    }
  };

  const setFiles = (fileList: ItemFiles[]) => {
    oldFiles.value = fileList;
  };

  const setDeletedFiles = (index: number) => {
    if (oldFiles.value[index]) {
      deletedFileIds.value.push(oldFiles.value[index].id);
    }
    oldFiles.value.splice(index, 1);
  };

  const resetFormToInitialValues = () => {
    resetForm();
    files.value = [];
    oldFiles.value = [];
    deletedFileIds.value = [];
  };

  return {
    errors,

    code,
    name,
    nameAr,
    codeHS,
    description,
    accessScope,
    branchID,
    productionCode,
    productionName,
    warehouseID,
    categoryID,
    itemGroup1ID,
    itemGroup2ID,
    itemGroup3ID,
    itemGroup4ID,
    itemTypeID,
    manufacturerID,
    manufacturerPartNumber,
    barcodeSKU,
    baseUOM,
    rules,
    tracking,
    autoGenerate,
    initialSerial,
    reorderPoint,
    reorderQuantity,
    maximumStockLevel,
    leadTimeDays,
    shelfLifeDays,
    defaultCurrencyID,
    taxesID,
    multipleCurrency,
    standardCost,
    salesPrice,
    lastPurchasePrice,
    lastMovingAverage,
    ledgerDetailCardID,
    costCenterID,
    files,
    oldFiles,
    addNewRule,
    deleteRule,
    editRule,
    setValues,
    handleSubmitWrapper,
    loadItem,
    resetFormToInitialValues,
    setDeletedFiles
  };
}
