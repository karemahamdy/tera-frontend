import * as yup from "yup";

export const userSchema = yup.object({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(3, "Minimum 3 characters"),

  username: yup
    .string()
    .required("Username is required"),

  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email"),

  internalId: yup
    .string()
    .required("Internal ID is required"),

  password: yup
    .string()
    .when("id", {
      is: (id: string | null) => !id,
      then: (schema) =>
        schema.required("Password is required").min(6),
      otherwise: (schema) => schema.notRequired(),
    }),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match"),

  department: yup
    .object()
    .nullable()
    .required("Department is required"),

  group: yup
    .object()
    .nullable()
    .required("User group is required"),

  isAdmin: yup.boolean(),
  isActive: yup.boolean(),
});
