import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Utility hook to fetch column types from Supabase
export function useSupabaseColumnTypes(tableName: string) {
  const [columnTypes, setColumnTypes] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchTypes() {
      const { data, error } = await supabase.rpc("pg_table_columns", {
        tablename: tableName,
      });
      if (!error && data) {
        const types: Record<string, string> = {};
        data.forEach((col: any) => {
          if (col.data_type === "boolean") types[col.column_name] = "boolean";
          else if (
            col.data_type === "integer" ||
            col.data_type === "numeric" ||
            col.data_type === "bigint"
          )
            types[col.column_name] = "number";
          else types[col.column_name] = "text";
        });
        setColumnTypes(types);
      }
    }
    fetchTypes();
  }, [tableName]);

  return columnTypes;
}
