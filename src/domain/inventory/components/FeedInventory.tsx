import { DataTable } from "../../../components/ui/data-table";
import { feedInventoryColumns } from "./columns";

const FeedInventory = () => {
  return (
    <DataTable
      columns={feedInventoryColumns}
      tableName="material_purchase"
      dateRangeColumn="purchase_date"
    />
  );
};

export default FeedInventory;
