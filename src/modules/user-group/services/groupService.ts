// modules/user-groups/services/group.service.ts

import axios from "axios";
import type { GroupApiItem } from "../types/groupList";

const BASE_URL =
  "https://teraerptesting-ffgxa9ejepc4bpfp.canadacentral-01.azurewebsites.net/api/Group";

export const GroupService = {
  async getAll(pageIndex = 1): Promise<GroupApiItem[]> {
    const { data } = await axios.get(
      `${BASE_URL}/GetAllGroup?PagenationDto.PageIndex=${pageIndex}`
    );

    return data.data.items;
  }
};
