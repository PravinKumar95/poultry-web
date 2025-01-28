import { ThemeProvider } from "@/components/theme-provider";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import "../index.css";
import type { AuthContext } from "@/context/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/api/queryClient";
import React, { Suspense } from "react";

interface RouterContext {
  auth: AuthContext;
}

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <ThemeProvider defaultTheme="system" storageKey="farmiz-theme">
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </ThemeProvider>
      <Suspense>
        <TanStackRouterDevtools position="bottom-right" />
      </Suspense>
    </>
  ),
});
