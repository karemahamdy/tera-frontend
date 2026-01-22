import * as yup from "yup";

export const warehousesSchema = yup.object({
  itemGroupNameEn: yup
    .string()
    .required("form.fieldRequired")
    .min(3, "form.min_3"),
  itemGroupNameAr: yup
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
  zones: yup.array().nullable(),
  // Adding these to match form fields if they differ from itemGroupName
  warehousesNameEn: yup.string().optional(),
  warehousesNameAr: yup.string().optional(),
});
