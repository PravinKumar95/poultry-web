import { ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../../../components/ui/column-header";

export interface FeedInventory {
  id: string;
  material: string;
  paid: boolean;
  supplier: string;
  cost: number;
  timestamp: Date;
  quantity: number;
}

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
  {
    id: "actions",
    meta: { isHidden: true },
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
