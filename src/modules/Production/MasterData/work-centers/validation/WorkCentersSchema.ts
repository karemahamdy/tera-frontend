
import * as yup from "yup";

export const WorkCentersschema = yup.object({
  workCenterCode: yup
    .string()
    .required("form.fieldRequired")
    .min(3, "form.min_3"),
  workCenterName: yup
    .string()
    .required("form.fieldRequired")
    .min(3, "form.min_3"),
 departmentId: yup
    .string()
    .required("form.fieldRequired")
    .min(1, "form.min_1"),
 
});
