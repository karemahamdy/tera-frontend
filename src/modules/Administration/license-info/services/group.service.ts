import axiosWrapper from "@/app/http/axiosWrapper";
import type { ActivationInformationResponse } from "../types/license";

export const AdministrationService = {
 async getActivationInformation() {
   const data = await axiosWrapper.get<ActivationInformationResponse>(
      'Adminstration/get-activation-information'
    );
   return data
  }
};