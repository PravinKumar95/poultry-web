import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../../../components/ui/column-header";
import { FeedInventory } from "../schema/FeedInventory";

export const feedInventoryColumns: ColumnDef<FeedInventory>[] = [
  {
    id: "select",
    meta: { isHidden: true },
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    id: "Paid",
    accessorKey: "paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    id: "Price (kg)",
    accessorKey: "price",
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
    id: "created_at",
    accessorKey: "created_at",
    meta: { isHidden: true },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Purchase Date"
        className="justify-end"
      />
    ),
    cell: ({ row, column }) => {
      const date = new Date(row.getValue(column.id));
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);

      return <div className="text-right font-medium">{formattedDate}</div>;
    },
  },
  {
    id: "Amount",
    accessorKey: "amount",
    meta: { isHidden: true },
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
