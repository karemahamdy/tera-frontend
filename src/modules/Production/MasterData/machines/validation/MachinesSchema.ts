import * as yup from "yup";

export const MachinesSchema = yup.object({
  machineCode: yup.string().required("form.fieldRequired").min(3, "form.min_3"),
  machineName: yup.string().required("form.fieldRequired").min(3, "form.min_3"),
  workCenterId: yup
    .string()
    .required("form.fieldRequired")
    .min(3, "form.min_3"),

  machineCapacity: yup
    .number()
    .typeError("form.mustBeNumber")
    .required("form.fieldRequired")
    .min(-1, "form.minZero")
    .max(24, "form.max"),

  costPerHour: yup
    .number()
    .typeError("form.mustBeNumber")
    .moreThan(-1, "form.mustBeGreaterThanZero")
    .required("form.fieldRequired"),

  setupCostPerHour: yup
    .number()
    .typeError("form.mustBeNumber")
    .moreThan(-1, "form.mustBeGreaterThanZero")
    .required("form.fieldRequired"),

  setupTime: yup
    .number()
    .typeError("form.mustBeNumber")
    .moreThan(-1, "form.mustBeGreaterThanZero")
    .required("form.fieldRequired"),

  overheadPercentage: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .notRequired()
    .typeError("form.mustBeNumber")
    .min(0, "form.minZero")
    .max(100, "form.maxHundred"),

  efficiencyPercentage: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .notRequired()
    .typeError("form.mustBeNumber")
    .min(0, "form.minZero")
    .max(100, "form.maxHundred"),
});
