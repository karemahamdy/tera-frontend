import * as yup from "yup";

export const WarehouseTransactionSchema = yup.object({
    warehouseId: yup.string().required("form.fieldRequired"),
    destinationWarehouseId: yup
        .string()
        .nullable()
        .when("direction", {
            is: "Transfer",
            then: (schema) => schema.required("form.fieldRequired")
                .test(
                    "not-same-warehouse-and-zone",
                    "validation.sameSourceAndDestination",
                    function (value) {
                        const { warehouseId, zoneId, destinationZoneId } = this.parent;
                        if (value && warehouseId && value === warehouseId) {
                            if (zoneId && destinationZoneId && zoneId !== destinationZoneId) return true;
                            return this.createError({ message: "validation.sameSourceAndDestination" });
                        }
                        return true;
                    }
                ),
            otherwise: (schema) => schema.nullable(),
        }),
});
