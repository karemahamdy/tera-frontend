import * as yup from "yup";

export const ItemTransactionsSchema = yup.object({
  mergeTransfareType: yup.string().required("form.fieldRequired"),
  sourceItemId: yup.string().required("form.fieldRequired"),
  targetItemId: yup
    .string()
    .required("form.fieldRequired")
    .notOneOf([yup.ref("sourceItemId")], "itemTransaction.sourceTargetDifferent"),
  warehouseId: yup.string().nullable(),
  notes: yup.string().nullable(),
});
