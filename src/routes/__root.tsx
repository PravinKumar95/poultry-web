import { ThemeProvider } from "@/components/theme-provider";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import "../index.css";
import type { AuthContext } from "@/context/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/api/queryClient";

interface RouterContext {
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <ThemeProvider defaultTheme="system" storageKey="farmiz-theme">
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </ThemeProvider>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  ),
});
