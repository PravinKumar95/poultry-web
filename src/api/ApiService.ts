import { supabase } from "@/lib/supabase";
import type { PaginatedResult } from "./types";

export const ApiService = {
  async fetchTable({
    tableName,
    page = 1,
    pageSize = 10,
    search = "",
    searchColumn = "",
    dateRange,
    dateRangeColumn = "",
  }: {
    tableName: string;
    page?: number;
    pageSize?: number;
    search?: string;
    searchColumn?: string;
    dateRange?: { from?: Date; to?: Date };
    dateRangeColumn?: string;
  }): Promise<PaginatedResult<any>> {
    let query = supabase.from(tableName).select("*", { count: "exact" });
    if (search && searchColumn) {
      query = query.ilike(searchColumn, `%${search}%`);
    }
    if (dateRange && dateRangeColumn && dateRange.from && dateRange.to) {
      query = query.gte(dateRangeColumn, dateRange.from.toISOString());
      query = query.lte(dateRangeColumn, dateRange.to.toISOString());
    }
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
    const { data, error, count } = await query;
    if (error) throw new Error(error.message + JSON.stringify({ tableName }));
    return { data: data ?? [], total: count ?? 0 };
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
