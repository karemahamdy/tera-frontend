import * as yup from "yup";

export const assignRolesSchema = yup.object({
  name: yup.string().required("form.fieldRequired").min(3, "form.min_3"),

  role: yup.array().of(yup.string()).min(1, "form.fieldRequired").required("form.fieldRequired"),

  accessScope: yup
    .string()
    .oneOf(["global", "branch"])
    .required("form.fieldRequired"),

  branchIds: yup
    .array()
    .of(yup.string())
    .when("accessScope", {
      is: "branch",
      then: (schema) => schema.min(1, "form.fieldRequired").required("form.fieldRequired"),
      otherwise: (schema) => schema.notRequired(),
    }),
});
