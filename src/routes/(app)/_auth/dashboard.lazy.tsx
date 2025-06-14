import { createLazyFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(app)/_auth/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  // Temporary redirect to material-purchase route
  return <Navigate to="/feed-mill/material-purchase" />;
}
