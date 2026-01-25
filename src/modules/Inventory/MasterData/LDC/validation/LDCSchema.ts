import * as yup from "yup";

export const LDCSchema = yup.object({
  LDCNameEn: yup
    .string()
    .required("form.fieldRequired")
    .min(3, "form.min_3"),
     LDCNameAr: yup
    .string()
    .required("form.fieldRequired")
    .min(3, "form.min_3"),
 code: yup
    .string()
    .required("form.fieldRequired")
    .min(1, "form.min_1"),
  description: yup
    .string()
    .nullable()
    .max(255, "form.max_255"),
});
