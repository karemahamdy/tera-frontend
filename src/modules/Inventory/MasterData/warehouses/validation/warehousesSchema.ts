import * as yup from "yup";

export const warehousesSchema = yup.object({
  code: yup.string().required("form.fieldRequired"),
  nameEn: yup.string().required("form.fieldRequired"),
  nameAr: yup.string().required("form.fieldRequired"),
  address: yup.string().nullable(),
  description: yup.string().nullable(),

  // IDs need to be strings, usually UUIDs. Required if strictly needed by backend.
  managerId: yup.string().nullable(),
  defaultLedgerCardId: yup.string().nullable(),
  transferAccountId: yup.string().nullable(),

  type: yup.string().nullable(),
  operationalHours: yup.string().nullable(),

  allowNegativeBalance: yup.boolean(),
  isActive: yup.boolean(),

  zones: yup.array().of(
    yup.object({
      code: yup.string().required(),
      name: yup.string().required(),
      rows: yup.number().required(),
      columns: yup.number().required(),
      racks: yup.number().required(),
      locationRequest: yup.array()
    })
  ).nullable() // Zones might be optional initially or empty
});
