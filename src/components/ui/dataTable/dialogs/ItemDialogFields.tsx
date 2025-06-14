import { Table } from "@tanstack/react-table";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "../../checkbox";
import { Input } from "../../input";
import { Label } from "../../label";

interface ItemDialogFieldsProps<TData> {
  table: Table<TData>;
  columnTypes: Record<string, string>;
  mode: "add" | "edit";
}

export function ItemDialogFields<TData>({
  table,
  columnTypes,
  mode,
}: ItemDialogFieldsProps<TData>) {
  const { register } = useFormContext();
  return (
    <div className="grid gap-4 py-2">
      {table.getFlatHeaders().map((header) => {
        const headerText = header.isPlaceholder ? null : header.id;
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
        return (
          <div key={header.id} className="grid gap-2">
            {colType === "boolean" ? (
              <div className="flex items-center gap-2">
                <Checkbox id={accessorKey} {...register(accessorKey)} />
                <span
                  className="text-sm font-medium cursor-pointer select-none"
                  onClick={() =>
                    document.getElementById(accessorKey)?.click()
                  }
                >
                  {headerText}
                </span>
              </div>
            ) : colType === "date" ? (
              <>
                <Label htmlFor={accessorKey}>{headerText}</Label>
                <Input
                  id={accessorKey}
                  type="date"
                  {...register(accessorKey)}
                />
              </>
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
