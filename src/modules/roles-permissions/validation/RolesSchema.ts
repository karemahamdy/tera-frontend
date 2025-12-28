import * as yup from "yup";

export const roleSchema = yup.object({
  name: yup
    .string()
    .required("form.fieldRequired")
    .min(3, "form.min_3"),

  description: yup
    .string()
    .nullable()
    .max(255, "form.max_255"),
});
