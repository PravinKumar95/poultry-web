import { DataTable } from "../ui/data-table";
import { feedInventoryColumns } from "./columns";

const FeedInventory = () => {
  return (
    <DataTable
      columns={feedInventoryColumns}
      data={[
        {
          id: "1",
          material: "Maize",
          cost: 100,
          quantity: 100,
          paid: false,
          supplier: "Deva",
          timestamp: new Date(),
        },
        {
          id: "2",
          material: "Corm",
          cost: 10,
          quantity: 40,
          paid: true,
          supplier: "lalith",
          timestamp: new Date(),
        },
        {
          id: "3",
          material: "Sugar",
          cost: 49,
          quantity: 80,
          paid: false,
          supplier: "Prakash",
          timestamp: new Date(),
        },
      ]}
    />
  );
};

export default FeedInventory;
