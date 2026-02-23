import * as yup from "yup";

export const ItemTransactionsSchema = yup.object({
  transactionType: yup.string().required("form.fieldRequired"),
  sourceItem: yup.string().required("form.fieldRequired"),
  targetItem: yup.string().required("form.fieldRequired"),
  warehouseID: yup.string().nullable(),
  notes: yup.string().nullable(),
});
