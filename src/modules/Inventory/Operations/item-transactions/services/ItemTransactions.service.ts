import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination, ItemTransactionsResponse, MergeOrTransferTransactionsPayload  } from "../types/ItemTransactions";


export const ItemTransactionsService = {
  async getAll(params: Pagination) {

    const resp = await axiosWrapper.get<ItemTransactionsResponse>(
      `/MergeOrTransferTransactions`, { params }
    );
    return resp.data;
  },
  async create(payload: MergeOrTransferTransactionsPayload) {
    const data = await axiosWrapper.post<any>(`/MergeOrTransferTransactions`, payload);
    return data.data;
  },
};