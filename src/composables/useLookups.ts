import { LookupsService } from "@/app/services/lookups.service";
import { ref } from "vue";

  const loading = ref(false);
  const roles = ref<{ id: string; name: string }[]>([]);
  const branches = ref<{ id: string; name: string }[]>([]);
  const groups = ref<{ id: string; name: string }[]>([]);
   const error = ref<string | null>(null);
  
export function useLookups() {

const fetchLookups = async () => {
    loading.value = true;
    try {
      const branchResp = await LookupsService.getBranchLookups();
      branches.value = (branchResp || []).map((branch: any) => {
        const rawId = branch.id ;
        return {
          id: String(rawId),
          name: branch.name,
        };
      });
      branches.value = branches.value;

      const rolesResp = await LookupsService.getRolesLookups();
      roles.value = (rolesResp || []).map((role: any) => {
        const rawId = role.id ;
        return {
          id: String(rawId),
          name: role.name,
        };
      });
      const groupResp = await LookupsService.getGroupLookups();
      groups.value = (groupResp || []).map((group: any) => {
        const rawId = group.id ;
        return {
          id: String(rawId),
          name: group.name ,
        };
      });
    } catch (err: any) {
      error.value = err.message || "Error fetching lookups";
    } finally {
      loading.value = false;
    }
  };
return {
    fetchLookups,
    loading,    
    error,
    roles,  
    groups,
    branches,
  };
}