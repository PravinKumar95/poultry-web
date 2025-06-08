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
import EditItemDialog from "./dataTable/dialogs/EditItemDialog";
import { useSupabaseColumnTypes } from "@/hooks/useSupabaseColumnTypes";
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
import { ApiService } from "@/api/ApiService";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast-util";
import { Badge } from "@/components/ui/badge";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  tableName: string;
}

export function DataTable<TData extends FieldValues, TValue>({
  columns,
  tableName,
}: DataTableProps<TData, TValue>) {
  const queryClient = useQueryClient();
  const { data: tableData, refetch } = useInfiniteQuery({
    queryKey: ["tableQuery", tableName],
    queryFn: async (): Promise<TData[]> => {
      return ApiService.fetchTable(tableName);
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
      return ApiService.addRow(tableName, newData);
    },
    onSuccess: () => {
      showSuccessToast(
        "Added successfully!",
        "The item was added to the table."
      );
      queryClient.invalidateQueries({ queryKey: ["tableQuery", tableName] });
    },
    onError: (error) => {
      showErrorToast(
        "Add failed",
        error instanceof Error ? error.message : String(error)
      );
      console.error("Error inserting data:", error);
    },
  });
  const deleteMutation = useMutation({
    mutationKey: ["tableDeleteMut", tableName],
    mutationFn: async (ids: Array<string | number>) => {
      return ApiService.deleteRows(tableName, ids);
    },
    onSuccess: () => {
      showSuccessToast(
        "Deleted successfully!",
        "The selected item(s) were deleted."
      );
      queryClient.invalidateQueries({ queryKey: ["tableQuery", tableName] });
    },
    onError: (error) => {
      showErrorToast(
        "Delete failed",
        error instanceof Error ? error.message : String(error)
      );
      console.error("Error deleting data:", error);
    },
  });
  const updateMutation = useMutation({
    mutationKey: ["tableUpdateMut", tableName],
    mutationFn: async (
      updateData: Partial<TData> & { id: string | number }
    ) => {
      const { id, ...rest } = updateData;
      const computedColumns = ["amount"];
      let filtered = Object.fromEntries(
        Object.entries(rest).filter(
          ([key, value]) =>
            !computedColumns.includes(key) &&
            value !== undefined &&
            (!editRow || value !== (editRow as any)[key])
        )
      );
      const neverUpdate = ["created_at", "tenant_id", "id"];
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(
          ([key, value]) => !neverUpdate.includes(key) && value !== null
        )
      );
      if (Object.keys(filtered).length === 0) return;
      for (const key in filtered) {
        if (filtered[key] instanceof Date) {
          filtered[key] = filtered[key].toISOString();
        }
      }
      return ApiService.updateRow(tableName, id, filtered);
    },
    onSuccess: () => {
      showSuccessToast("Updated successfully!", "The item was updated.");
      queryClient.invalidateQueries({ queryKey: ["tableQuery", tableName] });
    },
    onError: (error) => {
      showErrorToast(
        "Update failed",
        error instanceof Error ? error.message : String(error)
      );
      console.error("Error updating data:", error);
    },
  });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editRow, setEditRow] = React.useState<TData | null>(null);
  const table = useReactTable({
    data: tableData?.pages[0] || [],
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
  const editForm = useForm<TData>();
  const columnTypes = useSupabaseColumnTypes(tableName);
  const handleAdd: SubmitHandler<TData> = (newRow) => {
    addMutation.mutate(newRow, {
      onSuccess: () => {
        setAddDialogOpen(false);
        form.reset();
      },
    });
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
  const handleEdit = (row: TData) => {
    setEditRow(row);
    setEditDialogOpen(true);
    setTimeout(() => editForm.reset(row), 0); // ensure form context is ready
  };
  const handleEditSave = editForm.handleSubmit((values) => {
    if (editRow && (editRow as any).id) {
      updateMutation.mutate(
        { ...values, id: (editRow as any).id },
        {
          onSuccess: () => {
            setEditDialogOpen(false);
            setEditRow(null);
            editForm.reset();
            // Force a refetch to ensure UI updates
            refetch();
          },
        }
      );
    }
  });
  React.useEffect(() => {
    const handler = (e: any) => {
      setEditRow(e.detail);
      setEditDialogOpen(true);
    };
    window.addEventListener("open-edit-dialog", handler);
    return () => window.removeEventListener("open-edit-dialog", handler);
  }, []);
  return (
    <FormProvider {...form}>
      <div>
        <div className="flex py-2">
          <AddItemDialog
            open={addDialogOpen}
            onOpenChange={setAddDialogOpen}
            trigger={
              <Button size="sm" className="mx-2">
                <Plus />
                Add
              </Button>
            }
            table={table}
            columnTypes={columnTypes}
            onSave={form.handleSubmit((values) => {
              handleAdd(values);
            })}
          />
          <EditItemDialog
            open={editDialogOpen}
            onOpenChange={(open) => {
              setEditDialogOpen(open);
              if (!open) setEditRow(null);
            }}
            trigger={<></>}
            table={table}
            columnTypes={columnTypes}
            onSave={handleEditSave}
            defaultValues={editRow || {}}
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
                    {row.getVisibleCells().map((cell) => {
                      const accessorKey = (
                        cell.column.columnDef as { accessorKey?: string }
                      )?.accessorKey;
                      const isBoolean =
                        accessorKey && columnTypes[accessorKey] === "boolean";
                      const value = cell.getValue();
                      return (
                        <TableCell key={cell.id}>
                          {isBoolean ? (
                            <Badge
                              className={
                                value ? "bg-green-600 text-white" : undefined
                              }
                              variant={value ? "default" : "destructive"}
                            >
                              {value ? "Yes" : "No"}
                            </Badge>
                          ) : (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(row.original)}
                      >
                        Edit
                      </Button>
                    </TableCell>
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
