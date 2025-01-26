import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
const ProfileQueryId = "ProfileQueryId";
export const useProfileQuery = () => {
  return useQuery({
    queryKey: [ProfileQueryId],
    queryFn: async () => {
      const res = await supabase.from("profiles").select("full_name");
      return res.data ? res.data[0].full_name : "";
    },
  });
};
