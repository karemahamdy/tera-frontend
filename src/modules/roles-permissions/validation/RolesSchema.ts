import * as yup from "yup";

export const roleSchema = yup.object({
  name: yup
    .string()
    .required("Role name is required")
    .min(3, "Minimum 3 characters"),

  description: yup
    .string()
    .nullable()
    .max(255, "Maximum 255 characters"),
});
