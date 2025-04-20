import { supabase } from "@/lib/supabase";
import { useInfiniteQuery } from "@tanstack/react-query";

type TableQueryProps = {
  tableName: string;
};

const queryKey = "TableQuery";

const useTableQuery = ({ tableName }: TableQueryProps) => {
  const queryFn = async ({ pageParam = 0 }) => {
    const { data, error } = await supabase.from(tableName).select("*");
    if (error) {
      throw new Error("Network response was not ok");
    }
    return data;
  };
  return useInfiniteQuery({
    queryKey: [queryKey, tableName],
    queryFn,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length ? pages.length : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialPageParam: 0,
  });
};

export default useTableQuery;
