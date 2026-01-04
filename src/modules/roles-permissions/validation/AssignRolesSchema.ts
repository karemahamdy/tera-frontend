import * as yup from "yup";

export const assignRolesSchema = yup.object({
  name: yup
    .string()
    .required("this field is required")
    .min(3, "Minimum 3 characters"),
    
  groupAccessScope: yup
    .string()
    .oneOf(["global", "branch"])
    .required("Access scope is required"),
});
