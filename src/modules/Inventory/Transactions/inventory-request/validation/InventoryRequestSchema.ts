import * as yup from "yup";

export const InventoryRequestSchema = yup.object({
  type: yup.string().required("form.fieldRequired"),

  warehouseId: yup
    .string()
    .required("form.fieldRequired"),

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
            message: "form.fieldRequired",
          });
        }

        return true;
      }
    )

    .test(
      "same-source-destination",
      "form.fieldRequired",
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