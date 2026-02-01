import * as yup from "yup";

export const LDCSchema = yup.object({
  nameEn: yup
    .string()
    .required("form.fieldRequired")
    .min(3, "form.min_3"),
     nameAr: yup
    .string()
    .required("form.fieldRequired")
    .min(3, "form.min_3"),
 code: yup
    .string()
    .required("form.fieldRequired")
    .min(1, "form.min_1"),
 
});
