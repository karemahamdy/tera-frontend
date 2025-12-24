import * as yup from "yup";

export const branchFormSchema = yup.object({
  branchName: yup
    .string()
    .required("Branch name is required")
    .min(3, "Branch name must be at least 3 characters"),

  address: yup
    .string()
    .required("Address is required")
    .min(10, "Address must be at least 10 characters"),

  branchCode: yup
    .string()
    .required("Branch code is required"),

  isActive: yup
    .boolean()
    .required("Branch status is required"),
});
