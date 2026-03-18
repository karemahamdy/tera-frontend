import * as yup from "yup";

export const SalesReturnSchema = yup.object({
  code: yup.string().required("form.fieldRequired"),
  countDate: yup.date().required("form.fieldRequired"),
  physicalCountLines: yup
    .array()
    .of(yup.object({}))
    .min(1, "form.fieldRequired")
    .required("form.fieldRequired"),
  notes: yup.string().nullable(),
});
