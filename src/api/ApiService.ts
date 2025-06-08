import { supabase } from "@/lib/supabase";

export const ApiService = {
  async fetchTable(tableName) {
    const { data, error } = await supabase.from(tableName).select("*");
    if (error) throw new Error("Network response was not ok");
    return data;
  },
  async addRow(tableName, newData) {
    const { data, error } = await supabase.from(tableName).insert(newData);
    if (error) throw new Error("Network response was not ok");
    return data;
  },
  async deleteRows(tableName, ids) {
    if (!ids || ids.length === 0) return;
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .in("id", ids);
    if (error) throw new Error("Network response was not ok");
    return data;
  },
  async updateRow(tableName, id, updateData) {
    const { data, error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq("id", id)
      .select();
    if (error)
      throw new Error(error.message + JSON.stringify({ updateData, id }));
    return data;
  },
};
