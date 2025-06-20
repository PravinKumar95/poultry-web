import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../../../components/ui/column-header";
import { FeedInventory } from "../schema/FeedInventory";
import { formatDateDDMMYYYY } from "@/utils/date";

export const feedInventoryColumns: ColumnDef<FeedInventory>[] = [
  {
    id: "select",
    meta: {
      showInTable: true,
      showInAdd: false,
      showInEdit: false,
      title: "Select",
    },
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "Material",
    accessorKey: "material",
    meta: { showInTable: true, showInAdd: true, showInEdit: true },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    id: "Paid",
    accessorKey: "paid",
    meta: { showInTable: true, showInAdd: true, showInEdit: true },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    id: "Price (kg)",
    accessorKey: "price",
    meta: { showInTable: true, showInAdd: true, showInEdit: true },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.id}
        className="justify-end"
      />
    ),
    cell: ({ row, column }) => {
      const amount = parseFloat(row.getValue(column.id));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "Quantity",
    accessorKey: "quantity",
    meta: { showInTable: true, showInAdd: true, showInEdit: true },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.id}
        className="justify-end"
      />
    ),
    cell: ({ row, column }) => (
      <div className="text-right font-medium">{row.getValue(column.id)}</div>
    ),
  },
  {
    id: "vendor",
    accessorKey: "vendor",
    meta: {
      showInTable: true,
      showInAdd: true,
      showInEdit: true,
      title: "Vendor",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vendor" />
    ),
  },
  {
    id: "purchase_date",
    accessorKey: "purchase_date",
    meta: {
      showInTable: true,
      showInAdd: true,
      showInEdit: true,
      title: "Purchase Date",
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Purchase Date"
        className="justify-end"
      />
    ),
    cell: ({ row, column }) => {
      const date = row.getValue(column.id) as string | Date | null | undefined;
      return (
        <div className="text-right font-medium">{formatDateDDMMYYYY(date)}</div>
      );
    },
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    meta: { showInTable: false, showInAdd: false, showInEdit: false },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created At"
        className="justify-end"
      />
    ),
    cell: ({ row, column }) => {
      const date = row.getValue(column.id) as string | Date | null | undefined;
      return (
        <div className="text-right font-medium">{formatDateDDMMYYYY(date)}</div>
      );
    },
  },
  {
    id: "Amount",
    accessorKey: "amount",
    meta: { showInTable: true, showInAdd: false, showInEdit: false },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Amount (INR)"
        className="justify-end"
      />
    ),
    cell: ({ row, column }) => {
      const amount = parseFloat(row.getValue(column.id));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
