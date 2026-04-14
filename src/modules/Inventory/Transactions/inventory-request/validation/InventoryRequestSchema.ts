import * as yup from "yup";

export const InventoryRequestSchema = yup.object({
  type: yup.string().required("validation.typeRequired"),

  warehouseId: yup
    .string()
    .required("validation.sourceWarehouseRequired"),

  destinationWarehouseId: yup
    .string()
    .nullable()
    .test(
      "transfer-validation",
      "validation.targetWarehouseRequired",
      function (value) {
        const { type } = this.parent;

        // ❌ لو Transfer لازم destination
        if (type === "Transfer" && !value) {
          return this.createError({
            message: "validation.targetWarehouseRequired",
          });
        }

        return true;
      }
    )

    .test(
      "same-source-destination",
      "validation.sameSourceAndDestination",
      function (value) {
        const { type, warehouseId, zoneId, destinationZoneId } = this.parent;

        if (type !== "Transfer") return true;

        if (value && warehouseId && value === warehouseId) {
          if (zoneId && destinationZoneId && zoneId !== destinationZoneId) {
            return true;
          }

          return false;
        }

        return true;
      }
    ),
});