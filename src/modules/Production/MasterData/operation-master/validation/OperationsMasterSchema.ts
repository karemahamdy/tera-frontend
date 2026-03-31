import * as yup from "yup";

export const OperationsMasterSchema = yup.object({
  processCode: yup
    .string()
    .required("form.fieldRequired"),

  processName: yup
    .string()
    .required("form.fieldRequired"),

  laborCostPerHour: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("form.mustBeNumber")
    .required("form.fieldRequired")
    .moreThan(-1, "form.mustBeGreaterThanZero"),

  overheadPercentage: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    )
    .nullable()
    .notRequired()
    .typeError("form.mustBeNumber")
    .min(0, "form.minZero")
    .max(100, "form.maxHundred"),
});