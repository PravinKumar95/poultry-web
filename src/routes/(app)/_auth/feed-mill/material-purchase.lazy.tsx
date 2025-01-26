import MaterialPurchase from "@/components/inventory/FeedInventory";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/(app)/_auth/feed-mill/material-purchase"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <MaterialPurchase />;
}
