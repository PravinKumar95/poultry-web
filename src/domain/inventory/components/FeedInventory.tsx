import useTableQuery from "@/hooks/useTableQuery";
import { DataTable } from "../../../components/ui/data-table";
import { feedInventoryColumns } from "./columns";

const FeedInventory = () => {
  const { data } = useTableQuery({ tableName: "material_purchase" });
  return (
    <DataTable columns={feedInventoryColumns} data={data?.pages[0] || []} />
  );
};

export default FeedInventory;
