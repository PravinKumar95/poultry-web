import { Table } from "@tanstack/react-table";
import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "../../checkbox";
import { Input } from "../../input";
import { Label } from "../../label";
import { Calendar28 } from "../../Calendar28";
import { useEffect } from "react";

interface ItemDialogFieldsProps<TData> {
  table: Table<TData>;
  columnTypes: Record<string, string>;
  mode: "add" | "edit";
}

function getTodayDateString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function ItemDialogFields<TData>({
  table,
  columnTypes,
  mode,
}: ItemDialogFieldsProps<TData>) {
  const { register, control, getValues, setValue, reset } = useFormContext();

  useEffect(() => {
    // Reset form values when mode changes
    reset();
  }, [mode, reset]);

  return (
    <div className="grid gap-4 py-2">
      {table.getFlatHeaders().map((header) => {
        // Prefer columnDef.header if it's a string, or if it's a function/component with a 'title' prop
        let headerText = header.id;
        const colDefHeader = header.column.columnDef.header;
        if (typeof colDefHeader === "string") {
          headerText = colDefHeader;
        } else if (
          colDefHeader &&
          typeof colDefHeader === "function" &&
          colDefHeader.name === "DataTableColumnHeader"
        ) {
          // Try to extract title from props if possible
          const meta = header.column.columnDef.meta as any;
          if (meta && meta.title) headerText = meta.title;
        } else if (
          header.column.columnDef.meta &&
          (header.column.columnDef.meta as any).title
        ) {
          headerText = (header.column.columnDef.meta as any).title;
        }
        const accessorKey =
          (header.column.columnDef as { accessorKey?: string }).accessorKey ||
          "";
        const meta = header.column.columnDef.meta as {
          showInAdd?: boolean;
          showInEdit?: boolean;
        };
        const show = mode === "add" ? meta?.showInAdd : meta?.showInEdit;
        if (!show || !accessorKey) return null;
        const colType = columnTypes[accessorKey];
        // Set default value for date field in add mode
        if (colType === "date" && mode === "add") {
          const currentValue = getValues(accessorKey);
          if (!currentValue) {
            setValue(accessorKey, getTodayDateString());
          }
        }
        return (
          <div key={header.id} className="grid gap-2">
            {colType === "boolean" ? (
              <div className="flex items-center gap-2">
                <Checkbox id={accessorKey} {...register(accessorKey)} />
                <span
                  className="text-sm font-medium cursor-pointer select-none"
                  onClick={() => document.getElementById(accessorKey)?.click()}
                >
                  {headerText}
                </span>
              </div>
            ) : colType === "date" ? (
              <Controller
                name={accessorKey}
                control={control}
                render={({ field }) => (
                  <Calendar28
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => {
                      field.onChange(
                        date
                          ? `${date.getFullYear()}-${String(
                              date.getMonth() + 1
                            ).padStart(2, "0")}-${String(
                              date.getDate()
                            ).padStart(2, "0")}`
                          : ""
                      );
                    }}
                    label={headerText}
                  />
                )}
              />
            ) : (
              <>
                <Label htmlFor={accessorKey}>{headerText}</Label>
                <Input
                  id={accessorKey}
                  placeholder={`Enter ${headerText}`}
                  type={colType === "number" ? "number" : "text"}
                  {...register(accessorKey)}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
