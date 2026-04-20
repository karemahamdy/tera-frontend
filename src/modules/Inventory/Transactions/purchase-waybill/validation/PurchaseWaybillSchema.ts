import * as yup from "yup";

export const SupplierSchema = yup.object({
  supplierId: yup
    .string()
    .nullable()
    .required("form.fieldRequired"),

  waybillDate: yup
    .date()
    .nullable()
    .required("form.fieldRequired"),
});

export const WarehouseSchema = yup.object({
  warehouseId: yup
    .string()
    .nullable()
    .required("form.fieldRequired"),
});

export const LineItemsSchema = yup.object({
  lineItems: yup.array()
    .min(1, "At least one item is required")
    .required("form.fieldRequired")
    .of(
      yup.object({
        quantity: yup
          .number()
          .typeError("form.fieldRequired")
          .required("form.fieldRequired")
          .moreThan(0, "form.mustBeGreaterZero"),

        trackingType: yup.string(),

        serials: yup.array().when("trackingType", {
          is: "Serial",
          then: (schema) =>
            schema
              .min(1, "form.fieldRequired")
              .required("form.fieldRequired"),
          otherwise: (schema) => schema.nullable(),
        }),
      })
    ),
});

export const PaymentSchema = yup.object({
  paymentType: yup.string().nullable(),

  paymentTermId: yup
    .string()
    .nullable()
    .when("paymentType", {
      is: (val: string) => val === "Payable",
      then: (schema) => schema.required("form.fieldRequired"),
      otherwise: (schema) => schema.nullable(),
    }),

  purchaseType: yup
    .string()
    .nullable()
    .when("paymentType", {
      is: (val: string) => val !== "Cash",
      then: (schema) => schema.required("form.fieldRequired"),
      otherwise: (schema) => schema.nullable(),
    }),

  incoterm: yup
    .string()
    .nullable()
    .when("purchaseType", {
      is: (val: string) => val === "Import",
      then: (schema) => schema.required("form.fieldRequired"),
      otherwise: (schema) => schema.nullable(),
    }),
});