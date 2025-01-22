import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(app)/_auth/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  return <div>test</div>;
}
