import { ThemeProvider } from "@/components/theme-provider";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import "../index.css";
import type { AuthContext } from "@/context/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/api/queryClient";
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";

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
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
      <Suspense>
        <TanStackRouterDevtools position="bottom-right" />
      </Suspense>
    </>
  ),
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <h1 className="text-3xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-muted-foreground mb-4">
        The page you are looking for does not exist.
      </p>
      <a href="/" className="text-primary underline">
        Go Home
      </a>
    </div>
  ),
});
