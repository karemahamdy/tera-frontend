import * as yup from "yup";

export const downtimeSchema = yup.object({
  date: yup
    .date()
    .typeError("form.fieldRequired")
    .required("form.fieldRequired"),

  time: yup
    .date()
    .typeError("form.fieldRequired")
    .required("form.fieldRequired"),

  machineId: yup
    .string()
    .required("form.fieldRequired"),

  downtimeType: yup
    .string()
    .required("form.fieldRequired"),

  duration: yup
    .number()
    .typeError("form.fieldRequired")
    .required("form.fieldRequired")
    .moreThan(0, "form.Zero"),

  workOrderId: yup.string().nullable(),

  notes: yup.string().nullable(),
});