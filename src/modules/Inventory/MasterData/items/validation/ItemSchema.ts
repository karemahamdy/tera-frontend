import * as yup from "yup";

export const itemSchema = yup.object({
  code: yup.string().required("form.fieldRequired"),
  name: yup.string().required("form.fieldRequired"),
  nameAr: yup.string().nullable(),
  codeHS: yup.string().nullable(),
  description: yup.string().nullable(),
  accessScope: yup.string().required("form.fieldRequired"),
  branchID: yup
    .string()
    .nullable()
    .when("accessScope", {
      is: "BranchLimited",
      then: (schema) => schema.required("form.fieldRequired"),
      otherwise: (schema) => schema.nullable(),
    }),
  productionCode: yup.string().nullable(),
  productionName: yup.string().nullable(),
  warehouseID: yup.string().nullable(),
  categoryID: yup.string().nullable(),
  itemGroup1ID: yup.string().nullable(),
  itemGroup2ID: yup.string().nullable(),
  itemGroup3ID: yup.string().nullable(),
  itemGroup4ID: yup.string().nullable(),
  itemTypeID: yup.string().required("form.fieldRequired"),
  manufacturerID: yup.string().nullable(),
  manufacturerPartNumber: yup.string().nullable(),
  barcodeSKU: yup.string().nullable(),
  baseUOM: yup.string().required("form.fieldRequired"),
  rules: yup.array().of(
    yup.object({
      toUnitId: yup.string().required("form.fieldRequired"),
      factor: yup.number().nullable(),
    }),
  ),
  tracking: yup.string().nullable(),
  autoGenerate: yup.boolean().nullable(),
  initialSerial: yup.string().nullable(),
  reorderPoint: yup.number().nullable(),
  reorderQuantity: yup.number().nullable(),
  maximumStockLevel: yup.number().nullable(),
  leadTimeDays: yup.number().nullable(),
  shelfLifeDays: yup.number().nullable(),
  defaultCurrencyID: yup.string().nullable(),
  taxesID: yup.string().nullable(),
  multipleCurrency: yup.boolean().nullable(),
  standardCost: yup.number().nullable(),
  salesPrice: yup.number().nullable(),
  lastPurchasePrice: yup.number().nullable(),
  lastMovingAverage: yup.number().nullable(),
  ledgerDetailCardID: yup.string().nullable(),
  costCenterID: yup.string().nullable(),
});
