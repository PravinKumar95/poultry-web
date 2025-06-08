import { ReactElement, useEffect } from "react";
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
import { Table } from "@tanstack/react-table";
import { useFormContext } from "react-hook-form";
import { ItemDialogFields } from "./ItemDialogFields";

interface EditItemDialogProps<TData> {
  trigger: ReactElement;
  table: Table<TData>;
  onSave: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  columnTypes: Record<string, string>;
  defaultValues: Partial<TData>;
}
const EditItemDialog: <TData>({
  trigger,
  table,
  onSave,
  open,
  onOpenChange,
  columnTypes,
  defaultValues,
}: EditItemDialogProps<TData>) => JSX.Element = ({
  trigger,
  table,
  onSave,
  open,
  onOpenChange,
  columnTypes,
  defaultValues,
}) => {
  const { reset } = useFormContext();
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
        </DialogHeader>
        <form>
          <ItemDialogFields table={table} columnTypes={columnTypes} />
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

export default EditItemDialog;
