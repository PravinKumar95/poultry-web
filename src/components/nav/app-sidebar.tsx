"use client";

import * as React from "react";
import { GalleryVerticalEnd, TowerControl } from "lucide-react";

import { NavMain } from "@/components/nav/nav-main";

import { NavUser } from "@/components/nav/nav-user";
import { AppSwitcher } from "@/components/nav/app-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { useProfileQuery } from "@/api/hooks/profile/useProfileQuery";

// This is sample data.
const data = {
  apps: [
    {
      name: "Farmiz Inc",
      logo: GalleryVerticalEnd,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Feed Mill",
      url: "#",
      icon: TowerControl,
      isActive: true,
      items: [
        {
          title: "Material Purchase",
          url: "feed-mill/material-purchase",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const profileQuery = useProfileQuery();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppSwitcher apps={data.apps} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: profileQuery.data, email: "" }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
