"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React from "react";
import { DataTablePagination } from "./pagination";
import { DataTableViewOptions } from "./column-toggle";
import { Button } from "./button";
import { Plus, Trash } from "lucide-react";
import AddItemDialog from "./dataTable/dialogs/AddItemDialog";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  tableName: string;
}

export function DataTable<TData extends FieldValues, TValue>({
  columns,
  tableName,
}: DataTableProps<TData, TValue>) {
  const queryClient = useQueryClient();
  const { data } = useInfiniteQuery({
    queryKey: ["tableQuery", tableName],
    queryFn: async (): Promise<TData[]> => {
      const { data, error } = await supabase.from(tableName).select("*");
      if (error) {
        throw new Error("Network response was not ok");
      }
      return data;
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length ? pages.length : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialPageParam: 0,
  });
  const addMutation = useMutation({
    mutationKey: ["tableAddMut", tableName],
    mutationFn: async (newData: TData) => {
      const { data, error } = await supabase.from(tableName).insert(newData);
      if (error) {
        throw new Error("Network response was not ok");
      }
      return data;
    },
    onSuccess: (data) => {
      console.log("Data inserted successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["tableQuery", tableName] });
    },
    onError: (error) => {
      console.error("Error inserting data:", error);
    },
  });
  const deleteMutation = useMutation({
    mutationKey: ["tableDeleteMut", tableName],
    mutationFn: async (ids: Array<string | number>) => {
      if (!ids || ids.length === 0) return;
      const { data, error } = await supabase
        .from(tableName)
        .delete()
        .in("id", ids);
      if (error) {
        throw new Error("Network response was not ok");
      }
      return data;
    },
    onSuccess: (data) => {
      console.log("Data deleted successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["tableQuery", tableName] });
    },
    onError: (error) => {
      console.error("Error deleting data:", error);
    },
  });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data: data?.pages[0] || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const form = useForm<TData>();
  const handleAdd: SubmitHandler<TData> = (newRow) => {
    addMutation.mutate(newRow);
    form.reset();
  };
  const handleDelete = () => {
    // Get selected rows from the table
    const selectedRows = table.getSelectedRowModel().rows;
    // Extract the actual database IDs from the selected rows
    const selectedRowIds = selectedRows.map((row) => row.original.id);
    if (selectedRowIds.length > 0) {
      deleteMutation.mutate(selectedRowIds);
    }
  };
  return (
    <FormProvider {...form}>
      <div>
        <div className="flex py-2">
          <AddItemDialog
            trigger={
              <Button size="sm" className="mx-2">
                <Plus />
                Add
              </Button>
            }
            table={table}
            onSave={form.handleSubmit((values) => {
              handleAdd(values);
            })}
          />
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={Object.keys(rowSelection).length === 0}
          >
            <Trash />
            Delete
          </Button>
          <DataTableViewOptions table={table} />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="space-x-2 py-4">
          <DataTablePagination table={table} />
        </div>
      </div>
    </FormProvider>
  );
}
