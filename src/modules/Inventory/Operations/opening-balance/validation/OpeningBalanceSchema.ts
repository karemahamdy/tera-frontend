import * as yup from "yup";

export const OpeningBalanceSchema = yup.object({
  itemId: yup.string().required("form.fieldRequired"),
  warehouseId: yup.string().required("form.fieldRequired"),
  locationId: yup.string().nullable(),
  date: yup.string().required("form.fieldRequired"),
  uomId: yup.string().required("form.fieldRequired"),
  code: yup.string().required("form.fieldRequired"),
  unitCost: yup.number().required("form.fieldRequired"),
  quantity: yup.number().required("form.fieldRequired"),
  notes: yup.string().required("form.fieldRequired"),
  serials: yup.array().nullable(),
});
