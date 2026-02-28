import * as yup from "yup";

export const PurchaseReturnSchema = yup.object({
  // returnHeader payload example
  documentNumber: yup.string().required("form.fieldRequired"),
  originalWaybillIds: yup.array().required("form.fieldRequired"),
  supplierId: yup.string().required("form.fieldRequired"),
  returnDate: yup.date().required("form.fieldRequired"),
  returnReason: yup.string().required("form.fieldRequired"),
  otherReason: yup.string(),
  warehouseId: yup.string().required("form.fieldRequired"),
  zoneId: yup.string().required("form.fieldRequired"),
});
