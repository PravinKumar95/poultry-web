import { AppSidebar } from "@/components/nav/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { supabase } from "@/lib/supabase";

import { Separator } from "@radix-ui/react-separator";
import {
  Outlet,
  createFileRoute,
  redirect,
  useLocation,
} from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/_auth")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: "/signin",
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  const path = useLocation({ select: (location) => location.pathname });
  const routes = path
    .split("/")
    .slice(1)
    .map((route) => route.replace("-", " "));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {routes.map((route, index) => {
                  return (
                    <>
                      {index !== 0 && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                      <BreadcrumbItem
                        className={
                          index !== routes.length - 1
                            ? "hidden md:block"
                            : undefined
                        }
                      >
                        <BreadcrumbPage className="capitalize">
                          {route}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />;
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
