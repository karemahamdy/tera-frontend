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
    .moreThan(0, "form.mustBeGreaterThanZero"),

  overheadPercentage: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("form.mustBeNumber")
    .required("form.fieldRequired")
    .min(0, "form.minZero")
    .max(100, "form.maxHundred"),
});