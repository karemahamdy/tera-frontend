import * as yup from "yup";

export const LDCSchema = yup.object({
  bomCode: yup.string().required("BOM code is required"),
  bomName: yup.string().required("BOM name is required"),
  parentItemId: yup.string().required("Final product is required"),
  baseQuantity: yup
    .number()
    .typeError("Quantity must be a number")
    .required()
    .moreThan(0, "Quantity must be greater than 0"),
  notes: yup.string().nullable(),
  isActive: yup.boolean(),
  version: yup.string().required(),
});
export const materialSchema = yup.array().of(
  yup.object({
    componentId: yup.string().required(),
    quantity: yup
      .number()
      .moreThan(0, "Quantity must be > 0")
      .required(),

    scrap: yup
      .number()
      .min(0, "Scrap must be ≥ 0")
      .default(0),
  })
);
export const routingSchema = yup.array().of(
  yup.object({
    sequence: yup.number().required(),

    operationId: yup
      .string()
      .required("Process is required"),

    machineId: yup
      .string()
      .required("Machine is required"),

    runTime: yup
      .number()
      .typeError("Run time must be number")
      .moreThan(0, "Run time must be > 0")
      .required(),

    setupTime: yup
      .number()
      .typeError("Setup time must be number")
      .min(0, "Setup time must be ≥ 0")
      .required(),
  })
);