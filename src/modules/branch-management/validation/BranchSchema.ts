import * as yup from "yup";

export const branchFormSchema = yup.object({
  nameAr: yup
    .string()
    .required("Branch name is required")
    .min(3, "Branch name must be at least 3 characters"),

  nameEn: yup
    .string()
    .required("Branch name is required")
    .min(3, "Branch name must be at least 3 characters"),

  addressAr: yup
    .string(),

  addressEn: yup
    .string(),

  code: yup
    .string()
    .required("Branch code is required"),

  isActive: yup
    .boolean()
    .required("Branch status is required"),
});
