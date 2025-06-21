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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "@/api/ApiService";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast-util";
import { Badge } from "@/components/ui/badge";
import { DateRangeFilter } from "./dataTable/DateRangeFilter";
import { Input } from "./input";

interface DateRange {
  from?: Date;
  to?: Date;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  tableName: string;
  dateRangeColumn?: string;
}

function getColumnLabel<TData, TValue>(column: ColumnDef<TData, TValue>) {
  // @ts-expect-error: meta is user-defined
  if (column.meta?.title) return column.meta.title;
  if (typeof column.header === "string") return column.header;
  // @ts-expect-error: id/accessorKey may be present
  return column.id ?? column.accessorKey ?? "";
}

export function DataTable<TData extends FieldValues, TValue>({
  columns,
  tableName,
  dateRangeColumn,
}: DataTableProps<TData, TValue>) {
  const queryClient = useQueryClient();
  // Pagination and search state
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [searchColumn] = React.useState<string>(
    columns.find((col) => (col as any).accessorKey)?.accessorKey ?? ""
  );
  const [dateRange, setDateRange] = React.useState<DateRange>({});

  // Fetch paginated data
  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "tableQuery",
      tableName,
      page,
      pageSize,
      search,
      searchColumn,
      dateRange,
      dateRangeColumn,
    ],
    queryFn: () =>
      ApiService.fetchTable({
        tableName,
        page,
        pageSize,
        search,
        searchColumn,
        dateRange,
        dateRangeColumn,
      }),
    keepPreviousData: true,
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
      return ApiService.updateRow(tableName, id, rest);
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
  // Filter data by dateRange if dateRangeColumn is provided
  const filteredData = React.useMemo(() => {
    if (!dateRangeColumn || !dateRange.from || !dateRange.to) {
      return data?.data ?? [];
    }
    return (data?.data ?? []).filter((row) => {
      const dateValue = (row as Record<string, unknown>)[dateRangeColumn];
      const date = dateValue ? new Date(dateValue as string) : null;
      if (!date) return false;
      return date >= dateRange.from! && date <= dateRange.to!;
    });
  }, [data, dateRange, dateRangeColumn]);
  const table = useReactTable({
    data: filteredData,
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
  const addForm = useForm<TData>();
  const editForm = useForm<TData>();
  const columnTypes = useSupabaseColumnTypes(tableName);
  const handleAdd: SubmitHandler<TData> = (newRow) => {
    addMutation.mutate(newRow, {
      onSuccess: () => {
        setAddDialogOpen(false);
        addForm.reset();
      },
    });
  };
  const handleDelete = () => {
    // Get selected rows from the table
    const selectedRows = table.getSelectedRowModel().rows;
    // Extract the actual database IDs from the selected rows
    const selectedRowIds = selectedRows.map((row) => row.original.id);
    if (selectedRowIds.length > 0) {
      deleteMutation.mutate(selectedRowIds, {
        onSuccess: () => {
          // Clear selection after delete
          setRowSelection({});
        },
      });
    }
  };
  const handleEdit = (row: TData) => {
    setEditRow(row);
    setEditDialogOpen(true);
    // Use defaultValues to ensure form is always in sync with row
    setTimeout(() => editForm.reset({ ...row }), 0);
  };
  const handleEditSave = editForm.handleSubmit((values) => {
    if (editRow && (editRow as any).id) {
      const computedColumns = ["amount"];
      const neverUpdate = ["created_at", "tenant_id", "id"];
      let filtered = Object.fromEntries(
        Object.entries(values).filter(
          ([key, value]) =>
            !computedColumns.includes(key) &&
            !neverUpdate.includes(key) &&
            value !== null &&
            value !== undefined &&
            String(value) !== String((editRow as any)[key])
        )
      );
      for (const key in filtered) {
        if (filtered[key] instanceof Date) {
          filtered[key] = filtered[key].toISOString();
        }
      }
      if (Object.keys(filtered).length === 0) {
        setEditDialogOpen(false);
        setEditRow(null);
        editForm.reset();
        return;
      }
      const payload = Object.assign({}, filtered, {
        id: (editRow as any).id,
      }) as Partial<TData> & { id: string | number };
      updateMutation.mutate(payload, {
        onSuccess: () => {
          setEditDialogOpen(false);
          setEditRow(null);
          editForm.reset();
          refetch();
        },
        onError: () => {
          // Optionally handle error here
        },
      });
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
    <div>
      <div className="flex flex-col gap-2 py-2 w-full">
        <div className="w-full">
          <Input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border px-2 py-1 rounded text-sm w-full"
          />
        </div>
        <div className="flex flex-row flex-nowrap gap-2 w-full items-stretch sm:items-center justify-between">
          <div className="flex flex-row gap-2 flex-shrink-0">
            <FormProvider {...addForm}>
              <AddItemDialog
                open={addDialogOpen}
                onOpenChange={setAddDialogOpen}
                trigger={
                  <Button size="sm" className="w-full sm:w-auto">
                    <Plus />
                    Add
                  </Button>
                }
                table={table}
                columnTypes={columnTypes}
                onSave={addForm.handleSubmit((values) => {
                  handleAdd(values);
                })}
              />
            </FormProvider>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={Object.keys(rowSelection).length === 0}
              className="w-full sm:w-auto"
            >
              <Trash />
              Delete
            </Button>
          </div>
          <div className="flex flex-row gap-2 flex-shrink-0">
            {dateRangeColumn && (
              <div className="min-w-[150px]">
                <DateRangeFilter
                  label={getColumnLabel(
                    columns.find(
                      (col) =>
                        // @ts-expect-error: accessorKey is user-defined
                        col.accessorKey === dateRangeColumn
                    ) ?? columns[0]
                  )}
                  value={dateRange}
                  onChange={setDateRange}
                />
              </div>
            )}
            <div>
              <DataTableViewOptions table={table} />
            </div>
          </div>
        </div>
        <FormProvider {...editForm}>
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
            defaultValues={editRow ?? {}}
          />
        </FormProvider>
      </div>
      {/* Responsive table wrapper */}
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-full text-sm md:text-base">
          <TableHeader className="hidden md:table-header-group">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers
                  .filter((header) => {
                    const meta = header.column.columnDef.meta as {
                      showInTable?: boolean;
                    };
                    // Always show 'select' column
                    if (header.column.id === "select") return true;
                    return meta?.showInTable;
                  })
                  .map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-2 py-2 md:px-4 md:py-3"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {/* Only table rows, no mobile card-style rows */}
            {table.getRowModel().rows?.length ? (
              <>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="table-row"
                  >
                    {row
                      .getVisibleCells()
                      .filter((cell) => {
                        const meta = cell.column.columnDef.meta as {
                          showInTable?: boolean;
                        };
                        // Always show 'select' column
                        if (cell.column.id === "select") return true;
                        return meta?.showInTable;
                      })
                      .map((cell) => {
                        const accessorKey = (
                          cell.column.columnDef as { accessorKey?: string }
                        )?.accessorKey;
                        const isBoolean =
                          accessorKey && columnTypes[accessorKey] === "boolean";
                        const value = cell.getValue();
                        return (
                          <TableCell
                            key={cell.id}
                            className="px-2 py-2 md:px-4 md:py-3"
                          >
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
                    <TableCell className="px-2 py-2 md:px-4 md:py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(row.original)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </>
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
      <div className="space-x-2 py-4 flex items-center">
        <Button
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </Button>
        <span>
          Page {page} of {Math.ceil((data?.total ?? 0) / pageSize) || 1}
        </span>
        <Button
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={page * pageSize >= (data?.total ?? 0)}
        >
          Next
        </Button>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
          className="ml-2 border px-2 py-1 rounded text-sm"
        >
          {[10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
