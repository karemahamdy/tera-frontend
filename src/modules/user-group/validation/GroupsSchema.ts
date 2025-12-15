import * as yup from "yup";

export const groupFormSchema = yup.object({
  groupName: yup
    .string()
    .required("Group name is required")
    .min(3, "Minimum 3 characters"),

  description: yup
    .string()
    .nullable()
    .max(250, "Max 250 characters"),
});
