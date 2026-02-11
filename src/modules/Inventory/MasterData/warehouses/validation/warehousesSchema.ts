import * as yup from "yup";

export const warehousesSchema = yup.object({
  code: yup.string().nullable(),
  nameEn: yup.string().nullable(),
  nameAr: yup.string().nullable(),
  address: yup.string().nullable(),
  description: yup.string().nullable(),

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
  ).nullable() 
});
