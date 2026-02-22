import axiosWrapper from "@/app/http/axiosWrapper";
import type { IPLookups, Lookups, CodeLookups, reasonsLookups, ApiResponse } from "../types/lookups";

export const LookupsService = {
getGroupLookups(isActive: boolean = true) {
  return axiosWrapper.get<{ data: Lookups[] }>(
    `/Lookups/GroupLookups?isActive=${isActive}`,
  );
},
getBranchLookups(isActive: boolean = true) {
  return axiosWrapper.get<{ data: Lookups[] }>(
    `/Lookups/BranchLookups?isActive=${isActive}`,
  );
},
getEntityLookups() {
  return axiosWrapper.get<{ data: Lookups[] }>("/Lookups/EntityLookups");
},
getRolesLookups(isActive: boolean = true) {
  return axiosWrapper.get<{ data: Lookups[] }>(
    `/Lookups/RolesLookups?isActive=${isActive}`,
  );
},
getScreenLookups() {
  return axiosWrapper.get<{ data: CodeLookups[] }>("/Lookups/ScreenLookups");
},
getModuleLookups() {
  return axiosWrapper.get<{ data: CodeLookups[] }>("/Lookups/ModulesLookups");
},
getIPLookups() {
  return axiosWrapper.get<{ data: IPLookups[] }>("/Lookups/IpAddress-Lookup");
},
getDepartmentsLookups(isActive: boolean = true) {
  return axiosWrapper.get<{ data: Lookups[] }>(
    `/Lookups/DepartmentsLookups?isActive=${isActive}`,
  );
},
getUsersLookups() {
  return axiosWrapper.get<{ data: Lookups[] }>(`/Users`);
},

getUserAssignedBranchesLookups(isActive: boolean = true) {
  return axiosWrapper.get<{ data: Lookups[] }>(
    `/Lookups/LoggedUserAssignedBranchesLookups?isActive=${isActive}`,
  );
},

getWarehouseLookups(isActive: boolean = true) {
  return axiosWrapper.get<{ data: Lookups[] }>(
    `/Lookups/WarehouseLookups?isActive=${isActive}`,
  );
},
getItemClassificationLookups(
  level: "Category" | "Group1" | "Group2" | "Group3" | "Group4" = "Category",
) {
  return axiosWrapper.get<{ data: Lookups[] }>(
    `/Lookups/ItemClassificationLookups/${level}`,
  );
},
getItemTypeLookups() {
  return axiosWrapper.get<{ data: Lookups[] }>("/Lookups/ItemTypeLookups");
},
getBusinessPartnerLookups(isActive: boolean = true) {
  return axiosWrapper.get<{ data: Lookups[] }>(
    `/Lookups/BusinessPartnerLookups?isActive=${isActive}`,
  );
},
getUnitsLookups(isActive: boolean = true) {
  return axiosWrapper.get<{ data: Lookups[] }>(
    `/Lookups/UnitLookups?isActive=${isActive}`,
  );
},
getCurrencyLookups(isActive: boolean = true) {
  return axiosWrapper.get<{ data: Lookups[] }>(
    `/Lookups/CurrencyLookups?isActive=${isActive}`,
  );
},
getTaxLookups(isActive: boolean = true) {
  return axiosWrapper.get<{ data: Lookups[] }>(
    `/Lookups/TaxLookups?isActive=${isActive}`,
  );
},
getLedgerDetailCardLookups(isActive: boolean = true) {
  return axiosWrapper.get<{ data: Lookups[] }>(
    `/Lookups/LedgerDetailCardLookups?isActive=${isActive}`,
  );
},
getCostcenterLookups(isActive: boolean = true) {
  return axiosWrapper.get<{ data: Lookups[] }>(
    `/Lookups/CostcenterLookups?isActive=${isActive}`,
  );
},

getAccountsLookups(isActive: boolean = true) {
  return axiosWrapper.get<{ data: Lookups[] }>(
    `/Lookups/ChartOfAccountLookups?isActive=${isActive}`,
  );
},
getItemGroupLookups() {
  return axiosWrapper.get<{ data: Lookups[] }>(
    `/Lookups/ItemClassificationLookups/Category`,
  );
},
getReasonLookups() {
  return axiosWrapper.get<{ data: reasonsLookups[] }>(
    `/InventoryLookups/return-reasons`,
  );
},
parseSerials(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return axiosWrapper.post<ApiResponse<any[]>>(
    `/InventoryLookups/parse-serials`,
    formData,
  );
},
};
