import { supabase } from "@/lib/supabase";

export const ApiService = {
  async fetchTable(tableName: string): Promise<any[]> {
    const { data, error } = await supabase.from(tableName).select("*");
    if (error) throw new Error(error.message + JSON.stringify({ tableName }));
    return data ?? [];
  },
  async addRow(
    tableName: string,
    newData: Record<string, any>
  ): Promise<any[]> {
    const { data, error } = await supabase
      .from(tableName)
      .insert(newData)
      .select();
    if (error) throw new Error(error.message + JSON.stringify({ newData }));
    return data ?? [];
  },
  async deleteRows(
    tableName: string,
    ids: Array<string | number>
  ): Promise<any[]> {
    if (!ids || ids.length === 0) return [];
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .in("id", ids);
    if (error) throw new Error(error.message + JSON.stringify({ ids }));
    return data ?? [];
  },
  async updateRow(
    tableName: string,
    id: string | number,
    updateData: Record<string, any>
  ): Promise<any[]> {
    const { data, error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq("id", id)
      .select();
    if (error)
      throw new Error(error.message + JSON.stringify({ updateData, id }));
    return data ?? [];
  },
};
