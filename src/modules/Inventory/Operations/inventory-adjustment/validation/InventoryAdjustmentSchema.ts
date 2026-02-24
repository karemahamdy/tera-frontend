import * as yup from "yup";

export const InventoryAdjustmentSchema = yup.object({
  adjustmentNumber: yup.string().required("form.fieldRequired"),
  adjustmentReason: yup.string().required("form.fieldRequired"),
  physicalCountHeaderIds: yup
    .array()
    .of(yup.object())
    .min(1, "form.fieldRequired")
    .required("form.fieldRequired"),
  notes: yup.string().optional().nullable(),
});
