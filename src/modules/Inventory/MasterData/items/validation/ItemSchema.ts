import * as yup from "yup";

export const itemSchema = yup.object({
  itemName: yup.string().required("form.fieldRequired").min(3, "form.min_3"),
  code: yup.string().required("form.fieldRequired"),
  description: yup.string().nullable(),
  isActive: yup.boolean().nullable(),
});
