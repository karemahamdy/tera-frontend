import * as yup from "yup";

export const CustomerSchema = yup.object({
  customerId: yup
    .string()
    .nullable()
    .required("Customer is required"),

  waybillDate: yup
    .date()
    .nullable()
    .required("Waybill Date is required"),
});

export const WarehouseSchema = yup.object({
  warehouseId: yup
    .string()
    .nullable()
    .required("Warehouse is required"),
});

export const LineItemsSchema = yup.object({
  lineItems: yup.array().of(
    yup.object({
      quantity: yup
        .number()
        .typeError("Quantity is required")
        .required("Quantity is required")
        .moreThan(0, "Quantity must be greater than 0"),

      trackingType: yup.string(),

      serials: yup.array().when("trackingType", {
        is: "Serial",
        then: (schema) =>
          schema
            .min(1, "Serial is required")
            .required("Serial is required"),
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
      then: (schema) => schema.required("Payment Terms is required"),
      otherwise: (schema) => schema.nullable(),
    }),

  purchaseType: yup
    .string()
    .nullable()
    .required("Purchase Type is required"),

  incoterm: yup
    .string()
    .nullable()
    .when("purchaseType", {
      is: (val: string) => val === "Export",
      then: (schema) => schema.required("Incoterm is required"),
      otherwise: (schema) => schema.nullable(),
    }),
});