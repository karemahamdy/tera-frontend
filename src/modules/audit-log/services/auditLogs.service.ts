import axiosWrapper from "@/app/http/axiosWrapper";
import type { pageParams } from "@/modules/user-group/types/groups";


export const AuditService = {
  async getAll(params: pageParams) {
   
    const query = new URLSearchParams();
    query.append("PageIndex", params.pageIndex.toString());
    if (params.pageSize) query.append("PageSize", params.pageSize.toString());
    if (params.searchingWord)
      query.append("SearchingWord", params.searchingWord);
    if (params.orderBy) query.append("OrderBy", params.orderBy);
    if (params.orderDirection)
      query.append("OrderDirection", params.orderDirection);

    const resp = await axiosWrapper.get<any>(
      `/audit-logs?${query.toString()}`
    );
    return resp;
  },

};
