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

interface AddItemDialogProps<TData> {
  trigger: ReactElement;
  table: Table<TData>;
  onSave: () => void;
}
const AddItemDialog: <TData>({
  trigger,
  table,
  onSave,
}: AddItemDialogProps<TData>) => JSX.Element = ({ trigger, table, onSave }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          {table &&
            table.getFlatHeaders().map((header) => {
              const headerText = header.isPlaceholder ? null : header.id;
              return (
                !header.column.columnDef.meta?.isHidden && (
                  <div key={header.id} className="grid gap-2">
                    <Label htmlFor={header.id}>{headerText}</Label>
                    <Input id={header.id} placeholder={`Enter ${headerText}`} />
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
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
