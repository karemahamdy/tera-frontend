import * as yup from "yup";

export const assignRolesSchema = yup.object({
  name: yup
    .string()
    .required("User group is required")
    .min(3, "Minimum 3 characters"),

  role: yup
    .object({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .nullable()
    .required("Role is required"),

  accessScope: yup
    .string()
    .oneOf(["global", "branch"])
    .required("Access scope is required"),

  roles: yup
    .object({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .nullable()
    .required("At least one role must be selected"),
});
