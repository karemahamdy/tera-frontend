import axiosWrapper from "@/app/http/axiosWrapper";
import type {  Pagination, SessionResponse } from "../types/activeSessionsList";

export const SessionService = {
  async getSessions(params: Pagination)  {
  const response = await axiosWrapper.get<SessionResponse>("/Session/Get-All-Session" , { params });
  return response;
},

  async forceLogout(sessionId: string) {
    return await axiosWrapper.post("/Session/force-logout", {
      sessionId,
    });
  },
  
};
