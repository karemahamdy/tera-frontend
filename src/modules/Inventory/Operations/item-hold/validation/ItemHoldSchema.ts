import * as yup from "yup";

export const ItemHoldSchema = yup.object({
  itemId: yup.string().required("form.fieldRequired"),
  warehouseId: yup.string().required("form.fieldRequired"),
  holdQuantity: yup.number().required("form.fieldRequired").min(1, "form.min_1"),
  reason: yup.string().nullable(),
  holdDate: yup.date().required("form.fieldRequired"),
  itemHoldStatus: yup.string().required("form.fieldRequired"),
  serialsForBlocking: yup.array().of(yup.string()).nullable(),
});
