import { ReactElement } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "../../dialog";
import { Button } from "../../button";
import { Input } from "../../input";
import { Label } from "../../label";
import { Table } from "@tanstack/react-table";
import { useFormContext } from "react-hook-form";

interface AddItemDialogProps<TData> {
  trigger: ReactElement;
  table: Table<TData>;
  onSave: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  columnTypes: Record<string, string>; // key: column name, value: type (e.g., 'boolean', 'text', 'number')
}
const AddItemDialog: <TData>({
  trigger,
  table,
  onSave,
  open,
  onOpenChange,
  columnTypes,
}: AddItemDialogProps<TData>) => JSX.Element = ({
  trigger,
  table,
  onSave,
  open,
  onOpenChange,
  columnTypes,
}) => {
  const { register } = useFormContext();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add </DialogTitle>
        </DialogHeader>
        <form>
          <div className="grid gap-4 py-2">
            {table.getFlatHeaders().map((header) => {
              const headerText = header.isPlaceholder ? null : header.id;
              const accessorKey =
                (header.column.columnDef as { accessorKey?: string })
                  .accessorKey || "";
              const isHidden = !!(
                header.column.columnDef.meta as { isHidden?: boolean }
              )?.isHidden;
              // Skip hidden columns or columns without an accessorKey
              if (isHidden || !accessorKey) return null;
              const colType = columnTypes[accessorKey];
              return (
                !isHidden && (
                  <div key={header.id} className="grid gap-2">
                    <Label htmlFor={accessorKey}>{headerText}</Label>
                    {colType === "boolean" ? (
                      <input
                        id={accessorKey}
                        type="checkbox"
                        {...register(accessorKey)}
                      />
                    ) : (
                      <Input
                        id={accessorKey}
                        placeholder={`Enter ${headerText}`}
                        type={colType === "number" ? "number" : "text"}
                        {...register(accessorKey)} // Dynamically register fields
                      />
                    )}
                  </div>
                )
              );
            })}
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={onSave}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
