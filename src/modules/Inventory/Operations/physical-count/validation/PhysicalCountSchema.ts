import * as yup from "yup";

export const SalesReturnSchema = yup.object({
  // returnHeader payload example
  documentNumber: yup.string().required("form.fieldRequired"),
  originalWaybillIds: yup.array().of(yup.string()).nullable(),
  customerId: yup.string().required("form.fieldRequired"),
  returnDate: yup.date().required("form.fieldRequired"),
  returnReason: yup.string().required("form.fieldRequired"),
  otherReason: yup.string().nullable(),
  warehouseId: yup.string().required("form.fieldRequired"),
  zoneId: yup.string().nullable(),
  // line Items
  lineItems: yup
    .array()
    .of(yup.object({}))
    .min(1, "form.fieldRequired")
    .required("form.fieldRequired"),
  // inspection
  inspector: yup.string().required("form.fieldRequired"),
  inspectionDate: yup.string().required("form.fieldRequired"),
  inspectionResult: yup.string().required("form.fieldRequired"),
  inspectionNotes: yup.string().nullable(),
});
