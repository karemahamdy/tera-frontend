import * as yup from "yup";

const mainSchema = {
  fullName: yup.string().required("form.fieldRequired").min(3, "form.min_3"),

  userName: yup.string().required("form.fieldRequired"),

  email: yup.string().nullable().email("form.invalidEmail"),

  internalID: yup.string().nullable(),

  
  departmentID: yup.string().nullable(),
  
  groupId: yup.string().nullable(),
  
  isAdmin: yup.boolean().nullable(),
  isActive: yup.boolean().nullable(),

}
export const userSchema = yup.object({
  ...mainSchema,
  password: yup.string().required("form.fieldRequired").min(6),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "form.passwordsMustMatch"),
});


export const userEditSchema = yup.object({
  ...mainSchema,
});
