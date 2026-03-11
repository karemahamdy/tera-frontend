import * as yup from "yup";

export const WarehouseTransactionSchema = yup.object({
    warehouseId: yup.string().required("form.fieldRequired"),
    destinationWarehouseId: yup
        .string()
        .nullable()
        .when("direction", {
            is: "Transfer",
            then: (schema) => schema.required("form.fieldRequired"),
            otherwise: (schema) => schema.nullable(),
        }),
});
