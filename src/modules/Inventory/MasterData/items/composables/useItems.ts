import { useForm } from "vee-validate";
import { itemSchema } from "../validation/ItemSchema";
import { ref } from "vue";

const files = ref<File[]>([]);

const { handleSubmit, errors, defineField, setValues } = useForm({
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
    rules: [{ id: 1, name: "", quantity: 0 }],
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

  // functions to manage rules
  const addNewRule = () => {
    rules.value.push({
      id: rules.value.length + 1,
      name: "",
      quantity: 0,
    });
  };
  const deleteRule = (index: number) => {
    rules.value.splice(index, 1);
  };

  const handleSubmitWrapper = handleSubmit((values) => {
    console.log("Form Submitted with values:", values);
    console.log("Uploaded Files:", files.value);
    let data = {
      NameEn: values.name,  // NameEn *
      NameAr: values.nameAr,  // NameAr
      Code: values.code,  // Code *
      Description: values.description,  // Description
      AccessScope: values.accessScope,  // AccessScope
      BranchId: values.branchID,  // BranchId
      ProductionName: values.productionName,  // ProductionName
      ProductionCode: values.productionCode,  // ProductionCode
      HsCode: values.codeHS,  // HsCode
      WareHouseId: values.warehouseID,  // WareHouseId
      ItemGroupId1: values.itemGroup1ID,  // ItemGroupId1
      ItemGroupId2: values.itemGroup2ID,  // ItemGroupId2
      ItemGroupId3: values.itemGroup3ID,  // ItemGroupId3
      ItemGroupId4: values.itemGroup4ID,  // ItemGroupId4
      CategoryId: values.categoryID,  // CategoryId
      ItemType: values.itemTypeID,  // ItemType
      ManufacturerId: values.manufacturerID,  // ManufacturerId
      Barcode: values.barcodeSKU,  // Barcode
      ManufacturerPartNumber: values.manufacturerPartNumber,  // ManufacturerPartNumber
      Tracked: values.tracking,  // Tracked
      AutoGenerateSerial: values.autoGenerate,  // AutoGenerateSerial
      InitialSerial: values.initialSerial,  // InitialSerial
      ReorderPoint: values.reorderPoint,  // ReorderPoint
      ReorderQuantity: values.reorderQuantity,  // ReorderQuantity
      MaximumStockLevel: values.maximumStockLevel,  // MaximumStockLevel
      LeadTime: values.leadTimeDays,  // LeadTime
      ShelfLife: values.shelfLifeDays,  // ShelfLife
      StandardCost: values.standardCost,  // StandardCost
      SalesPrice: values.salesPrice,  // SalesPrice
      LastPurchasePrice: values.lastPurchasePrice,  // LastPurchasePrice
      LastMovingAverage: values.lastMovingAverage,  // LastMovingAverage
      MultipleCurrency: values.multipleCurrency,  // MultipleCurrency
      DefaultCurrencyId: values.defaultCurrencyID,  // DefaultCurrencyId
      TaxId: values.taxesID,  // TaxId
      LDCId: values.ledgerDetailCardID,  // LDCId
      BaseUnitId: values.baseUOM,  // BaseUnitId
      CostCenterId: values.costCenterID,  // CostCenterId
      FormFiles: files.value,  // FormFiles
      ItemUnitConversions: values.rules,  // ItemUnitConversions
    }
  });

  return {
    handleSubmit,
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

    addNewRule,
    deleteRule,
    setValues,
  };
}
