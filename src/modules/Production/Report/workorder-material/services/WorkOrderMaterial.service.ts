import axiosWrapper from "@/app/http/axiosWrapper";

export const BOMReportService = {
  async getAll(params: any): Promise<any> {
    const resp = await axiosWrapper.get<any>(
      `/BOMReport`, { params }
    );
    return resp;
  },


};