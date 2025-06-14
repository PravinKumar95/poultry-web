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
import { ItemDialogFields } from "./ItemDialogFields";
import { Table } from "@tanstack/react-table";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Add </DialogTitle>
        </DialogHeader>
        <form>
          <ItemDialogFields table={table} columnTypes={columnTypes} mode="add" />
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
