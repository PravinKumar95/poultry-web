import MaterialPurchase from "@/domain/inventory/components/FeedInventory";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/(app)/_auth/feed-mill/material-purchase"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <MaterialPurchase />;
}
